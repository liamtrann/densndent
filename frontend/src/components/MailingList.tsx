import React from "react";

export default function MailingList() {
  return (
    <section className="bg-gray-300 text-center py-10">
      <h2 className="text-2xl font-bold text-gray-900">JOIN OUR MAILING LIST</h2>
      <p className="italic text-gray-700 text-sm mb-4">SIGN UP FOR OUR NEWSLETTER</p>
      <div className="flex justify-center">
        <input
          type="email"
          placeholder="username@domain.com"
          className="px-4 py-2 w-64 rounded-l-md border border-gray-400 focus:outline-none"
        />
        <button className="bg-orange-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-900">
          SUBSCRIBE
        </button>
      </div>
    </section>
  );
}
