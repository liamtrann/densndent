import React from 'react'
import { useParams } from 'react-router-dom';
import { ListProductComponent } from "../components";

const ListProductsByName = () => {
  const { name } = useParams();
  // Convert # back to space
  const textName = name.replaceAll("-", " ");
  return (
    <ListProductComponent
      type="name"
      id={textName}
      breadcrumbPath={["Home", "Products", textName]}
      headerTitle={name.toUpperCase()}
    />
  );
}

export default ListProductsByName
