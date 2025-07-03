// components/profile/SettingsCard.jsx
import React from "react";

export default function SettingsCard({ title, children }) {
  return (
    <div className="bg-white border p-4 rounded shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}
