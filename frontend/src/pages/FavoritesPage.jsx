// src/pages/FavoritesPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import ListProductNoFilter from "../components/product/ListProductNoFilter";

export default function FavoritesPage() {
  const favoriteIds = useSelector((s) => s.favorites.items);
  const userInfo = useSelector((s) => s.user.info);

  const searchIds =
    favoriteIds?.length > 0
      ? favoriteIds.join(",")
      : (userInfo?.custentity_favorite_item || "");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      {!searchIds ? (
        <p className="text-gray-600">You haven’t added any favorites yet.</p>
      ) : (
        <ListProductNoFilter searchIds={searchIds} by="favoriteItems" />
      )}
    </div>
  );
}
