// /src/components/FAQSection.jsx
import React from "react";
import FAQItem from "./FAQItem";

export default function FAQSection({ category, items }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold bg-blue-800 text-white px-4 py-2 uppercase">
        {category}
      </h2>
      <div className="divide-y border border-blue-800">
        {items.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
