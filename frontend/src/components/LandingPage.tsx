import React from "react";

export default function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen text-sm">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Henry Schein Logo"
            className="h-6"
          />
          <span className="text-red-600 font-bold text-lg">Canada</span>
        </div>
        <div className="flex-1 mx-4">
          <input
            type="text"
            placeholder="What can we help you find?"
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-blue-600">Login</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Create Account</button>
        </div>
      </header>

      {/* Alert Banner */}
      <div className="bg-blue-100 text-blue-800 px-4 py-2 text-center text-xs">
        IMPORTANT: POTENTIAL CANADA POST STRIKE – PAYMENT OPTIONS
        <br />
        Please make timely payments through online banking or EFT. For help, call
        1-800-668-5558.
      </div>

      {/* Main Section */}
      <main className="p-4 grid grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <aside className="col-span-3 bg-white rounded shadow-sm p-4 space-y-2">
          <h2 className="font-bold text-gray-700">Supplies & Small Equipment</h2>
          <div className="flex gap-2">
            <input
              placeholder="Item Code"
              className="border px-2 py-1 w-full"
            />
            <input
              placeholder="Qty"
              className="border px-2 py-1 w-1/3"
            />
            <button className="bg-red-600 text-white px-2 py-1 rounded">Add</button>
          </div>
          <ul className="text-sm text-blue-700 space-y-1 mt-2">
            <li>Order from History</li>
            <li>Browse Supplies</li>
            <li>Speed Entry</li>
            <li>Sales & Promotions</li>
            <li>Shopping Lists</li>
            <li>My Order</li>
            <li>Unplaced Orders</li>
            <li>Catalogues & Flyers</li>
            <li>Henry Schein Brands</li>
            <li>Featured Brands</li>
            <li>SDS Look-up</li>
          </ul>
        </aside>

        {/* Hero Section */}
        <section className="col-span-9">
          <div className="bg-white rounded shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-blue-800">
                  FLUORIDES, TOOTHBRUSHES & FLOSS
                </h1>
                <p className="text-xl text-blue-600">UP TO 35% OFF</p>
                <p className="text-gray-500">+ Special Offers</p>
                <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded">
                  SHOP NOW
                </button>
                <p className="text-xs mt-1">Use promo code WA | Expires June 30</p>
              </div>
              <img
                src="/products-banner.png"
                alt="Products"
                className="h-40 object-contain"
              />
            </div>
          </div>

          {/* Promotions / Flyers */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded shadow-sm p-2">
              <img src="/june-flyer.png" alt="June Flyer" className="w-full" />
              <p className="text-center font-medium mt-1">June Dental Flyer</p>
            </div>
            <div className="bg-white rounded shadow-sm p-2">
              <img src="/10year-warranty.png" alt="Warranty" className="w-full" />
              <p className="text-center font-medium mt-1">10 Year Warranty</p>
            </div>
            <div className="bg-white rounded shadow-sm p-2">
              <img src="/garrison.png" alt="Garrison" className="w-full" />
              <p className="text-center font-medium mt-1">Garrison Dental Solutions</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
