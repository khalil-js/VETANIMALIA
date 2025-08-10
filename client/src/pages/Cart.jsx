// src/pages/Cart.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GEL = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "GEL" }).format(n || 0);

const LS_KEY = "cart";

const loadCart = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.items)) return raw.items; // tolerant
    return [];
  } catch {
    return [];
  }
};
const saveCart = (items) => localStorage.setItem(LS_KEY, JSON.stringify(items));

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0),
    [items]
  );
  const total = subtotal; // keep it simple — no discounts here

  const updateQty = (id, delta) => {
    setItems((prev) => {
      const next = prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it))
        .filter(Boolean);
      saveCart(next);
      return next;
    });
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      saveCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  const goCheckout = () => navigate("/checkout");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-semibold">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        {/* LEFT: list of items */}
        <section className="space-y-4">
          {items.length ? (
            items.map((it) => (
              <article key={it.id} className="flex items-center gap-4 rounded-3xl border-2 border-orange-300 p-4">
                <div className="grid h-20 w-20 place-items-center rounded bg-zinc-100">
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="h-16 w-auto object-contain" />
                  ) : (
                    <div className="h-16 w-16 rounded bg-zinc-200" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-lg font-semibold">{it.name}</h3>
                  <p className="text-sm text-zinc-500">{GEL(it.price)} each</p>
                  <div className="mt-3 inline-flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Decrease ${it.name}`}
                      className="rounded border px-3 py-1"
                      onClick={() => updateQty(it.id, -1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{it.qty || 1}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${it.name}`}
                      className="rounded border px-3 py-1"
                      onClick={() => updateQty(it.id, +1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-4 text-sm underline opacity-80 hover:opacity-100"
                      onClick={() => removeItem(it.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-zinc-500">Line total</div>
                  <div className="text-lg font-semibold">{GEL((it.price || 0) * (it.qty || 1))}</div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-orange-300 p-8 text-center">
              <p className="mb-2">Your cart is empty.</p>
              <Link to="/" className="underline">Continue shopping</Link>
            </div>
          )}

          {items.length > 0 && (
            <div className="pt-2">
              <button type="button" onClick={clearCart} className="text-sm underline opacity-80 hover:opacity-100">
                Clear cart
              </button>
            </div>
          )}
        </section>

        {/* RIGHT: summary */}
        <aside className="rounded-3xl border-2 border-orange-300 p-6 lg:sticky lg:top-24">
          <h3 className="mb-6 text-3xl font-semibold text-center drop-shadow-sm">Summary</h3>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{GEL(subtotal)}</span>
            </li>
          </ul>

          <hr className="my-4 border-zinc-300" />

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-3xl font-semibold">{GEL(total)}</span>
          </div>

          <button
            onClick={goCheckout}
            disabled={!items.length}
            className={`mt-4 w-full rounded-md bg-orange-400 px-4 py-3 text-lg font-semibold text-black hover:opacity-90 ${
              !items.length ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Proceed to checkout
          </button>

          <div className="mt-4 text-center text-sm">
            <Link to="/" className="underline">Continue shopping</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
