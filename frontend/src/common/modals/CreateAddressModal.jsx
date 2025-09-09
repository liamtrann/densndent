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
} from "config/config";

/* ---------- helpers ---------- */
function normalizePrefToString(any) {
  if (any == null) return "";
  if (typeof any === "string" || typeof any === "number") return String(any);
  if (Array.isArray(any)) {
    const parts = any
      .map((el) => {
        if (el == null) return null;
        if (typeof el === "string" || typeof el === "number") return String(el);
        if (typeof el === "object") {
          return el.id ?? el.value ?? el.text ?? el.name ?? (typeof el.label === "string" ? el.label : null);
        }
        return null;
      })
      .filter(Boolean);
    return parts.join(", ");
  }
  if (typeof any === "object") {
    const maybeList = any.values ?? any.selected ?? any.ids ?? any.list;
    if (Array.isArray(maybeList)) return normalizePrefToString(maybeList);
    return normalizePrefToString(any.value ?? any.id ?? any.text ?? any.data ?? any.name ?? "");
  }
  return "";
}

async function tryUpdatePreferredDays({ url, token, value }) {
  const headers = { Authorization: `Bearer ${token}` };
  try {
    await api.patch(url, { custentity_prefer_delivery: value }, { headers });
    return;
  } catch {}
  try {
    await api.patch(url, { customFields: { custentity_prefer_delivery: value } }, { headers });
    return;
  } catch {}
  try {
    await api.patch(
      url,
      [{ op: "replace", path: "/custentity_prefer_delivery", value }],
      { headers: { ...headers, "Content-Type": "application/json-patch+json" } }
    );
    return;
  } catch (e) {
    throw e;
  }
}

export default function CreateAddressModal({
  onClose,
  onAddressCreated,
  address = null,
  customerId,
  error,
}) {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const userInfo = useSelector((s) => s.user.info);
  const defaultPreferredDays = parsePreferredDays(
    normalizePrefToString(
      userInfo?.custentity_prefer_delivery ?? userInfo?.customFields?.custentity_prefer_delivery
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
          <div className="text-red-600 mb-4">You need to create your profile before you can update your address.</div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  const stateOptions = [
    { label: "-- Select --", value: "" },
    { label: "Alberta (AB)", value: "AB" },
    { label: "British Columbia (BC)", value: "BC" },
    { label: "Manitoba (MB)", value: "MB" },
    { label: "New Brunswick (NB)", value: "NB" },
    { label: "Newfoundland and Labrador (NL)", value: "NL" },
    { label: "Nova Scotia (NS)", value: "NS" },
    { label: "Northwest Territories (NT)", value: "NT" },
    { label: "Nunavut (NU)", value: "NU" },
    { label: "Ontario (ON)", value: "ON" },
    { label: "Prince Edward Island (PE)", value: "PE" },
    { label: "Quebec (QC)", value: "QC" },
    { label: "Saskatchewan (SK)", value: "SK" },
    { label: "Yukon (YT)", value: "YT" },
    { label: "China", value: "CN" },
    { label: "Hong Kong", value: "HK" },
    { label: "India", value: "IN" },
  ];

  const validateZip = (zip) => /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(zip);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateZip(formData.zip)) {
      newErrors.zip = "Zip code must be 6 characters, alternating letter and number (e.g., A1B2C3).";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const preferredDays = getRHFValues("preferredDays") || [];
    const preferredDaysString = serializePreferredDays(preferredDays);

    setSubmitting(true);
    let addressSaved = false;
    let prefFailed = false;

    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(customerId);

      // (1) Save address
      await api.patch(
        url,
        {
          addressBook: {
            items: [
              {
                addressBookAddress: {
                  addr1: formData.address1,
                  city: formData.city,
                  state: formData.state,
                  zip: formData.zip,
                  country: { id: "CA" },
                },
                defaultBilling: !!formData.defaultBilling,
                defaultShipping: !!formData.defaultShipping,
              },
            ],
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addressSaved = true;

      // (2) Save preferred days (and mirror to localStorage so UI can show it)
      if (preferredDaysString) {
        try {
          await tryUpdatePreferredDays({ url, token, value: preferredDaysString });
          // mirror to localStorage for UI fallback
          localStorage.setItem("preferredDeliveryDays", preferredDaysString);
        } catch {
          prefFailed = true;
        }
      } else {
        localStorage.removeItem("preferredDeliveryDays");
      }

      // (3) Refresh profile
      await dispatch(fetchUserInfo({ user, getAccessTokenSilently }));

      // (4) Toasts
      if (addressSaved && !prefFailed) {
        Toast.success("Address and preferred delivery days saved!");
      } else if (addressSaved && prefFailed) {
        Toast.error("Address saved, but preferred delivery days couldn’t be updated.");
      } else {
        Toast.error("Failed to save address. Please try again.");
      }

      onAddressCreated?.();
      setTimeout(onClose, 0);
    } catch (err) {
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
          <InputField label="Address" name="address1" value={formData.address1} onChange={handleChange} required />
          <p className="text-xs text-gray-500">Example: 1234 Main Street</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Dropdown label="State" name="state" value={formData.state} onChange={handleChange} options={stateOptions} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Zip Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              maxLength={6}
              pattern="[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]"
              placeholder="A1B2C3"
              error={errors.zip}
            />
          </div>

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
            <InputField type="checkbox" label="Set as default billing address" name="defaultBilling" checked={formData.defaultBilling} onChange={handleChange} />
          </div>

          <div className="flex items-center mb-4">
            <InputField type="checkbox" label="Set as default shipping address" name="defaultShipping" checked={formData.defaultShipping} onChange={handleChange} />
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
