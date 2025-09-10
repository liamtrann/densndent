// src/common/modals/CreateAddressModal.jsx
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "store/slices/userSlice";
import api from "api/api";
import endpoint from "api/endpoints";
import FormSubmit from "../forms/FormSubmit";
import Toast from "../toast/Toast";
import Button from "../ui/Button";
import CloseButton from "../ui/CloseButton";
import Dropdown from "../ui/Dropdown";
import InputField from "../ui/InputField";
import Loading from "../ui/Loading";
import ErrorMessage from "../ui/ErrorMessage";
import { useForm, Controller } from "react-hook-form";
import { WeekdaySelector } from "common";
import {
  parsePreferredDays,
  serializePreferredDays,
  formatDeliveryDays,
  normalizePrefToString,
  validatePostalCode,
} from "config/config";
import { getStateOptions, normalizeStateInput } from "config/states";

/* Minimal helper: set preferred days with 2 simple shapes */ //Some NetSuite REST endpoints accept and Some only accept JSON Patch format
async function savePreferredDays(url, headers, value /* string or null */) {
  //set preferred days with one tiny function
  // try {
  //   await api.patch(url, { custentity_prefer_delivery: value }, { headers }); //It tries top-level PATCH first
  //   return true;
  // } catch {
  //   try {
  //     await api.patch(
  //       url,
  //       [{ op: "replace", path: "/custentity_prefer_delivery", value }],
  //       { headers: { ...headers, "Content-Type": "application/json-patch+json" } } //If the server rejects that, it tries JSON Patch
  //     );
  //     return true; //Returns true if either works,
  //   } catch {
  //     return false; //false if both fail.
  //   }
  // }
  await api.patch(url, { custentity_prefer_delivery: value }, { headers });
}

