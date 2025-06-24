import React from "react";

export default function FAQs() {
  return (
    <section className="bg-orange-50 px-6 py-10 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-orange-900 mb-3">FAQs</h2>
        <p className="text-gray-700 mb-4">
          Get quick answers about ordering, shipping, returns, and how to shop for dental supplies and products on our website.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">
          Learn More
        </button>
      </div>
      <img src="/faq-banner.png" alt="FAQs" className="w-full md:w-1/2 mt-6 md:mt-0 rounded-lg" />
    </section>
  );
}
