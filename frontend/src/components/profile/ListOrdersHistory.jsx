import { useNavigate } from "react-router-dom";

import { Paragraph, StatusBadge } from "common";
import {
  formatCurrency,
  parsePaymentStatus,
  truncateText,
} from "config/config";

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
          <div className="bg-gradient-to-r from-gray-500 to-gray-500 px-4 py-3 border-b">
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
            .sort((a, b) => {
              const nameA = a.trandisplayname || "";
              const nameB = b.trandisplayname || "";
              return nameB.localeCompare(nameA);
            })
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
                className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200"
                aria-label={`Open ${order.trandisplayname}`}
                title="View order details"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div className="flex items-center gap-2 mb-1 sm:mb-0">
                    <div className="bg-blue-100 rounded p-1">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {order.trandisplayname}
                      </h3>
                      <p className="text-xs text-gray-500">Sales Order</p>
                    </div>
                  </div>

                  {/* Total Price */}
                  {order.foreigntotal && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.foreigntotal)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Details - Horizontal Layout */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {/* Payment Status */}
                  {order.memo && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span className="text-gray-600 font-medium">
                        Payment:
                      </span>
                      {(() => {
                        const paymentStatus = parsePaymentStatus(order.memo);
                        if (paymentStatus) {
                          return (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatus.color} ${paymentStatus.bgColor}`}
                            >
                              <span className="text-xs">
                                {paymentStatus.icon}
                              </span>
                              <span>{paymentStatus.displayText}</span>
                            </span>
                          );
                        }
                        return (
                          <span className="text-gray-600">
                            {truncateText(order.memo, 20)}
                          </span>
                        );
                      })()}
                    </div>
                  )}

                  {/* Separator */}
                  {order.memo && (order.shipcarrier || order.status) && (
                    <span className="text-gray-300">•</span>
                  )}

                  {/* Shipping Carrier */}
                  {order.shipcarrier && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <span className="text-gray-600 font-medium">
                        Carrier:
                      </span>
                      <span className="text-gray-700 font-medium">
                        {order.shipcarrier}
                      </span>
                    </div>
                  )}

                  {/* Separator */}
                  {order.shipcarrier && order.status && (
                    <span className="text-gray-300">•</span>
                  )}

                  {/* Order Status */}
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-600 font-medium">Status:</span>
                    <StatusBadge
                      status={order.status || "Pending Fulfillment"}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
