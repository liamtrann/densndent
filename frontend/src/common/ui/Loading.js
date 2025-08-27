export default function Loading({
  text = "Loading...",
  className = "",
  size = "md",
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 w-full ${className}`}
    >
      {/* Main spinner with gradient */}
      <div className="relative mb-4">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Outer ring with gradient */}
          <div
            className={`${sizeClasses[size]} rounded-full border-2 border-transparent bg-gradient-to-r from-smiles-orange to-smiles-blue animate-spin`}
            style={{
              background:
                "conic-gradient(from 0deg, #FF6B35, #4A90E2, #FF6B35)",
              borderRadius: "50%",
            }}
          />
          {/* Inner white circle to create ring effect */}
          <div
            className={`absolute top-0.5 left-0.5 bg-white rounded-full`}
            style={{
              width: "calc(100% - 4px)",
              height: "calc(100% - 4px)",
            }}
          />
        </div>
      </div>

      {/* Loading text with fade animation */}
      <div className="text-center">
        <span className="text-gray-700 font-medium animate-pulse">{text}</span>

        {/* Animated dots */}
        <div className="flex justify-center mt-2 space-x-1">
          <div
            className="w-2 h-2 bg-smiles-orange rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-smiles-orange rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-smiles-orange rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
