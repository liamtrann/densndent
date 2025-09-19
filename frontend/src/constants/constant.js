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
    FACEBOOK: "https://www.facebook.com/densndentehealthcare/",
    INSTAGRAM: "https://www.instagram.com/densndentehealthcare/",
    YOUTUBE: "https://www.youtube.com/channel/UC9nhC6KqjCglQ_8yQD6Nf_Q",
    LINKEDIN: "https://www.linkedin.com/company/densndentehealthcare/?originalSubdomain=ca",
    GOOGLE_PLUS: "https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html",
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
  "Pending Approval": {
    label: "Pending Approval",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳", // Clock icon
    description: "Order is awaiting approval",
  },
  Approved: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "✅", // Check mark
    description: "Order has been approved",
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
  Packed: {
    label: "Packed",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "📦", // Package icon
    description: "Order has been packed and ready for shipment",
  },
  Picked: {
    label: "Picked",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: "📋", // Clipboard icon
    description: "Items have been picked from inventory",
  },
  Open: {
    label: "Open",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "�", // Open folder
    description: "Order is open and active",
  },
  Closed: {
    label: "Closed",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "📁", // Closed folder
    description: "Order has been closed",
  },
  "In Progress": {
    label: "In Progress",
    color: "bg-sky-100 text-sky-800 border-sky-200",
    icon: "�", // Refresh icon
    description: "Order is currently being worked on",
  },
  Paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "💳", // Credit card icon
    description: "Payment has been received",
  },
  Billed: {
    label: "Billed",
    color: "bg-teal-100 text-teal-800 border-teal-200",
    icon: "📄", // Document icon
    description: "Invoice has been generated",
  },
  "Paid In Full": {
    label: "Paid In Full",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "💰", // Money bag icon
    description: "Full payment has been received",
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

export const OUT_OF_STOCK = "";
export const CURRENT_IN_STOCK = "In Stock";
