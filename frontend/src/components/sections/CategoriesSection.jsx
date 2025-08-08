import React, { useEffect, useState } from "react";
import { Image, TitleSection } from "common";
import BlueBanner from "./BlueBanner";

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
    <>
      <TitleSection
        title="Shop By Categories"
        subtitle="Discover products organized by type"
        itemCount={categories?.length}
        itemLabel="categories"
        colorScheme="emerald"
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        }
      />
      <BlueBanner
        items={categories}
        columns={{ base: 2, md: 4, lg: 5 }}
        renderItem={({ name, img }) => (
          <>
            <Image
              src={img}
              alt={name}
              className="mx-auto h-20 object-contain mb-2"
            />
            <p className="text-sm font-medium text-gray-800">{name}</p>
          </>
        )}
        loading={loading}
        error={error}
      />
    </>
  );
}
