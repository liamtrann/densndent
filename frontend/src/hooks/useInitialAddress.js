import { useEffect, useState } from "react";

export default function useInitialAddress(userInfo) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (userInfo?.shipping_address_name) {
      const initialAddress = {
        id: Date.now(),
        fullName: `${userInfo.firstname} ${userInfo.lastname}`,
        address:
          userInfo.shipping_address_name.split("\n")[0] || "Unknown Address",
        city: userInfo.shipping_city,
        state: userInfo.shipping_state,
        zip: userInfo.shipping_zip,
        country:
          userInfo.shipping_country === "CA"
            ? "Canada"
            : userInfo.shipping_country,
        phone: userInfo.phone || "Phone not available",
        isDefaultShipping: true,
      };
      setAddresses([initialAddress]);
      setSelectedId(initialAddress.id);
    }
  }, [userInfo]);

  return {
    addresses,
    setAddresses,
    selectedId,
    setSelectedId,
  };
}
