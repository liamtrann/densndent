// /src/pages/FAQPage.jsx
import React from "react";
import FAQSection from "../components/FAQSection";

const faqData = [
  {
    category: "Items and Availability",
    items: [
      {
        question: "How do I know if a product is in stock?",
        answer: `The availability for each item is shown on the item detail page. For all items on our website, we display their availability using the terms mentioned below:

In Stock – The item is in stock at our warehouse and is available for immediate delivery.

Out of Stock – The item is sold out and is not in stock currently. If an out-of-stock item is purchased, we will ship the order when the item is back in stock.`,
      },
      {
        question: "Where do I find product specifications?",
        answer: "You can find product specifications on the product detail pages, usually under the description or technical specs tab.",
      },
      {
        question: "When will I receive my order?",
        answer: "Most in-stock orders are shipped within 1–2 business days. Delivery time depends on the selected shipping method.",
      },
      {
        question: "How much does shipping cost?",
        answer: "Shipping cost is calculated at checkout based on your location and chosen shipping method.",
      },
    ],
  },
  {
    category: "Order and Payment",
    items: [
      {
        question: "Can I order an item that is on backorder?",
        answer: "Yes, you can order backordered items. They will be shipped as soon as they are restocked.",
      },
      {
        question: "If I order in-stock and backorder items together, when will the items ship?",
        answer: "Your order will be shipped once all items are in stock unless you request separate shipments.",
      },
      {
        question: "How do I pay online?",
        answer: "You can pay online via Visa, MasterCard, or other accepted payment methods during checkout.",
      },
      {
        question: "Is this website secure for credit card transactions?",
        answer: "Yes. We use secure encryption technology to protect your transactions.",
      },
      {
        question: "I don't want to order online, can I order a different way?",
        answer: "Yes, you can place an order via phone or email by contacting our customer support.",
      },
      {
        question: "Can I cancel my order?",
        answer: "Please contact us as soon as possible. Orders that haven’t been shipped yet can typically be canceled.",
      },
      {
        question: "Can I return my order?",
        answer: "Yes. Returns are accepted within 30 days of delivery if products are unused and in original packaging.",
      },
      {
        question: "How do I know if my order was placed, and check the status of my order?",
        answer: "You’ll receive a confirmation email with tracking info. You can also log into your account to track the order.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {faqData.map((section) => (
        <FAQSection
          key={section.category}
          category={section.category}
          items={section.items}
        />
      ))}
    </div>
  );
}
