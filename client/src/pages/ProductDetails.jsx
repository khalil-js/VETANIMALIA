// src/pages/ProductDetails.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  products as ALL_PRODUCTS,
  categories as ALL_CATEGORIES,
} from "../data/products";
import { FiHeart, FiShoppingCart, FiArrowRight } from "react-icons/fi";

// helpers
const parsePrice = (priceStr) =>
  Number(String(priceStr).replace(/[^\d.]/g, "")) || 0;
const money = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "GEL",
  }).format(n || 0);
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};
const saveCart = (items) => localStorage.setItem("cart", JSON.stringify(items));

export default function ProductDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Prefer product from route state (instant), fallback to data by id
  const productFromData = ALL_PRODUCTS.find((p) => String(p.id) === String(id));
  const product = productFromData
    ? { ...productFromData, ...(state?.product || {}) }
    : state?.product;

  const [wish, setWish] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Guard: if not found
  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="mb-4 text-lg font-semibold">Product not found</p>
        <Link
          to="/products"
          className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-orange-50"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const unit = parsePrice(product.price);

  // Use real gallery if you add product.gallery; otherwise duplicate main image
  const gallery = useMemo(() => {
    if (product.gallery?.length) return product.gallery;
    const src = product.image;
    return [
      { id: "a", src },
      { id: "b", src },
      { id: "c", src },
    ];
  }, [product]);

  useEffect(() => setCurrentImgIdx(0), [id]);

  const addToCart = () => {
    const items = loadCart();
    const key = `${product.id}`;
    const existing = items.find((i) => i.key === key);
    if (existing) existing.qty += 1;
    else
      items.push({
        key,
        id: product.id,
        name: product.name,
        price: unit,
        currency: "GEL",
        image: product.image,
        qty: 1,
      });
    saveCart(items);
    alert("Added to cart");
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* categories row (optional) */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 border-l-4 border-zinc-300 pl-4 sm:pl-6">
        <div className="flex flex-wrap sm:flex-nowrap gap-3 overflow-x-auto scrollbar-hide">
          {ALL_CATEGORIES?.map((c) => (
            <span
              key={c}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                c === product.category ? "bg-orange-300 text-black shadow" : ""
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        
      </div>

      {/* top section: thumbs | main image | info+price */}
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[110px_minmax(0,1fr)_380px]">
        {/* thumbs */}
        <div>
          <div className="flex gap-4 md:flex-col">
            {gallery.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setCurrentImgIdx(idx)}
                className={`h-24 w-24 shrink-0 rounded-2xl border transition ${
                  currentImgIdx === idx
                    ? "border-black ring-2 ring-black"
                    : "border-zinc-300 hover:border-zinc-400"
                }`}
              >
                <img
                  src={img.src}
                  alt="thumb"
                  className="h-full w-full rounded-2xl object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* main image + title */}
        <div className="grid items-start">
          <div>
            <h1 className="mb-4 text-2xl font-extrabold tracking-tight md:text-[28px]">
              {product.name}
            </h1>
            <img
              src={gallery[currentImgIdx]?.src}
              alt={product.name}
              className="max-h-[260px] w-auto object-contain"
            />
          </div>
        </div>

        {/* right column: info + price card */}
        <div className="space-y-5">
          {/* meta block (no ID displayed) */}
          <div className="space-y-3 text-sm">
            {product.brand && (
              <p>
                <span className="font-semibold">Brand :</span> {product.brand}
              </p>
            )}
            {product.size && (
              <p>
                <span className="font-semibold">Size :</span> {product.size}
              </p>
            )}
            {product.description && (
              <p className="leading-relaxed">{product.description}</p>
            )}
            {product.features?.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {product.features.map((f, i) => (
                  <li key={i} className="max-w-sm leading-relaxed">
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border-2 border-zinc-300 p-5">
            <div className="text-3xl font-extrabold tracking-tight">
              {money(unit)}
            </div>
            <div className="mt-2 text-sm">Free Delivery</div>

            <button
              onClick={addToCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-orange-300 px-4 py-2 font-medium text-black hover:opacity-90"
            >
              <FiShoppingCart /> Add To Cart
            </button>

            <button
              onClick={buyNow}
              className="mt-3 w-full rounded-md border-2 border-orange-300 px-4 py-2 font-semibold hover:bg-orange-50"
            >
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="my-8 h-[2px] w-full bg-gradient-to-r from-orange-300 to-orange-300/30" />
      {/* More of our products (same category preferred) */}
      <section className="mt-12">
        <h3 className="mb-6 text-2xl font-bold">More of Our Products</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {ALL_PRODUCTS.filter(
            (p) => p.id !== product.id && p.category === product.category
          )
            .slice(0, 4)
            .map((p) => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                state={{ product: p }}
                className="rounded-2xl overflow-hidden border hover:shadow-lg transition"
              >
                <div className="bg-white flex items-center justify-center p-6">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 object-contain"
                  />
                </div>
                <div className="bg-orange-400 text-black p-4">
                  <p className="font-bold text-lg">{p.price}</p>
                  <p className="text-sm leading-snug">{p.name}</p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
