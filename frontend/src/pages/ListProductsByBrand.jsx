import React from "react";
import { useParams } from "react-router-dom";
import { ListProductComponent } from "../components";

export default function ListProductsByBrand() {
  const { brandName: brandNameParam } = useParams();
  const brandName = brandNameParam || "";

  return (
    <ListProductComponent
      type="brand"
      id={brandName}
      breadcrumbPath={["Home", "Products", brandName]}
      headerTitle={brandName.toUpperCase()}
    />
  );
}
