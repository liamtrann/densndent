// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products/${query.toLowerCase()}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full border border-gray-300 rounded overflow-hidden shadow-sm"
    >
      <span className="px-3 text-gray-500">
        <FaSearch />
      </span>
      <input
        type="text"
        placeholder="Search for products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-3 py-2 text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="bg-black text-white text-sm px-4 py-2 font-semibold hover:bg-gray-800"
      >
        Go
      </button>
    </form>
  );
}
