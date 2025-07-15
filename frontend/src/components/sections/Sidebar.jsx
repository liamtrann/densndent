import React from "react";
import { QuickOrderForm } from "../../common";

export default function Sidebar({ title, navItems }) {
  return (
    <aside className="col-span-3 bg-white rounded-xl shadow-md p-5 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <QuickOrderForm />
      <nav className="space-y-2 text-smiles-blue text-sm">
        {navItems.map((item) => (
          <li key={item} className="hover:underline cursor-pointer">
            {item}
          </li>
        ))}
      </nav>
    </aside>
  );
}
