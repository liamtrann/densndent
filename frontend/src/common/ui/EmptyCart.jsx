// src/common/ui/EmptyCart.jsx
import { useNavigate } from "react-router-dom";

/**
 * EmptyCart Component - A reusable component for displaying empty cart states
 * 
 * @param {string} title - The main heading text
 * @param {string} description - The descriptive text below the title
 * @param {boolean} showBrowseButton - Whether to show the browse products button
 * @param {boolean} showHomeButton - Whether to show the home button
 * @param {string} browseButtonText - Text for the browse button
 * @param {string} homeButtonText - Text for the home button
 * @param {string} browseButtonPath - Navigation path for browse button
 * @param {string} homeButtonPath - Navigation path for home button
 * @param {boolean} showHelpSection - Whether to show the help section
 * @param {string} helpTitle - Title for the help section
 * @param {string} helpDescription - Description for the help section
 * @param {string} className - Additional CSS classes for the container
 * 
 * @example
 * // Basic usage
 * <EmptyCart />
 * 
 * @example
 * // Customized for different context
 * <EmptyCart 
 *   title="No items found"
 *   description="Try adjusting your search criteria"
 *   showHelpSection={false}
 *   browseButtonText="Search Again"
 * />
 */

const EmptyCart = ({ 
  title = "Your cart is empty",
  description = "Add some items to your cart to proceed with checkout. Browse our products and find something you love!",
  showBrowseButton = true,
  showHomeButton = true,
  browseButtonText = "Browse Products",
  homeButtonText = "Go to Home",
  browseButtonPath = "/products",
  homeButtonPath = "/",
  showHelpSection = true,
  helpTitle = "Need help getting started?",
  helpDescription = "Explore our featured products, check out our latest deals, or use the search function to find exactly what you're looking for.",
  className = "max-w-4xl mx-auto px-6 py-10"
}) => {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <div className="text-center">
        {/* Empty Cart Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2H3m4 10v6m0 0h10v-6M7 19a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"
              />
            </svg>
          </div>
          
          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            {description}
          </p>
          
          {/* Action Buttons */}
          {(showBrowseButton || showHomeButton) && (
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              {showBrowseButton && (
                <button
                  onClick={() => navigate(browseButtonPath)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  {browseButtonText}
                </button>
              )}
              
              {showHomeButton && (
                <button
                  onClick={() => navigate(homeButtonPath)}
                  className="w-full sm:w-auto bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  {homeButtonText}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Additional Help */}
        {showHelpSection && (
          <div className="mt-12 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {helpTitle}
            </h3>
            <p className="text-blue-800 text-sm">
              {helpDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyCart;
