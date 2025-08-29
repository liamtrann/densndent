import PropTypes from "prop-types";

import { formatDeliveryDays } from "config/config";

const WeekdaySelector = ({
  selectedDays = [],
  onChange,
  dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  className = "",
  disabled = false,
  label = "",
  inline = true,
  showQuickSelect = true, // New prop to show/hide quick select options
}) => {
  const handleDayToggle = (dayIndex) => {
    if (disabled) return;

    const dayValue = dayIndex + 1; // Convert 0-based index to 1-based value
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((day) => day !== dayValue)
      : [...selectedDays, dayValue].sort();

    onChange(newSelectedDays);
  };

  // Quick select handlers
  const handleSelectWholeWeek = () => {
    if (disabled) return;
    const allDays = [1, 2, 3, 4, 5, 6, 7]; // All 7 days (1-based)
    onChange(allDays);
  };

  const handleSelectWeekdays = () => {
    if (disabled) return;
    const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday (1-based)
    onChange(weekdays);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  // Check states for quick select buttons
  const isWholeWeekSelected = selectedDays.length === 7;
  const isWeekdaysSelected =
    selectedDays.length === 5 &&
    [1, 2, 3, 4, 5].every((day) => selectedDays.includes(day));

  const containerClass = inline
    ? "flex flex-wrap gap-4"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2";

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Quick Select Options */}
      {showQuickSelect && (
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSelectWholeWeek}
            disabled={disabled}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg border-2 shadow-sm hover:shadow-md
              transform hover:scale-105 transition-all duration-200 ease-in-out
              ${
                isWholeWeekSelected
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-orange-200"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed transform-none hover:shadow-sm" : "cursor-pointer"}
            `}
          >
            🗓️ Whole Week
          </button>

          <button
            type="button"
            onClick={handleSelectWeekdays}
            disabled={disabled}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg border-2 shadow-sm hover:shadow-md
              transform hover:scale-105 transition-all duration-200 ease-in-out
              ${
                isWeekdaysSelected
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-orange-200"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed transform-none hover:shadow-sm" : "cursor-pointer"}
            `}
          >
            💼 Weekdays Only
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled || selectedDays.length === 0}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg border-2 shadow-sm hover:shadow-md
              transform hover:scale-105 transition-all duration-200 ease-in-out
              bg-white border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700
              ${disabled || selectedDays.length === 0 ? "opacity-50 cursor-not-allowed transform-none hover:shadow-sm hover:bg-white hover:border-gray-200 hover:text-gray-700" : "cursor-pointer"}
            `}
          >
            🗑️ Clear All
          </button>
        </div>
      )}

      <div className={containerClass}>
        {dayLabels.map((dayLabel, index) => {
          const dayValue = index + 1; // Convert 0-based index to 1-based value
          return (
            <label
              key={index}
              className={`
                relative flex items-center justify-center min-w-[60px] cursor-pointer px-4 py-3 
                rounded-lg border-2 font-medium text-sm select-none
                shadow-sm hover:shadow-md transform hover:scale-105
                ${
                  selectedDays.includes(dayValue)
                    ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 text-orange-800 shadow-orange-200"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }
                ${disabled ? "opacity-50 cursor-not-allowed transform-none hover:shadow-sm" : ""}
                transition-all duration-200 ease-in-out
              `}
            >
              {/* Hidden checkbox */}
              <input
                type="checkbox"
                checked={selectedDays.includes(dayValue)}
                onChange={() => handleDayToggle(index)}
                disabled={disabled}
                className="sr-only"
              />

              {/* Custom checkbox indicator */}
              <div
                className={`
                absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${
                  selectedDays.includes(dayValue)
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300"
                }
                transition-all duration-200 ease-in-out
              `}
              >
                {selectedDays.includes(dayValue) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Day label */}
              <span className="font-semibold">{dayLabel}</span>
            </label>
          );
        })}
      </div>

      {/* Selected days summary */}
      {selectedDays.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-orange-700 font-medium text-sm">
              ✅ Selected days:
            </span>
            <span className="text-orange-800 text-sm font-semibold">
              {formatDeliveryDays(selectedDays)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

WeekdaySelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  dayLabels: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  inline: PropTypes.bool,
  showQuickSelect: PropTypes.bool,
};

export default WeekdaySelector;
