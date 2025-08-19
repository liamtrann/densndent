// src/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "api/api";
import endpoint from "api/endpoints";
import { Loading } from "common";
import CheckoutSummary from "components/checkout/CheckoutSummary";
import { handleTaxShippingEstimate } from "config";
import { selectCartSubtotalWithDiscounts } from "@/redux/slices";
import ToastNotification from "@/common/toast/Toast";

// Import the new modular sections
import CheckoutPayment from "../components/checkout/CheckoutPayment";
import CheckoutReview from "../components/checkout/CheckoutReview";
import useInitialAddress from "@/hooks/useInitialAddress";

export default function CheckoutPage() {
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Tax and shipping estimation state
  const [estimatedTax, setEstimatedTax] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const [taxRate, setTaxRate] = useState(null);
  const [country, setCountry] = useState("ca");
  const [postalCode, setPostalCode] = useState("");

  const userInfo = useSelector((state) => state.user.info);
  const cart = useSelector((state) => state.cart.items);

  // Calculate subtotal with discounted prices
  const subtotal = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );

  const { addresses, setAddresses, selectedId, setSelectedId } =
    useInitialAddress(userInfo);

  const fetchShippingMethods = async (itemId) => {
    try {
      setLoadingShipping(true);
      const response = await api.get(endpoint.GET_SHIPPING_METHOD(itemId));
      setShippingMethods(response.data);
      if (response.data.length > 0) {
        setSelectedShippingMethod(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error);
    } finally {
      setLoadingShipping(false);
    }
  };

  const estimateTaxAndShipping = async (userCountry, userPostalCode) => {
    if (!userCountry || !userPostalCode || !subtotal) return;

    let toastId;

    const result = await handleTaxShippingEstimate({
      country: userCountry.toLowerCase(),
      postalCode: userPostalCode,
      subtotal,
      onSuccess: (message, data) => {
        ToastNotification.success(message);
        setEstimatedTax(data.estimatedTax);
        setShippingCost(data.shippingCost);
        setTaxRate(data.taxRate);
      },
      onError: (errorMessage) => {
        console.error("Tax estimation error:", errorMessage);
        ToastNotification.error(errorMessage);
      },
      onLoading: (message) => {
        toastId = ToastNotification.loading(message);
      },
      onDismiss: () => {
        if (toastId) ToastNotification.dismiss(toastId);
      },
    });

    if (!result.success) {
      // Reset states on error
      setEstimatedTax(null);
      setShippingCost(null);
      setTaxRate(null);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });
      } catch (err) {
        console.error("Error getting access token:", err);
      }
    })();
  }, [getAccessTokenSilently]);

  // Fetch shipping methods independently (public API)
  useEffect(() => {
    // GET ICS Ground for Woo Commerce - Flat Shipping Rate
    fetchShippingMethods(20412);
  }, []);

  // Auto-estimate tax and shipping when selected address is available
  useEffect(() => {
    if (selectedId && addresses.length > 0 && subtotal > 0) {
      // Find the selected address from the addresses array
      const selectedAddress = addresses.find((addr) => addr.id === selectedId);

      if (selectedAddress) {
        // Extract country and postal code from selected address
        const userCountry = selectedAddress.country;
        const userPostalCode = selectedAddress.zip;

        if (userCountry && userPostalCode) {
          setCountry(userCountry.toLowerCase());
          setPostalCode(userPostalCode);
          estimateTaxAndShipping(userCountry, userPostalCode);
        }
      }
    }
  }, [selectedId, addresses, subtotal]);

  const renderStep = () => {
    const step = location.pathname.split("/")[2] || "payment";

    switch (step) {
      case "payment":
        return (
          <CheckoutPayment
            isAddModalOpen={isAddModalOpen}
            setAddModalOpen={setAddModalOpen}
            addresses={addresses}
            setAddresses={setAddresses}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        );
      case "review":
        return <CheckoutReview />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      {/* Step navigation */}
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/checkout/payment" className="text-blue-600 hover:underline">
          1. Payment
        </Link>
        <span> / </span>
        <Link to="/checkout/review" className="text-blue-600 hover:underline">
          2. Review
        </Link>
      </div>

      {/* Page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderStep()}</div>
        <CheckoutSummary
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          shippingCost={shippingCost}
          estimatedTax={estimatedTax}
          taxRate={taxRate}
        />
      </div>
    </div>
  );
}
