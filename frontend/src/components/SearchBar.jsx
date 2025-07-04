// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import InputField from "../common/InputField";
import Button from "../common/Button";

export default function SearchBar({ onClose }) {
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
    <form onSubmit={handleSearch} className="flex items-center w-full relative">
      {/* Input + Button Group */}
      <div className="relative flex-grow">
        {/* Search Icon inside input */}
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          <FaSearch />
        </span>

        <InputField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="pl-9 pr-20 py-2 text-sm border-gray-300"
        />

        {/* Go Button using reusable Button */}
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <Button type="submit" className="px-4 py-1 text-xs">
            Go
          </Button>
        </div>
      </div>

      {/* Close Button using reusable Button */}
      {onClose && (
        <Button
          type="button"
          variant="link"
          className="ml-2 text-gray-600 hover:text-black"
          onClick={onClose}
          aria-label="Close search"
        >
          <FaTimes className="text-sm" />
        </Button>
      )}
    </form>
  );
}
