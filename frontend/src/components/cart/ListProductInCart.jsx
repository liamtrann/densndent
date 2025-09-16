import { PreviewCartItem, PurchaseOption } from "../../common";

import { OUT_OF_STOCK } from "@/constants/constant";

const ListProductInCart = ({
  item,
  inventoryStatus,
  onQuantityChange,
  onItemClick,
  onOneTime,
  onSubscribe,
  onIntervalChange,
  onRemoveClick,
  formatLocalDateToronto,
  listType = "cart",
}) => {
  const inv = inventoryStatus.find((i) => i.item === item.id);
  const key = item.id + (item.flavor ? `-${item.flavor}` : "");
  const isSubbed = !!item.subscriptionEnabled;
  const interval = item.subscriptionInterval || "1";

  // Calculate first delivery date if subscribed
  const addMonthsSafe = (date, months) => {
    const d = new Date(date.getTime());
    const day = d.getDate();
    const targetMonth = d.getMonth() + months;
    const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const endDay = new Date(targetYear, normalizedMonth + 1, 0).getDate();
    const clampedDay = Math.min(day, endDay);
    const res = new Date(d);
    res.setFullYear(targetYear, normalizedMonth, clampedDay);
    return res;
  };

  const nextSubscriptionDateFromToday = (intervalStr) => {
    const interval = parseInt(intervalStr || "1", 10);
    const todayToronto = new Date();
    return addMonthsSafe(todayToronto, isNaN(interval) ? 1 : interval);
  };

  const firstDeliveryDate = isSubbed
    ? nextSubscriptionDateFromToday(interval)
    : null;

  return (
    <div
      key={`${key}-card`}
      className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {listType === "card" ? (
        // Card layout - flex left-right
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* LEFT: Product block */}
          <div className="flex-1 min-w-0 lg:flex-[2] lg:min-w-[400px]">
            <PreviewCartItem
              key={key}
              item={item}
              onQuantityChange={onQuantityChange}
              onItemClick={onItemClick}
              showQuantityControls={true}
              showTotal={true}
              compact={false}
              imageSize="w-28 h-28"
              textSize="text-base"
              showBottomBorder={false}
              listType="card"
            />
            {inv && inv.quantityavailable <= 0 && (
              <div className="text-red-600 text-sm mt-2">{OUT_OF_STOCK}</div>
            )}
          </div>

          {/* RIGHT: Purchase controls */}
          <PurchaseOption
            name={key}
            isSubscribed={isSubbed}
            interval={interval}
            onOneTime={() => onOneTime(item)}
            onSubscribe={() => onSubscribe(item)}
            onIntervalChange={(val) => onIntervalChange(item, val)}
            onRemoveClick={() => onRemoveClick(item)}
            formatLocalDateToronto={formatLocalDateToronto}
            firstDeliveryDate={firstDeliveryDate}
            listType="column"
          />
        </div>
      ) : (
        // Table layout - stacked (product on top, purchase controls below)
        <>
          {/* Product block - Full width */}
          <div className="w-full">
            <PreviewCartItem
              key={key}
              item={item}
              onQuantityChange={onQuantityChange}
              onItemClick={onItemClick}
              showQuantityControls={true}
              showTotal={true}
              compact={false}
              imageSize="w-28 h-28"
              textSize="text-base"
              showBottomBorder={false}
              listType="table"
            />
            {inv && inv.quantityavailable <= 0 && (
              <div className="text-red-600 text-sm mt-2">{OUT_OF_STOCK}</div>
            )}
          </div>

          {/* Purchase controls - Next line */}
          <div className="w-full mt-4">
            <PurchaseOption
              name={key}
              isSubscribed={isSubbed}
              interval={interval}
              onOneTime={() => onOneTime(item)}
              onSubscribe={() => onSubscribe(item)}
              onIntervalChange={(val) => onIntervalChange(item, val)}
              onRemoveClick={() => onRemoveClick(item)}
              formatLocalDateToronto={formatLocalDateToronto}
              firstDeliveryDate={firstDeliveryDate}
              listType="row"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ListProductInCart;
