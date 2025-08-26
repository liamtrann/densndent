// components/profile/SettingsCard.jsx
import React from "react";

import { Paragraph } from "common";

export default function SettingsCard({
  title,
  description,
  actionLabel,
  onAction,
  actionHref = "#",
}) {
  const renderDescription = () => {
    if (Array.isArray(description)) {
      return description.map((text, i) => (
        <Paragraph key={i} className="text-sm mb-2">
          {text}
        </Paragraph>
      ));
    }
    return <div className="text-sm mb-4">{description}</div>;
  };

  return (
    <div className="bg-white border p-4 rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {actionLabel && (
          <a
            href={actionHref}
            onClick={onAction}
            className="text-sm text-blue-600 hover:underline"
          >
            {actionLabel}
          </a>
        )}
      </div>
      {renderDescription()}
    </div>
  );
}
