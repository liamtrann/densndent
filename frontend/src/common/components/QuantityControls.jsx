export default function QuantityControls({
  quantity,
  onDecrement,
  onIncrement,
  min = 1,
  max = 999,
  disabled = false,
  className = "",
}) {
  const decrement = () => {
    if (onDecrement) {
      onDecrement();
    }
  };

  const increment = () => {
    if (onIncrement) {
      onIncrement();
    }
  };

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          decrement();
        }}
        className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || Number(quantity) <= min}
      >
        -
      </button>
      <span className="w-5 text-center text-xs font-medium">{quantity}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          increment();
        }}
        className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || Number(quantity) >= max}
      >
        +
      </button>
    </div>
  );
}
