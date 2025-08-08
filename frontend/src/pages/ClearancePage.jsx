import React from "react";
import Breadcrumb from '../common/navigation/Breadcrumb';



const ClearancePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray-100 min-h-screen px-4 py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          path={["Home", "Clearance"]}
        />
      </div>
      

      {/* Main Image Section 1 */}
      <div className="max-w-6xl mx-auto">
        <img
          src="https://www.densndente.ca/site/extra%20images/Short%20Expiry/2025_July_Short_Expiry_page_2.png"
          alt="Clearance Table 1"
          className="w-full object-contain rounded shadow mb-10"
        />
      </div>

      {/* Main Image Section 2 */}
      <div className="max-w-6xl mx-auto">
        <img
          src="https://www.densndente.ca/site/extra%20images/Short%20Expiry/2025_July_Short_Expiry_page_2.png"
          alt="Clearance Table 2"
          className="w-full object-contain rounded shadow mb-10"
        />
      </div>
    </div>
  );
};

export default ClearancePage;
