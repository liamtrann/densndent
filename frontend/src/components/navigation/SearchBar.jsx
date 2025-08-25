import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import endpoint from "api/endpoints";
import { InputField, Button, Loading } from "common";
import api from "api/api";
import { delayCall } from "api/util";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    if (debounceRef.current) debounceRef.current();

    debounceRef.current = delayCall(async () => {
      try {
        const res = await api.post(
          endpoint.POST_GET_ITEMS_BY_NAME({ limit: 5, offset: 0 }),
          { name: query }
        );
        setResults(res.data || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => {
      if (debounceRef.current) debounceRef.current();
    };
  }, [query]);

  const showDropdown =
    query.trim() && (results.length > 0 || (!loading && results.length === 0));

  return (
    <form className="flex items-center w-full relative" autoComplete="off">
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
        {loading && <Loading />}
        {/* Show results dropdown */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded shadow z-50">
            {results.length > 0 ? (
              <>
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      navigate(`/product/${item.id.toLowerCase()}`);
                      setQuery("");
                      setResults([]);
                      if (onClose) onClose();
                    }}
                  >
                    {item.displayname}
                  </div>
                ))}
                {/* "Search all" line */}
                <div
                  className="px-4 py-2 bg-gray-50 text-blue-600 hover:bg-blue-50 hover:underline cursor-pointer text-sm border-t"
                  onClick={() => {
                    const textname = query.trim().replace(/\s+/g, "-");
                    navigate(`/products/by-name/${textname}`);
                    setResults([]);
                    if (onClose) onClose();
                  }}
                >
                  Search all results for "
                  <span className="font-semibold">{query}</span>"
                </div>
              </>
            ) : (
              // Show "No results" if query is non-empty and not loading
              <div className="px-4 py-2 text-gray-500 text-sm">
                No results found
              </div>
            )}
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
