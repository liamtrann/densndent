import { useEffect, useState } from "react";

export default function useInitialAddress(userInfo) {
  const [addresses, setAddresses] = useState(() => {
    // Initialize from userInfo ONLY ONCE
    if (userInfo?.shipping_address_name) {
      return [
        {
          id: Date.now(),
          fullName: `${userInfo.firstname} ${userInfo.lastname}`,
          address: userInfo.shipping_address_name.split("\n")[0] || "Unknown Address",
          city: userInfo.shipping_city,
          state: userInfo.shipping_state,
          zip: userInfo.shipping_zip,
          country: userInfo.shipping_country === "CA" ? "Canada" : userInfo.shipping_country,
          phone: userInfo.phone || "Phone not available",
          isDefaultShipping: true,
        },
      ];
    }
    return [];
  });

  const [selectedId, setSelectedId] = useState(
    addresses.length > 0 ? addresses[0].id : null
  );

  return {
    addresses,
    setAddresses,
    selectedId,
    setSelectedId,
  };
}
