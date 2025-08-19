import React from "react";

export default function GiftCardTable() {
  const rows = [
    { amount: "$300", egift: "$25", dnd: "$35" },
    { amount: "$500", egift: "$50", dnd: "$60" },
    { amount: "$1,000", egift: "$100", dnd: "$125" },
    { amount: "$2,000", egift: "$200", dnd: "$250" },
    { amount: "$5,000", egift: "$500", dnd: "$625" },
    { amount: "$10,000", egift: "$1,000", dnd: "$1,250" },
  ];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 text-left mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border border-gray-300 text-sm font-semibold">
                Order Amount
                <br />
                <span className="text-xs italic">*excluding taxes</span>
              </th>
              <th className="py-3 px-4 border border-gray-300">E-GIFT CARD</th>
              <th className="py-3 px-4 border border-gray-300">
                DND GIFT CARD
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {rows.map(({ amount, egift, dnd }) => (
              <tr key={amount}>
                <td className="py-3 px-4 border border-gray-300">{`Spend ${amount}`}</td>
                <td className="py-3 px-4 border border-gray-300">{egift}</td>
                <td className="py-3 px-4 border border-gray-300">{dnd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-orange-600 font-semibold">
        Choose between the E-Gift Card and the DND Gift Card when your order
        meets the threshold above.
      </p>
      <p className="text-sm text-gray-600 mb-10">
        Disclaimer: Other order amounts may also qualify. Contact our sales
        representatives for details.
      </p>
    </>
  );
}
