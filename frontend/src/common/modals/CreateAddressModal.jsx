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

/* ------------------------ API helpers (local) ------------------------ */
async function tryUpdatePreferredDays({ url, token, value }) {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    await api.patch(url, { custentity_prefer_delivery: value }, { headers });
    return "top-level";
  } catch {}

  try {
    await api.patch(
      url,
      { customFields: { custentity_prefer_delivery: value } },
      { headers }
    );
    return "customFields";
  } catch {}

  await api.patch(
    url,
    [{ op: "replace", path: "/custentity_prefer_delivery", value }],
    { headers: { ...headers, "Content-Type": "application/json-patch+json" } }
  );
  return "json-patch";
}

/** Prefer a single combined PATCH (address + pref). Fallback to two calls. */
async function saveAddressAndPref({ url, token, addressPayload, prefString }) {
  const headers = { Authorization: `Bearer ${token}` };

  if (prefString) {
    const combinedBodies = [
      { ...addressPayload, custentity_prefer_delivery: prefString },
      { ...addressPayload, customFields: { custentity_prefer_delivery: prefString } },
    ];
    for (const body of combinedBodies) {
      try {
        await api.patch(url, body, { headers });
        return { addressSaved: true, prefSaved: true, mode: "combined" };
      } catch {}
    }
  }

  // Fallback: address, then pref
  await api.patch(url, addressPayload, { headers });

  if (prefString) {
    try {
      await tryUpdatePreferredDays({ url, token, value: prefString });
      return { addressSaved: true, prefSaved: true, mode: "separate" };
    } catch {
      return { addressSaved: true, prefSaved: false, mode: "address-only" };
    }
  }

  return { addressSaved: true, prefSaved: false, mode: "address-only" };
}
/* -------------------------------------------------------------------- */

export default function CreateAddressModal({
  onClose,
  onAddressCreated,
  address = null,
  customerId,
  error,
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  // You can expose a country selector later; for now default to Canada.
  const COUNTRY_CODE = "ca"; // "us" also supported by states.js
  const COUNTRY_ID_FOR_NS = "CA"; // what your backend expects in the payload

  // Prefill preferred days from profile
  const userInfo = useSelector((s) => s.user.info);
  const defaultPreferredDays = parsePreferredDays(
    normalizePrefToString(
      userInfo?.custentity_prefer_delivery ??
        userInfo?.customFields?.custentity_prefer_delivery
    )
  );

  const { control, getValues: getRHFValues } = useForm({
    defaultValues: { preferredDays: defaultPreferredDays },
  });

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

  // Build dropdown from centralized mappings
  const stateOptions = getStateOptions(COUNTRY_CODE);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    // Use shared validator based on country
    const newErrors = {};
    const postalError = validatePostalCode(formData.zip, COUNTRY_CODE);
    if (postalError) newErrors.zip = postalError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const preferredDays = getRHFValues("preferredDays") || [];
    const preferredDaysString = serializePreferredDays(preferredDays);

    setSubmitting(true);

    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(customerId);

      const stateAbbr = normalizeStateInput(COUNTRY_CODE, formData.state);

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

      const result = await saveAddressAndPref({
        url,
        token,
        addressPayload,
        prefString: preferredDaysString,
      });

      // Mirror preference to localStorage for UI fallback
      if (result.prefSaved && preferredDaysString) {
        localStorage.setItem("preferredDeliveryDays", preferredDaysString);
      } else {
        localStorage.removeItem("preferredDeliveryDays");
      }

      // Refresh profile so the cards show the new info
      await dispatch(fetchUserInfo({ user, getAccessTokenSilently }));

      if (result.addressSaved && result.prefSaved) {
        Toast.success("Address and preferred delivery days saved!");
      } else if (result.addressSaved && !result.prefSaved) {
        Toast.error("Address saved, but preferred delivery days couldn’t be updated.");
      } else {
        Toast.error("Failed to save address. Please try again.");
      }

      onAddressCreated?.();
      setTimeout(onClose, 0);
    } catch {
      Toast.error("Failed to save address. Please try again.");
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
              onChange={handleChange}
              required
              maxLength={7}
              pattern="[A-Za-z][0-9][A-Za-z]\s?[0-9][A-Za-z][0-9]"
              placeholder="A1A 1A1"
              error={errors.zip}
            />
          </div>

          {/* Preferred Delivery Days */}
          <div className="mt-2">
            <div className="text-sm font-medium mb-2">Preferred delivery days</div>
            <Controller
              name="preferredDays"
              control={control}
              render={({ field }) => (
                <WeekdaySelector selectedDays={field.value || []} onChange={field.onChange} />
              )}
            />
            <div className="text-xs text-gray-500 mt-2">
              Selected: {formatDeliveryDays(getRHFValues("preferredDays") || [])}
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
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>Save Address</Button>
          </div>
        </FormSubmit>
      </div>
    </div>
  );
}
