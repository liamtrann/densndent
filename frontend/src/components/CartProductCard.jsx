import React from "react";
import InputField from "../common/InputField";
import { ProductImage } from "../common";

export default function CartProductCard({ item, inv, onNavigate, onQuantityChange, onRemove }) {
    const outOfStock = inv && inv.quantityavailable <= 0;
    return (
        <div key={item.id + (item.flavor ? `-${item.flavor}` : "")}
            className={`flex gap-6 border p-4 rounded-md shadow-sm mb-4 ${outOfStock ? "bg-red-50" : ""}`}>
            <span
                className="cursor-pointer"
                onClick={() => onNavigate(item.id)}
            >
                <ProductImage src={item.file_url} alt={item.itemid || item.displayname || "Product"} className="h-32" />
            </span>
            <div className="flex-grow">
                <h2
                    className="font-semibold mb-1 cursor-pointer hover:underline"
                    onClick={() => onNavigate(item.id)}
                >
                    {item.itemid || item.displayname}
                </h2>
                <p className="text-gray-600">${item.unitprice || item.price}</p>
                {typeof item.totalquantityonhand !== 'undefined' && (
                    <p className={
                        item.totalquantityonhand > 0
                            ? "text-green-700 font-semibold text-sm mb-1"
                            : "text-red-600 font-semibold text-sm mb-1"
                    }>
                        {item.totalquantityonhand > 0
                            ? `Current Stock: ${item.totalquantityonhand}`
                            : "Out of stock"}
                    </p>
                )}
                {/* Inventory check warning */}
                {inv && inv.quantityavailable <= 0 && (
                    <p className="text-red-700 font-semibold text-xs">This item is out of stock.</p>
                )}
                <div className="mt-2 w-24">
                    <InputField
                        label="Quantity:"
                        type="number"
                        min={1}
                        max={item.totalquantityonhand || 9999}
                        value={item.quantity}
                        onChange={(e) => onQuantityChange(item, e.target.value)}
                    />
                </div>
                <p className="mt-2 text-sm">
                    <span className="font-medium">Amount:</span>{" "}
                    <span className="font-bold">${((item.unitprice || item.price || 0) * item.quantity).toFixed(2)}</span>
                </p>
                <button
                    className="mt-2 text-red-600 underline text-sm"
                    onClick={() => onRemove(item)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
