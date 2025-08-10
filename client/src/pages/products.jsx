// src/pages/Products.jsx
import React, { useMemo, useState } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";
import { Link } from "react-router-dom";
import searchImage from "../photo/products/searchImage.png";
import { products, categories } from "../data/products"; // <-- use shared data

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("Doogs");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(term);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="max-w-full mx-auto px-6 py-10 flex justify-center flex-col items-center">
      {/* Title & Image */}
      <div className="text-center mb-4 flex flex-row items-center justify-center w-[60%] gap-10">
        <h2 className="text-5xl font-bold max-sm:hidden">Our Products</h2>
        <img src={searchImage} alt="Pets" className="h-40 object-contain" />
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-center w-full mb-8">
        <label className="flex items-center bg-orange-400 rounded-full px-5 py-3 w-full max-w-2xl shadow-md">
          <FaSearch className="text-black text-lg mr-3" />
          <input
            type="text"
            aria-label="Search products"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder-white text-white text-sm"
          />
          <div className="border-l border-white pl-3">
            <FaSlidersH className="text-white text-lg cursor-pointer" />
          </div>
        </label>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${
              activeCategory === cat
                ? "bg-orange-400 text-white"
                : "text-black hover:bg-orange-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 w-full">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              state={{ product }} // passes brand/size/description/features too
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow cursor-pointer block"
            >
              <div className="bg-white flex items-center justify-center p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="bg-orange-400 text-black p-4">
                <p className="font-bold text-lg">{product.price}</p>
                <p className="text-sm leading-snug">{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 p-10">No products found</p>
      )}
    </div>
  );
}
