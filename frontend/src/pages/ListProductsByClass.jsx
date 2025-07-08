import React from "react";
import { useParams } from "react-router-dom";
import { ListProductComponent } from "../components";

export default function ListProductsByClass() {
  const { name: nameAndId } = useParams();
  let name = "";
  let classId = "";
  if (nameAndId) {
    const lastDash = nameAndId.lastIndexOf("-");
    if (lastDash !== -1) {
      name = nameAndId.slice(0, lastDash);
      classId = nameAndId.slice(lastDash + 1);
    } else {
      name = nameAndId;
    }
  }

  return (
    <ListProductComponent
      type="classification"
      id={classId}
      breadcrumbPath={["Home", "Products", name]}
      headerTitle={name.toUpperCase()}
    />
  );
}
