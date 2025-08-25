export const URLS = {
  LOGO: "https://sandbox.densndente.ca/SSP%20Applications/NetSuite%20Inc.%20-%20SCS/SuiteCommerce%20Standard/home-page/Denslogo-sm-f1.png",
  BRANDS: {
    "3m": "https://sandbox.densndente.ca/site/extra images/brands/3M-logo.png",
    dmg: "https://sandbox.densndente.ca/site/extra%20images/brands/dmg.png",
    kerr: "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/kerr-logo.png",
    microcopy:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/microcopy.png",
    keystone:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/keystone.png",
    "johnson-and-johnson":
      "https://sandbox.densndente.ca/site/extra%20images/brands/johnson-and-johnson.png",
    aurelia:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/aurelia.png",
    "d2-healthcare":
      "https://sandbox.densndente.ca/site/extra%20images/brands/D2-logo.png",
    dentsply:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/dentsply.png",
    diadent:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/diadent.png",
    medicom:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/medicom.png",
    premier:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/premier.png",
    "surgical-specialties":
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/surgical.png",
    flight:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/flight.png",
    mark3:
      "https://sandbox.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/mark3-logo.png",
    zirc: "https://www.densndente.ca/site/extra%20images/brands/zirc-dental-logo.png",
    defend:
      "https://www.densndente.ca/site/extra%20images/brands/defend-logo.png",
    young:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/young-logo.png",
    waterpik:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/waterpik-logo.png",
    univet:
      "https://www.densndente.ca/site/extra%20images/brands/univet-logo.png",
    tidi: "https://www.densndente.ca/site/extra%20images/brands/tidi-logo.png",
    sable:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/sable-logo.png",
    shofu:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/shofu-logo.png",
    primed:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/primed-logo.png",
    pulpdent:
      "https://www.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/logo/pulpdent.png",
    pdi: "https://www.densndente.ca/site/extra%20images/brands/pdi-logo.png",
    kuraray:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/kuraray-logo.png",
    halyard:
      "https://www.densndente.ca/site/extra%20images/brands/halyard-logo.png",
    dentamerica:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/dentamerica-logo.png",
    pierrel:
      "https://www.densndente.ca/site/extra images/brands/Pierrel-logo.png",
    pacdent:
      "https://www.densndente.ca/site/extra%20images/brands/pac-dent-logo.png",
    morita:
      "https://www.densndente.ca/site/extra%20images/brands/J-Morita-logo.png",
    palmero:
      "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/palmero-logo.png",
    parkell:
      "https://www.densndente.ca/site/extra%20images/brands/parkell-logo.png",
    flow: "https://www.densndente.ca/site/extra images/Dens website change May 2023/logo/flow-logo.png",
    hager:
      "	https://www.densndente.ca/site/extra%20images/brands/hager-worldwide-logo.png",
  },
  SOCIAL: {
    FACEBOOK: "https://facebook.com",
    INSTAGRAM: "https://instagram.com",
    YOUTUBE: "https://youtube.com",
    LINKEDIN: "https://linkedin.com",
    GOOGLE_PLUS: "https://plus.google.com",
  },
};

export const SHIPPING_METHOD = "20412";

export const ORDER_STATUS = {
  "Pending Fulfillment": {
    label: "Pending Fulfillment",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏳", // Clock icon
    description: "Order is being processed",
  },
  "Partially Fulfilled": {
    label: "Partially Fulfilled",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📦", // Package icon
    description: "Some items have been shipped",
  },
  Fulfilled: {
    label: "Fulfilled",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅", // Check mark
    description: "Order has been completed",
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "❌", // X mark
    description: "Order has been cancelled",
  },
  Shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚", // Truck icon
    description: "Order is on its way",
  },
  Delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅", // Check mark
    description: "Order has been delivered",
  },
  Processing: {
    label: "Processing",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "⚙️", // Gear icon
    description: "Order is being prepared",
  },
  "On Hold": {
    label: "On Hold",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "⏸️", // Pause icon
    description: "Order is temporarily on hold",
  },
  Refunded: {
    label: "Refunded",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "💰", // Money icon
    description: "Order has been refunded",
  },
  Returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "↩️", // Return arrow
    description: "Order has been returned",
  },
};

// Helper function to get status configuration
export const getOrderStatusConfig = (status) => {
  return (
    ORDER_STATUS[status] || {
      label: status || "Unknown",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: "❓",
      description: "Status unknown",
    }
  );
};

// Helper function to create status options from actual order data
export const createStatusOptions = (orders = []) => {
  // Get all unique statuses from actual orders
  const actualStatuses = Array.from(
    new Set(orders.map((o) => o.status || "Pending Fulfillment"))
  );

  // Create options array starting with "All"
  const options = [{ value: "All", label: "All" }];

  // Add options for actual statuses, using ORDER_STATUS config if available
  actualStatuses.forEach((status) => {
    const config = ORDER_STATUS[status];
    options.push({
      value: status,
      label: config ? config.label : status, // Use predefined label or actual status
    });
  });

  return options;
};
