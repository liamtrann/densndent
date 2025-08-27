export default function CloseButton({ onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800 transition-colors ${className}`}
    >
      &times;
    </button>
  );
}