export default function CreateAddressModal({
  onClose,
  onAddressCreated,
  address = null, // { address1, city, state, zip, defaultBilling, defaultShipping }
  customerId,
  error,
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const COUNTRY_CODE = "ca";
  const COUNTRY_ID_FOR_NS = "CA";

  // Prefill preferred days (backend then localStorage)
  const userInfo = useSelector((s) => s.user.info);
  const defaultPreferredDays = parsePreferredDays(
    normalizePrefToString(userInfo?.custentity_prefer_delivery) || //your backend might return values as a string, array, or object. This function converts “whatever it is” into a plain string
      (typeof window !== "undefined"
        ? localStorage.getItem("preferredDeliveryDays") || ""
        : "")
  );

  // RHF for preferred days (kept separate from address fields)
  const { control, getValues: getRHFValues } = useForm({
    //RHF because WeekdaySelector is custom controlled component. Using RHF’s <Controller> makes “selected days” field to integrate as a single form value
    defaultValues: { preferredDays: defaultPreferredDays },
  });

  //address fields in plain useState so changing one doesn’t reset the other. (Days and address are independent.)
  // Local state for address fields
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    defaultBilling: false,
    defaultShipping: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill address once when editing
  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName || "",
        address1: address.address1 || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
        defaultBilling: !!address.defaultBilling,
        defaultShipping: !!address.defaultShipping,
      });
    }
  }, [address]);

  if (!customerId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        {error && <ErrorMessage message={error} />}
        <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
          <CloseButton onClick={onClose} />
          <h2 className="text-xl font-semibold mb-4">Update</h2>
          <div className="text-red-600 mb-4">
            You need to create your profile before you can update your address.
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stateOptions = getStateOptions(COUNTRY_CODE);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    })); //Works for text inputs and checkboxes with one function
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const nextErrors = {};
    const postalErr = validatePostalCode(formData.zip, COUNTRY_CODE);
    if (postalErr) nextErrors.zip = postalErr;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const preferredDays = getRHFValues("preferredDays") || []; //Read the current preferred days value from react-hook-form.
    // If nothing is selected, default to an empty array.
    const preferredDaysString = serializePreferredDays(preferredDays);
    const prefValue = preferredDaysString || null;

    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(customerId); // Build the endpoint URL for updating this specific customer.
      const headers = { Authorization: `Bearer ${token}` };
      const stateAbbr = normalizeStateInput(COUNTRY_CODE, formData.state);

      //Build the address payload in the shape your backend expects
      const addressPayload = {
        addressBook: {
          items: [
            {
              addressBookAddress: {
                addr1: formData.address1,
                city: formData.city,
                state: stateAbbr,
                zip: formData.zip,
                country: { id: COUNTRY_ID_FOR_NS },
              },
              defaultBilling: !!formData.defaultBilling,
              defaultShipping: !!formData.defaultShipping,
            },
          ],
        },
      };

      // 1) Try one combined PATCH as some NetSuite records/endpoints reject “mixed” updates (nested address ) in the same PATCH.
      try {
        await api.patch(
          url,
          { ...addressPayload, custentity_prefer_delivery: prefValue },
          { headers }
        ); //First, save address alone
      } catch {
        // 2) Fallback: address first, then preferred days
        //await api.patch(url, addressPayload, { headers }); //the second api.patch—used only when the first attempt fails.
        //const prefOk = await savePreferredDays(url, headers, prefValue); //It tries top-level PATCH and, if needed, JSON Patch.

       // if (!prefOk) throw new Error("pref-failed");
      }

      // Update UI immediately
      if (preferredDaysString)
        localStorage.setItem("preferredDeliveryDays", preferredDaysString); //so the UI has a fallback value instantly (and on the next modal open) even before/if the backend reflects it.
      else localStorage.removeItem("preferredDeliveryDays");

      await dispatch(fetchUserInfo({ user, getAccessTokenSilently })); //refreshes Redux with the latest profile from the backend so the “My Settings → Addresses” card shows the new info right away.
      Toast.success("Address and preferred delivery days saved!");
      onAddressCreated?.();
      setTimeout(onClose, 0);
    } catch (err) {
      Toast.error("Failed to save address. Please try again."); //If both fail, we throw an error and show a toast.
      console.error(
        "Save failed:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <CloseButton onClick={onClose} />
        <h2 className="text-xl font-semibold mb-4">Update</h2>

        {submitting && <Loading />}

        <FormSubmit onSubmit={handleAddressSubmit} className="space-y-4">
          <InputField
            label="Address"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500">Example: 1234 Main Street</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Dropdown
              label="State/Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={stateOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Postal/Zip Code"
              name="zip"
              value={formData.zip}
              onChange={(e) => {
                const raw = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9 ]/g, "");
                const compact = raw.replace(/\s+/g, "");
                const formatted =
                  compact.length > 3
                    ? `${compact.slice(0, 3)} ${compact.slice(3, 6)}`
                    : compact;
                setFormData((prev) => ({ ...prev, zip: formatted }));
              }}
              required
              maxLength={7}
              inputMode="text"
              placeholder="A1A 1A1"
              error={errors.zip}
            />
          </div>

          {/* Preferred Delivery Days */}
          <div className="mt-2">
            <div className="text-sm font-medium mb-2">
              Preferred delivery days
            </div>
            <Controller
              name="preferredDays"
              control={control}
              render={({ field }) => (
                <WeekdaySelector
                  selectedDays={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="text-xs text-gray-500 mt-2">
              Selected:{" "}
              {formatDeliveryDays(getRHFValues("preferredDays") || [])}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <InputField
              type="checkbox"
              label="Set as default billing address"
              name="defaultBilling"
              checked={formData.defaultBilling}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center mb-4">
            <InputField
              type="checkbox"
              label="Set as default shipping address"
              name="defaultShipping"
              checked={formData.defaultShipping}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Address
            </Button>
          </div>
        </FormSubmit>
      </div>
    </div>
  );
}
