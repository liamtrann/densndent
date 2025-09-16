// src/common/ui/PreferDeliveryDaySelector.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "store/slices/userSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import { TextButton, WeekdaySelector, Toast } from "common";
import {
  preferredDaysTextFromSources,
  parsePreferredDays,
  serializePreferredDays,
} from "config/config";

export default function PreferDeliveryDaySelector({
  className = "",
  showModal = true,
  onNavigateToProfile,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const userInfo = useSelector((state) => state.user.info);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();

  const handleChangeClick = () => {
    if (showModal) {
      // Initialize with current user preferences when opening modal
      const currentDays = parsePreferredDays(userInfo?.prefer_delivery || []);
      setSelectedDays(currentDays);
      setIsModalOpen(true);
    } else if (onNavigateToProfile) {
      onNavigateToProfile();
    } else {
      navigate("/profile");
    }
  };

  const handleSave = async () => {
    if (!userInfo?.id) {
      Toast.error("User ID not found");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(userInfo.id);
      const headers = { Authorization: `Bearer ${token}` };

      // Format preferred days for NetSuite API
      const preferredDaysItems = (selectedDays || []).map((day) => ({
        id: day,
      }));

      const updatePayload = {
        custentity_prefer_delivery: {
          items: preferredDaysItems,
        },
      };

      // Send PATCH request
      await api.patch(url, updatePayload, { headers });

      // Update localStorage
      const preferredDaysString = serializePreferredDays(selectedDays || []);
      if (preferredDaysString) {
        localStorage.setItem("preferredDeliveryDays", preferredDaysString);
      } else {
        localStorage.removeItem("preferredDeliveryDays");
      }

      // Refresh user info
      await dispatch(fetchUserInfo({ user, getAccessTokenSilently }));

      Toast.success("Preferred delivery days saved!");
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save preferred delivery days";
      Toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={`mt-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">
              Preferred delivery day:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {preferredDaysTextFromSources({ userInfo })}
            </span>
          </div>
          <TextButton
            onClick={handleChangeClick}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Change
          </TextButton>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Select Preferred Delivery Days
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <WeekdaySelector
              selectedDays={selectedDays}
              onChange={setSelectedDays}
              label="Select your preferred delivery days:"
            />

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
