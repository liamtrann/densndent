import { useNavigate } from "react-router-dom";

import { Paragraph, StatusBadge } from "common";
import { formatCurrency } from "config/config";

export default function ListOrdersHistory({ orders = [] }) {
  const navigate = useNavigate();

  const groupedOrders = orders.reduce((groups, order) => {
    const date = order.trandate || "Unknown";
    if (!groups[date]) groups[date] = [];
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
          <div className="bg-gradient-to-r from-smiles-orange to-smiles-orange px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1.5">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <Paragraph className="font-medium text-white text-sm leading-tight">
                  Placed on {date}
                </Paragraph>
                <Paragraph className="text-white/70 text-xs">
                  {dateOrders.length} order{dateOrders.length !== 1 ? "s" : ""}
                </Paragraph>
              </div>
            </div>
          </div>

          {/* Orders for this date */}
          {dateOrders
            .sort((a, b) => (b.id || 0) - (a.id || 0))
            .map((order) => (
              <div
                key={order.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate(`/profile/history/order/${order.id}`, {
                    state: { orderSummary: order },
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/profile/history/order/${order.id}`, {
                      state: { orderSummary: order },
                    });
                  }
                }}
                className="p-4 border-b last:border-b-0 flex justify-between items-center cursor-pointer
                           hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                aria-label={`Open ${order.trandisplayname}`}
                title="View order details"
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

                <div className="text-right flex flex-col items-end gap-1">
                  <StatusBadge status={order.status || "Pending Fulfillment"} />
                  {order.foreigntotal && (
                    <Paragraph className="text-base font-semibold text-gray-800">
                      {formatCurrency(order.foreigntotal)}
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
