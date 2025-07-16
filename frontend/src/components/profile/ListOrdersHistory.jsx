// components/ListOrdersHistory.jsx
import React from "react";
import { Paragraph } from "common";

export default function ListOrdersHistory({ orders = [] }) {
  // Group orders by transaction date
  const groupedOrders = orders.reduce((groups, order) => {
    const date = order.trandate || "Unknown";
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  if (orders.length === 0) {
    return (
      <div className="bg-white border rounded shadow-sm">
        <Paragraph className="text-center text-gray-500 py-6">
          You don't have any purchases in your account right now
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded shadow-sm max-h-[400px] overflow-y-auto">
      {Object.entries(groupedOrders).map(([date, dateOrders]) => (
        <div key={date} className="border-b last:border-b-0">
          {/* Date Header */}
          <div className="bg-smiles-brightGreen px-4 py-3 border-b">
            <Paragraph className="font-semibold text-white">
              Placed on {date}
            </Paragraph>
          </div>
          {/* Orders for this date */}
          {dateOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 border-b last:border-b-0 flex justify-between items-center"
            >
              <div>
                <Paragraph className="font-medium">
                  {order.trandisplayname}
                </Paragraph>
                {order.shipcarrier && (
                  <Paragraph className="text-sm text-gray-600">
                    Carrier:{" "}
                    <span className="font-medium">{order.shipcarrier}</span>
                  </Paragraph>
                )}
              </div>
              <div className="text-right">
                <Paragraph className="text-sm text-gray-600">
                  {order.status}
                </Paragraph>
                {order.foreigntotal && (
                  <Paragraph className="text-base font-semibold text-gray-800">
                    ${order.foreigntotal}
                  </Paragraph>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
