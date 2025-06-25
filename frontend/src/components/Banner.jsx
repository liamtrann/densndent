import React from "react";

export default function Banner({ text }) {
  return (
    <div className="bg-smiles-orange/20 text-smiles-orange px-6 py-3 text-center text-sm font-medium">
      {text}
    </div>
  );
}
