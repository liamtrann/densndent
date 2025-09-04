import React from "react";
import { useParams } from "react-router-dom";
import ListProductComponent from "./ListProductComponent";

export default function ListProductPage({ by }) {
  const { name, brandName, nameAndId, categoryNameAndId } = useParams(); //useParams() Pulls named segments from ur route. u’re expecting some combination of: name, brandName, nameAndId, categoryNameAndId.

  // Parse name and ID based on the 'by' prop
  const parseNameAndId = () => {
    switch (by) {
      case "name": {
        // Convert dashes back to spaces for name-based queries
        const textName = name?.replaceAll("-", " ") || ""; //Converts dashes back to spaces for nicer display and searching
        return {
          displayName: textName || "Unknown Product",
          id: textName,
          headerTitle: (name || "UNKNOWN").toUpperCase(), //Uppercases a headerTitle for the page heading
        };
      }
      case "brand": {
        // For brand, use brandName parameter
        const brand = brandName || "";
        return {
          displayName: brand || "Unknown Brand", 
          id: brand,
          headerTitle: (brand || "UNKNOWN BRAND").toUpperCase(),
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
          displayName: parsedName || "Unknown Category",
          id: parsedClassId,
          headerTitle: (parsedName || "UNKNOWN CATEGORY").toUpperCase(),
        };
      }
      case "category": {
        // For category, get the last segment from the URL path
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split("/");
        const lastSegment = pathSegments[pathSegments.length - 1] || "";

        // Parse the last segment to extract name and categoryId
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
          id: 273, // Default ID for "Monthly Specials" //the returned id is hard-coded to 273 (comment says this equals “Monthly Specials”).
          headerTitle: (parsedName || "UNKNOWN CATEGORY").toUpperCase(),
        };
      }
      case "all": { //The “show everything” page.
        // For all products, no specific ID or name parsing needed
        return {
          displayName: "All Products",
          id: null,
          headerTitle: "ALL PRODUCTS",
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
  const getComponentType = () => { //Converts this page’s by prop to the type string the child component expects.
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
      default:
        return by;
    }
  };

  return (
    <ListProductComponent
      type={getComponentType()} // TYPE="CLASSIFICATION" or "brand"
      id={id} // id=28 or 89
      breadcrumbPath={["Home", "Products", displayName || "Unknown"]}
      headerTitle={headerTitle} // needle or AMALGAM
    />
  );
}
