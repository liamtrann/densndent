// src/common/ui/StatusBadge.jsx
import { getOrderStatusConfig } from "constants/constant";

export default function StatusBadge({
  status,
  showIcon = true,
  showDescription = false,
  className = "",
}) {
  const config = getOrderStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}
        title={config.description}
      >
        {showIcon && <span className="text-sm">{config.icon}</span>}
        <span>{config.label}</span>
      </span>
      {showDescription && (
        <span className="text-xs text-gray-500">{config.description}</span>
      )}
    </div>
  );
}
