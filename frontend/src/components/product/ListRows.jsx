import ListProduct from "./ListProduct"; // Will render each product in list format

export default function ListRows({ products }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:block bg-gray-50 border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
        </div>
      </div>

      {/* Product Rows */}
      <div className="divide-y divide-gray-200 md:divide-y-0">
        {products.map((product) => (
          <ListProduct key={product.id} product={product} listType="list" />
        ))}
      </div>
    </div>
  );
}
