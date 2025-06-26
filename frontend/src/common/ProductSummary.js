import React from "react";
import Image from "./Image";

export default function ProductSummary({ image, product }) {
    if (!product) return null;
    return (
        <div className="flex gap-6 items-center">
            {image && <Image src={image} alt={product.name} className="h-24" />}
            <div>
                <p className="font-semibold">{product.name}{product.flavor ? ` - ${product.flavor}` : ""}</p>
                {product.price && <p>{product.price}</p>}
                {product.quantity !== undefined && <p>Quantity: {product.quantity}</p>}
            </div>
        </div>
    );
}
