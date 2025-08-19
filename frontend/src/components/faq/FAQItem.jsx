// /src/components/FAQItem.jsx
import React, { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        className="w-full text-left font-semibold text-base text-black hover:text-orange-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "− " : "+ "} {question}
      </button>
      {isOpen && (
        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}
