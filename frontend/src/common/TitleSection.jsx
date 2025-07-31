import React from "react";

/**
 * 🎨 TitleSection Component
 *
 * A reusable, beautiful section header component with gradient styling,
 * icons, and customizable colors for different section types.
 *
 * @param {string} title - Main title text
 * @param {string} subtitle - Subtitle/description text
 * @param {React.ReactNode} icon - SVG icon component
 * @param {string} colorScheme - Color theme: 'blue', 'emerald', 'purple'
 * @param {number} itemCount - Optional item count to display
 * @param {string} itemLabel - Label for items (e.g., 'items', 'brands', 'categories')
 */
export default function TitleSection({
  title,
  subtitle,
  icon,
  colorScheme = "blue",
  itemCount,
  itemLabel = "items",
}) {
  // Color scheme configurations using custom Tailwind colors
  const colorSchemes = {
    blue: {
      iconColor: "text-smiles-blue",
      gradientFrom: "from-transparent to-smiles-blue",
      gradientTo: "from-transparent to-smiles-blue",
      textGradient: "from-gray-800 to-smiles-blue",
    },
    emerald: {
      iconColor: "text-smiles-green",
      gradientFrom: "from-transparent to-smiles-green",
      gradientTo: "from-transparent to-smiles-green",
      textGradient: "from-gray-800 to-smiles-green",
    },
    purple: {
      iconColor: "text-smiles-gentleBlue",
      gradientFrom: "from-transparent to-smiles-gentleBlue",
      gradientTo: "from-transparent to-smiles-gentleBlue",
      textGradient: "from-gray-800 to-smiles-gentleBlue",
    },
    orange: {
      iconColor: "text-smiles-orange",
      gradientFrom: "from-transparent to-smiles-orange",
      gradientTo: "from-transparent to-smiles-orange",
      textGradient: "from-gray-800 to-smiles-orange",
    },
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.blue;

  // Build subtitle with optional item count
  const buildSubtitle = () => {
    if (itemCount !== undefined) {
      const countText = `${itemCount} ${
        itemCount === 1 ? itemLabel.slice(0, -1) : itemLabel
      }`;
      return subtitle ? `${subtitle} • ${countText}` : countText;
    }
    return subtitle;
  };

  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-[2px] bg-gradient-to-r ${colors.gradientFrom}`}
        ></div>
        <div className="flex items-center gap-2">
          {icon && <div className={`w-6 h-6 ${colors.iconColor}`}>{icon}</div>}
          <h2
            className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}
          >
            {title}
          </h2>
        </div>
        <div
          className={`w-8 h-[2px] bg-gradient-to-l ${colors.gradientTo}`}
        ></div>
      </div>
      {buildSubtitle() && (
        <p className="text-gray-600 text-sm md:text-base font-medium">
          {buildSubtitle()}
        </p>
      )}
    </div>
  );
}
