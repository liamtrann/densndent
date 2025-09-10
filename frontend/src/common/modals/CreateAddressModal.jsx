import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "store/slices/userSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  parsePreferredDays,
  serializePreferredDays,
  formatDeliveryDays,
  normalizePrefToString,
  validatePostalCode,
} from "config/config";
import { getStateOptions, normalizeStateInput } from "config/states";

import Toast from "../toast/Toast.js";
import Button from "../ui/Button";
import CloseButton from "../ui/CloseButton";
import Dropdown from "../ui/Dropdown";
import ErrorMessage from "../ui/ErrorMessage";
import InputField from "../ui/InputField";
import Loading from "../ui/Loading";
import WeekdaySelector from "../ui/WeekdaySelector";

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

  // Get user info for preferred days
  const userInfo = useSelector((s) => s.user.info);
  const defaultPreferredDays = parsePreferredDays(
    normalizePrefToString(userInfo?.custentity_prefer_delivery) ||
      (typeof window !== "undefined"
        ? localStorage.getItem("preferredDeliveryDays") || ""
        : "")
  );

  const [submitting, setSubmitting] = useState(false);

  // Setup react-hook-form with all fields
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors },
    watch,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      address1: address?.address1 || "",
      city: address?.city || "",
      state: address?.state || "",
      zip: address?.zip || "",
      defaultBilling: !!address?.defaultBilling,
      defaultShipping: !!address?.defaultShipping,
      preferredDays: defaultPreferredDays,
    },
  });

  const watchedZip = watch("zip");
  const watchedPreferredDays = watch("preferredDays");

  // Validate postal code on change
  useEffect(() => {
    if (watchedZip) {
      const postalErr = validatePostalCode(watchedZip, COUNTRY_CODE);
      if (postalErr) {
        setError("zip", { type: "manual", message: postalErr });
      } else {
        clearErrors("zip");
      }
    }
  }, [watchedZip, setError, clearErrors]);

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

  const onSubmit = async (data) => {
    // Check if any fields are dirty (changed)-  dirtyFields lets you send only what changed.
    const addressFieldsDirty =
      dirtyFields.address1 ||
      dirtyFields.city ||
      dirtyFields.state ||
      dirtyFields.zip ||
      dirtyFields.defaultBilling ||
      dirtyFields.defaultShipping;

    const preferredDaysDirty = dirtyFields.preferredDays;

    // If nothing changed, just close
    if (!addressFieldsDirty && !preferredDaysDirty) {
      Toast.info("No changes to save");
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(customerId);
      const headers = { Authorization: `Bearer ${token}` };

      const updatePayload = {};

      // Add address if dirty
      if (addressFieldsDirty) {
        const stateAbbr = normalizeStateInput(COUNTRY_CODE, data.state);
        updatePayload.addressBook = {
          items: [
            {
              addressBookAddress: {
                addr1: data.address1,
                city: data.city,
                state: stateAbbr,
                zip: data.zip,
                country: { id: COUNTRY_ID_FOR_NS },
              },
              defaultBilling: !!data.defaultBilling,
              defaultShipping: !!data.defaultShipping,
            },
          ],
        };
      }

      // Add preferred days if dirty
      if (preferredDaysDirty) {
        const preferredDaysItems = (data.preferredDays || []).map((day) => ({
          id: day,
        }));
        updatePayload.custentity_prefer_delivery = {
          items: preferredDaysItems,
        };
      }

      // Send PATCH request
      await api.patch(url, updatePayload, { headers });

      // Update localStorage for preferred days if changed
      if (preferredDaysDirty) {
        const preferredDaysString = serializePreferredDays(
          data.preferredDays || []
        );
        if (preferredDaysString) {
          localStorage.setItem("preferredDeliveryDays", preferredDaysString);
        } else {
          localStorage.removeItem("preferredDeliveryDays");
        }
      }

      // Refresh user info
      await dispatch(fetchUserInfo({ user, getAccessTokenSilently }));

      Toast.success("Address and preferred delivery days saved!");
      onAddressCreated?.();
      setTimeout(onClose, 0);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save address";
      Toast.error(`Failed to save address: ${errorMessage}`);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller //bridges RHF ↔ custom inputs.
            name="address1"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field, fieldState }) => (
              <InputField
                label="Address"
                {...field}
                value={field.value || ""}
                required
                error={fieldState.error?.message}
              />
            )}
          />
          <p className="text-xs text-gray-500">Example: 1234 Main Street</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field, fieldState }) => (
                <InputField
                  label="City"
                  {...field}
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="state"
              control={control}
              rules={{ required: "State/Province is required" }}
              render={({ field, fieldState }) => (
                <Dropdown
                  label="State/Province"
                  {...field}
                  options={stateOptions}
                  required
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="zip"
              control={control}
              rules={{ required: "Postal/Zip Code is required" }}
              render={({ field, fieldState }) => (
                <InputField
                  label="Postal/Zip Code"
                  {...field}
                  onChange={(e) => {
                    const raw = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9 ]/g, "");
                    const compact = raw.replace(/\s+/g, "");
                    const formatted =
                      compact.length > 3
                        ? `${compact.slice(0, 3)} ${compact.slice(3, 6)}`
                        : compact;
                    field.onChange(formatted);
                  }}
                  required
                  maxLength={7}
                  inputMode="text"
                  placeholder="A1A 1A1"
                  error={fieldState.error?.message || errors.zip?.message}
                />
              )}
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
              Selected: {formatDeliveryDays(watchedPreferredDays || [])}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <Controller
              name="defaultBilling"
              control={control}
              render={({ field }) => (
                <InputField
                  type="checkbox"
                  label="Set as default billing address"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </div>

          <div className="flex items-center mb-4">
            <Controller
              name="defaultShipping"
              control={control}
              render={({ field }) => (
                <InputField
                  type="checkbox"
                  label="Set as default shipping address"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
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
        </form>
      </div>
    </div>
  );
}
