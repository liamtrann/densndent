import React from "react";

/**
 * AnimatedCard: Wraps children with a scale-up animation on hover.
 * Usage: <AnimatedCard><YourContent /></AnimatedCard>
 */
export default function AnimatedCard({ children, className = "", ...props }) {
  return (
    <div
      className={`transition-transform duration-200 ease-in-out hover:scale-125 active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
