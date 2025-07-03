import React from "react";
import ProductImage from "./ProductImage";

export default function ProductSummary({ image, product }) {

    if (!product) return null;
    return (
        <div className="flex gap-6 items-center">
            <ProductImage src={image} alt={product.name} className="h-24" />
            <div>
                <p className="font-semibold">{product.name}{product.flavor ? ` - ${product.flavor}` : ""}</p>
                {product.price && <p>{product.price}</p>}
                {product.stockdescription && (
                    <span className="text-xs bg-primary-blue text-white rounded px-2 py-1 inline-block mt-1">{product.stockdescription}</span>
                )}
                {product.quantity !== undefined && <p>Quantity: {product.quantity}</p>}

            </div>
        </div>
    );
}
