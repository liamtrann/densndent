import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import endpoint from "../api/endpoints";
import { InputField, Button, Loading } from "../common"
import api from "../api/api";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products/${query.toLowerCase()}`);
      setQuery("");
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.post(endpoint.GET_ITEMS_BY_NAME_LIKE({ name: query, limit: 5, offset: 0 }), { name: query });
        setResults(res.data.items || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  console.log(results)

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full relative">
      {/* Input + Button Group */}
      <div className="relative flex-grow">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          <FaSearch />
        </span>
        <InputField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="pl-9 pr-20 py-2 text-sm border-gray-300 w-full"
        />
        {/* Optionally show a loader */}
        {loading && (
          <Loading />
        )}
        {/* Show results dropdown */}
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded shadow z-50">
            {results.map(item => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  navigate(`/product/${item.id.toLowerCase()}`);
                  setQuery("");
                  setResults([]);
                }}
              >
                {item.itemid}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Close Button */}
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
