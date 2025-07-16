// src/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  InputField,
  Button,
  Dropdown,
  Paragraph,
  Loading,
  AddAddressModal,
} from "common";
import { CheckoutSummary } from "components/checkout";

export default function CheckoutPage() {
  const { getAccessTokenSilently } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isResidential, setIsResidential] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const userInfo = useSelector((state) => state.user.info);

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

  console.log(shippingMethods);

  const renderStep = () => {
    const step = location.pathname.split("/")[2] || "shipping";

    switch (step) {
      case "shipping":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Choose Shipping Address
            </h2>
            <div className="bg-white p-6 rounded shadow-md space-y-4">
              <InputField label="Full Name" placeholder="Huzaifa Khan" />
              <InputField label="Address" placeholder="1234 Main Street" />
              <InputField placeholder="(optional)" />
              <InputField label="City *" />
              <Dropdown
                label="State *"
                options={[
                  { key: "ny", value: "NY", label: "New York" },
                  { key: "ca", value: "CA", label: "California" },
                  { key: "tx", value: "TX", label: "Texas" },
                ]}
              />
              <InputField label="Zip Code *" placeholder="94117" />
              <InputField label="Phone Number *" placeholder="555-123-1234" />
              <InputField
                type="checkbox"
                checked={isResidential}
                onChange={(e) => setIsResidential(e.target.checked)}
                label="This is a Residential Address"
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button
                className="px-6 py-3"
                onClick={() => navigate("/checkout/payment")}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded shadow-sm p-4 bg-white">
                <div className="text-sm font-semibold text-green-700 mb-1">
                  ✓ Selected
                </div>
                <div className="space-y-1 text-sm">
                  <div className="font-semibold">
                    {userInfo?.first_name} {userInfo?.last_name}
                  </div>
                  <div>{userInfo?.address_line1 || "20 Teesdale Place"}</div>
                  <div>
                    {userInfo?.city || "Toronto"} {userInfo?.state || "Ontario"}{" "}
                    {userInfo?.zip || "M1L 1L1"}
                  </div>
                  <div>{userInfo?.country || "Canada"}</div>
                  <div className="text-blue-700">
                    {userInfo?.phone || "(647) 514-7593"}
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-blue-700 underline cursor-pointer">
                  <span>Edit</span>
                  <span>Remove</span>
                </div>
              </div>

              <div
                className="border rounded shadow-sm p-4 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setAddModalOpen(true)}
              >
                <div className="text-center text-gray-500">
                  <div className="text-3xl">＋</div>
                  <div>Add Address</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-semibold mb-2">Delivery Method</h3>
              {loadingShipping ? (
                <Loading text="Loading shipping methods..." />
              ) : (
                <div className="space-y-2">
                  {shippingMethods.length > 0 ? (
                    shippingMethods.map((method, index) => (
                      <label
                        key={method.id || index}
                        className="flex items-center border p-3 rounded cursor-pointer hover:border-orange-400 transition"
                      >
                        <InputField
                          type="radio"
                          name="delivery"
                          value={method.id}
                          checked={selectedShippingMethod === method.id}
                          onChange={(e) =>
                            setSelectedShippingMethod(e.target.value)
                          }
                          className="mr-3"
                        />
                        <div className="text-sm">
                          <div>
                            {method.name ||
                              method.method ||
                              "ICS Ground – Online"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            ${method.cost || method.price || "9.99"}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <label className="flex items-center border p-3 rounded cursor-pointer hover:border-orange-400 transition">
                      <InputField
                        type="radio"
                        name="delivery"
                        defaultChecked
                        className="mr-3"
                      />
                      <div className="text-sm">
                        <div>ICS Ground – Online</div>
                        <div className="text-gray-500 text-xs">$9.99</div>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                className="px-6 py-3"
                onClick={() => navigate("/checkout/review")}
              >
                Continue to Review
              </Button>
            </div>

            <AddAddressModal
              isOpen={isAddModalOpen}
              onClose={() => setAddModalOpen(false)}
              onSave={(data) => {
                setAddModalOpen(false);
              }}
            />
          </div>
        );

      case "review":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review</h2>
            <Paragraph>Review summary placeholder</Paragraph>
            <div className="flex justify-end mt-6">
              <Button className="px-6 py-3">Place Order</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">{renderStep()}</div>
        <CheckoutSummary promoCode={promoCode} setPromoCode={setPromoCode} />
      </div>
    </div>
  );
}
