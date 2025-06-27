import React, { useEffect, useState } from "react";
import { Image } from '../common';
import BlueBanner from "./BlueBanner";
import axios from "axios";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         setLoading(true);
//         setError(null);
//         // Replace with your actual API endpoint
//         const res = await axios.get("/api/categories");
//         setCategories(res.data);
//       } catch (err) {
//         setError("Failed to load categories.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCategories();
//   }, []);

  return (
    <BlueBanner
      title="Shop By Categories"
      items={categories}
      columns={{ base: 2, md: 4, lg: 5 }}
      renderItem={({ name, img }) => (
        <>
          <Image src={img} alt={name} className="mx-auto h-20 object-contain mb-2" />
          <p className="text-sm font-medium text-gray-800">{name}</p>
        </>
      )}
      loading={loading}
      error={error}
    />
  );
}
