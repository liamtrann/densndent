// src/components/product/ListProductPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ListProductComponent from "./ListProductComponent";

export default function ListProductPage({ by }) {
  const { name, brandName, nameAndId, categoryNameAndId } = useParams();

  const parseNameAndId = () => {
    switch (by) {
      
      case "name": {
        const textName = name?.replaceAll("-", " ") || "";
        return {
          displayName: textName || "Unknown Product",
          id: textName,
          headerTitle: (name || "UNKNOWN").toUpperCase(),
        };
      }
      case "brand": {
        const brand = brandName || "";
        return {
          displayName: brand || "Unknown Brand",
          id: brand,
          headerTitle: (brand || "UNKNOWN BRAND").toUpperCase(),
        };
      }
      case "class": {
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
          displayName: parsedName || "Unknown Category",
          id: parsedClassId,
          headerTitle: (parsedName || "UNKNOWN CATEGORY").toUpperCase(),
        };
      }
      case "category": {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split("/");
        const lastSegment = pathSegments[pathSegments.length - 1] || "";

        let parsedName = "";
        let parsedCategoryId = "";

        if (lastSegment) {
          const lastDash = lastSegment.lastIndexOf("-");
          if (lastDash !== -1) {
            parsedName = lastSegment.slice(0, lastDash);
            parsedCategoryId = lastSegment.slice(lastDash + 1);
          } else {
            parsedName = lastSegment;
          }
        }

        return {
          displayName: parsedName || "Unknown Category",
          id: 273, // Default ID for "Monthly Specials"
          headerTitle: (parsedName || "UNKNOWN CATEGORY").toUpperCase(),
        };
      }

      case "promotion": {
        return {
          displayName: "Promotions",
          id: "promotion",
          headerTitle: "PROMOTIONS",
        };
      }

      case "all": {
        return {
          displayName: "All Products",
          id: null,
          headerTitle: "ALL PRODUCTS",
        };
      }
      default: {
        return {
          displayName: name || "",
          id: name || "",
          headerTitle: (name || "").toUpperCase(),
        };
      }
    }
  };

  const { displayName, id, headerTitle } = parseNameAndId();

  // Map 'by' to the slice "type"
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
      case "all":
        return "all";
      case "promotion":
        return "promotion";
      default:
        return by;
    }
  };

  // ✅ Use Promotions breadcrumbs for this page
  const breadcrumbs =
    by === "promotion"
      ? ["Home", "Promotions & Catalogues", "Promotions"]
      : ["Home", "Products", displayName || "Unknown"];

  return (
    <ListProductComponent
      type={getComponentType()}
      id={id}
      breadcrumbPath={breadcrumbs}
      headerTitle={headerTitle}
    />
  );
}
