import React from "react";
import { useParams } from "react-router-dom";
import { ListProductComponent } from "../components";


export default function ListProductPage({ by }) {
  const { name, brandName, nameAndId, categoryNameAndId } = useParams();

  // Parse name and ID based on the 'by' prop
  const parseNameAndId = () => {
    switch (by) {
      case "name": {
        // Convert dashes back to spaces for name-based queries
        const textName = name.replaceAll("-", " ");
        return {
          displayName: textName,
          id: textName,
          headerTitle: name.toUpperCase(),
        };
      }
      case "brand": {
        // For brand, use brandName parameter
        const brand = brandName || "";
        return {
          displayName: brand,
          id: brand,
          headerTitle: brand.toUpperCase(),
        };
      }
      case "class": {
        // For class, parse nameAndId to extract name and classId
        let parsedName = "";
        let parsedClassId = "";

        if (nameAndId) {
          const lastDash = nameAndId.lastIndexOf("-");
          if (lastDash !== -1) {
            parsedName = nameAndId.slice(0, lastDash);
            parsedClassId = nameAndId.slice(lastDash + 1);
          } else {
            parsedName = nameAndId;
          }
        }

        return {
          displayName: parsedName,
          id: parsedClassId,
          headerTitle: parsedName.toUpperCase(),
        };
      }
      case "category": {
        // For category, parse categoryNameAndId to extract name and categoryId
        let parsedName = "";
        let parsedCategoryId = "";

        if (categoryNameAndId) {
          const lastDash = categoryNameAndId.lastIndexOf("-");
          if (lastDash !== -1) {
            parsedName = categoryNameAndId.slice(0, lastDash);
            parsedCategoryId = categoryNameAndId.slice(lastDash + 1);
          } else {
            parsedName = categoryNameAndId;
          }
        }

        return {
          displayName: parsedName,
          id: parsedCategoryId,
          headerTitle: parsedName.toUpperCase(),
        };
      }
      default: {
        // Fallback for any other cases
        return {
          displayName: name || "",
          id: name || "",
          headerTitle: (name || "").toUpperCase(),
        };
      }
    }
  };

  const { displayName, id, headerTitle } = parseNameAndId();

  // Map 'by' prop to the expected type for ListProductComponent
  const getComponentType = () => {
    switch (by) {
      case "class":
        return "classification";
      case "category":
        return "category";
      case "brand":
        return "brand";
      case "name":
        return "name";
      default:
        return by;
    }
  };

  console.log(id);

  return (
    <ListProductComponent
      type={getComponentType()}
      id={id}
      breadcrumbPath={["Home", "Products", displayName]}
      headerTitle={headerTitle}
    />
  );
}
