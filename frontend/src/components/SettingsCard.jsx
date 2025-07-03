// components/profile/SettingsCard.jsx
import React from "react";
import Paragraph from "../common/Paragraph";

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
    return <Paragraph className="text-sm mb-4">{description}</Paragraph>;
  };

  return (
    <div className="bg-white border p-4 rounded shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      {renderDescription()}
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
  );
}
