import { useEffect, useState } from "react";

export default function useInitialAddress(userInfo) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize addresses when userInfo becomes available
  useEffect(() => {
    if (userInfo && !isInitialized) {
      let initialAddresses = [];

      // Check for shipping address
      if (userInfo.shipping_address_name) {
        initialAddresses.push({
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
        });
      }

      // Check for default address if shipping address is not available
      if (initialAddresses.length === 0 && userInfo.defaultaddress) {
        const defaultAddr = userInfo.defaultaddress;
        initialAddresses.push({
          id: Date.now() + 1,
          fullName: `${userInfo.firstname} ${userInfo.lastname}`,
          address: defaultAddr.addr1 || "Unknown Address",
          city: defaultAddr.city,
          state: defaultAddr.state,
          zip: defaultAddr.zip,
          country:
            defaultAddr.country === "CA" ? "Canada" : defaultAddr.country,
          phone: userInfo.phone || "Phone not available",
          isDefaultShipping: true,
        });
      }

      // Check for addressbook entries if no addresses found yet
      if (
        initialAddresses.length === 0 &&
        userInfo.addressbook &&
        userInfo.addressbook.length > 0
      ) {
        initialAddresses = userInfo.addressbook.map((addr, index) => ({
          id: Date.now() + index,
          fullName: `${userInfo.firstname} ${userInfo.lastname}`,
          address: addr.addr1 || "Unknown Address",
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country === "CA" ? "Canada" : addr.country,
          phone: addr.phone || userInfo.phone || "Phone not available",
          isDefaultShipping: index === 0, // First address is default
        }));
      }

      if (initialAddresses.length > 0) {
        setAddresses(initialAddresses);
        setSelectedId(initialAddresses[0].id);
      }

      setIsInitialized(true);
    }
  }, [userInfo, isInitialized]);

  return {
    addresses,
    setAddresses,
    selectedId,
    setSelectedId,
  };
}
