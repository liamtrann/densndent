import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Loading,
} from "common";
import CheckoutSummary from "components/checkout/CheckoutSummary";


// Import the new modular sections
import CheckoutShipping from "../components/checkout/CheckoutShipping";
import CheckoutPayment from "../components/checkout/CheckoutPayment";
import CheckoutReview from "../components/checkout/CheckoutReview";

export default function CheckoutPage() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isResidential, setIsResidential] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    } else if (isAuthenticated) {
      (async () => {
        try {
          await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });
        } catch (err) {
          console.error("Error getting access token:", err);
        }
      })();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently]);

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }

  const renderStep = () => {
    const step = location.pathname.split("/")[2] || "shipping";

    switch (step) {
      case "shipping":
        return (
          <CheckoutShipping
            isResidential={isResidential}
            setIsResidential={setIsResidential}
          />
        );
      case "payment":
        return (
          <CheckoutPayment
            isAddModalOpen={isAddModalOpen}
            setAddModalOpen={setAddModalOpen}
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
        <Link to="/checkout/shipping" className="text-blue-600 hover:underline">
          1. Shipping Address
        </Link>
        <span> / </span>
        <Link to="/checkout/payment" className="text-blue-600 hover:underline">
          2. Payment
        </Link>
        <span> / </span>
        <Link to="/checkout/review" className="text-blue-600 hover:underline">
          3. Review
        </Link>
      </div>

      {/* Page layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderStep()}</div>
        <CheckoutSummary promoCode={promoCode} setPromoCode={setPromoCode} />
      </div>
    </div>
  );
}
