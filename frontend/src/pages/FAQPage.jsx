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
        answer:
          "Select the product and scroll down to the ‘Details’ section to find additional details about that specific product.",
      },
      {
        question: "When will I receive my order?",
        answer:
          "Orders typically ship within 1–2 business days. Delivery times depend on your location.",
      },
      {
        question: "How much does shipping cost?",
        answer:
          "Shipping is free on orders over $300. Standard rates apply otherwise.",
      },
    ],
  },
  {
    title: "ORDER AND PAYMENT",
    items: [
      {
        question: "Can I order an item that is on backorder?",
        answer:
          "Yes, you can place orders for backordered items. They will ship once available.",
      },
      {
        question:
          "If I order in-stock and backorder items together, when will the items ship?",
        answer:
          "Your order will ship when all items are in stock, unless otherwise requested.",
      },
      {
        question: "How do I pay online?",
        answer:
          "We accept all major credit cards. Payment is processed securely through our checkout.",
      },
      {
        question: "Is this website secure for credit card transactions?",
        answer:
          "Yes, our site uses SSL encryption to protect your information.",
      },
      {
        question: "I don't want to order online, can I order a different way?",
        answer:
          "Another method to place an order is over the phone. Call 1-866-449-9998 or 905-475-3367 during operation hours to speak with an account coordinator. We will gladly assist you!",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Special order items or options, including, but not limited to custom cabinetry, upholstery, and color changes cannot be cancelled. Certain special order items may be cancelled subject to a 20% restocking fee. Please call in to cancel the order or for more information. Or you may contact us at info@densndente.ca",
      },
      {
        question: "Can I return my order?",
        answer:
          "If you received a defective product or purchased the wrong product, it may be eligible for a credit, exchange, or refund. The product must not be used and remain sealed (if applicable) in a resalable condition. You may return it within thirty (30) days of purchase for a credit, exchange, or refund. To arrange a return, please call us at 1-866-449-9998 or email our customer service team at orders@densndente.ca.\n\nPlease Note: All the infection control supplies are final sale.",
      },
      {
        question:
          "How do I know if my order was placed, and check the status of my order?",
        answer:
          "To check the status of your order and view your order history, please log in to your account as a returning customer. Pending transactions will be in your Account’s Overview, under ‘Recent Purchases’. They can also be viewed by going to the ‘Purchases’ menu and then the ‘Purchase History’ link. The order’s status can be viewed under the “Status” column.",
      },
    ],
  },
  {
    title: "SHIPPING, DELIVERY, AND RETURNS",
    items: [
      {
        question: "Which courier company is delivering my products?",
        answer:
          "We work with trusted carriers such as Canada Post, UPS, and Purolator, depending on your location and item availability.",
      },
      {
        question: "Can I ship to a different address?",
        answer:
          "Yes, you can specify a different shipping address during checkout or in your account settings.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order ships, you'll receive an email with tracking information.",
      },
      {
        question: "What should I do if I received the wrong item?",
        answer:
          "Please contact our support team immediately at orders@densndente.ca and we’ll resolve the issue promptly.",
      },
      {
        question: "How can I process a return?",
        answer:
          "To initiate a return, contact us via phone or email within 30 days. Items must be unused and in resalable condition.",
      },
      {
        question: "Do I need to put a label for the returning items?",
        answer:
          "Yes, a return label is required. Our support team will provide instructions once your return request is approved.",
      },
      {
        question: "What if I ordered the wrong item?",
        answer:
          "Reach out to our customer service to initiate a return or exchange. A restocking fee may apply.",
      },
      {
        question:
          "What do I need to do if I am unsatisfied with the quality of the product?",
        answer:
          "Please contact us with details and we’ll guide you through the RMA process for quality-related issues.",
      },
      {
        question:
          "Will I get a refund right away after doing an RMA for the unsatisfied quality of the product?",
        answer:
          "Refunds are processed after inspection of returned items. You’ll be notified via email once it’s approved.",
      },
    ],
  },
  {
    title: "OTHER FAQS",
    items: [
      {
        question: "Where can I find the best deals and promotions?",
        answer:
          "Visit our Promotions page or sign up for our newsletter to stay updated on the latest offers.",
      },
      {
        question:
          "What are the hours of operation at Dens ‘N Dente Healthcare?",
        answer:
          "Our office hours are Monday to Friday, 9:00 AM to 5:00 PM EST.",
      },
      {
        question: "Can I get quick assistance rather than email or call?",
        answer:
          "Yes! Use our live chat feature on the website for immediate support during business hours.",
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12 text-center">
        Frequently Asked Questions
      </h1>

      {/* Instructional Videos */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-white bg-blue-800 px-4 py-2 rounded-t">
          INSTRUCTIONAL VIDEOS
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center border border-t-0 rounded-b p-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">New Features</h3>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/4r-PqDmL62c"
              title="New Features"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">How To Order</h3>
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/wYdEZa69iK8"
              title="How To Order"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
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
                <div
                  key={key}
                  className="border-t px-4 py-3 cursor-pointer"
                  onClick={() => toggle(sectionIdx, itemIdx)}
                >
                  <div className="font-medium text-lg flex justify-between items-center">
                    {item.question}
                    <span>{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                      {item.answer}
                    </p>
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
