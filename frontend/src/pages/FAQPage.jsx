import React, { useState } from "react";

const faqData = [
  {
    title: "ITEMS AND AVAILABILITY",
    items: [
      {
        question: "How do I know if a product is in stock?",
        answer: `The availability for each item is shown on the item detail page. For all items on our website, we display their availability using the terms mentioned below:

                In Stock - The item is in stock at our warehouse and is available for immediate delivery.

                Out of Stock - The item is sold out and is not in stock currently. If an out-of-stock item is purchased, we will ship the order when the item is back in stock. The status will automatically change to ‘in-stock’ when we have the item back in our warehouse.`,
      },
      {
        question: "Where do I find product specifications?",
        answer: "Select the product and scroll down to the ‘Details’ section to find additional details about that specific product.",
      },
      {
        question: "When will I receive my order?",
        answer: "Orders typically ship within 1–2 business days. Delivery times depend on your location.",
      },
      {
        question: "How much does shipping cost?",
        answer: "Shipping is free on orders over $300. Standard rates apply otherwise.",
      },
    ],
  },
  {
    title: "ORDER AND PAYMENT",
    items: [
      {
        question: "Can I order an item that is on backorder?",
        answer: "Yes, you can place orders for backordered items. They will ship once available.",
      },
      {
        question: "If I order in-stock and backorder items together, when will the items ship?",
        answer: "Your order will ship when all items are in stock, unless otherwise requested.",
      },
      {
        question: "How do I pay online?",
        answer: "We accept all major credit cards. Payment is processed securely through our checkout.",
      },
      {
        question: "Is this website secure for credit card transactions?",
        answer: "Yes, our site uses SSL encryption to protect your information.",
      },
    ],
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState({});

  const toggle = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenIndex((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      {faqData.map((section, sectionIdx) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-semibold text-white bg-blue-800 px-4 py-2 rounded-t">
            {section.title}
          </h2>
          <div className="border border-t-0 rounded-b">
            {section.items.map((item, itemIdx) => {
              const key = `${sectionIdx}-${itemIdx}`;
              const isOpen = openIndex[key];
              return (
                <div key={key} className="border-t px-4 py-3 cursor-pointer">
                  <div
                    className="font-medium text-lg flex justify-between items-center"
                    onClick={() => toggle(sectionIdx, itemIdx)}
                  >
                    {item.question}
                    <span>{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{item.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
