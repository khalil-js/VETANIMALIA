// src/pages/Checkout.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GEL = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "GEL" }).format(n || 0);

const LS_KEYS = {
  CART: "cart",
  CONTACT: "checkout:contact",
};

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.CART) || "[]");
  } catch {
    return [];
  }
};
const saveCart = (items) => localStorage.setItem(LS_KEYS.CART, JSON.stringify(items));

const loadContact = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.CONTACT) || "null") || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    };
  } catch {
    return { firstName: "", lastName: "", email: "", phone: "" };
  }
};
const saveContact = (contact) => localStorage.setItem(LS_KEYS.CONTACT, JSON.stringify(contact));

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [contact, setContact] = useState(loadContact());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef(null);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    saveContact(contact);
  }, [contact]);

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0),
    [cart]
  );
  const total = subtotal;

  const validate = () => {
    const e = {};
    if (!contact.firstName?.trim()) e.firstName = "First name is required";
    if (!contact.lastName?.trim()) e.lastName = "Last name is required";
    if (!contact.phone?.trim()) e.phone = "Phone is required";
    else if (!/^\+?[0-9\s()-]{6,}$/.test(contact.phone.trim())) e.phone = "Enter a valid phone";
    if (contact.email?.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim())) e.email = "Invalid email";
    if (!cart.length) e.cart = "Your cart is empty";

    setErrors(e);
    return e;
  };

  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length && firstErrorRef.current) firstErrorRef.current.focus();
  }, [errors]);

  const onOrder = async (e) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) return;

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      alert(`Order ${orderId} placed! Total: ${GEL(total)}`);
      setCart([]);
      saveCart([]);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-semibold">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        {/* LEFT: contact form only */}
        <form onSubmit={onOrder} className="space-y-10">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Contact information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <input
                  ref={errors.firstName ? firstErrorRef : undefined}
                  type="text"
                  placeholder="First name *"
                  className={`w-full border-b p-2 outline-none ${errors.firstName ? "border-red-400" : ""}`}
                  value={contact.firstName}
                  onChange={(e) => setContact((s) => ({ ...s, firstName: e.target.value }))}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name *"
                  className={`w-full border-b p-2 outline-none ${errors.lastName ? "border-red-400" : ""}`}
                  value={contact.lastName}
                  onChange={(e) => setContact((s) => ({ ...s, lastName: e.target.value }))}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full border-b p-2 outline-none ${errors.email ? "border-red-400" : ""}`}
                  value={contact.email}
                  onChange={(e) => setContact((s) => ({ ...s, email: e.target.value }))}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone *"
                  className={`w-full border-b p-2 outline-none ${errors.phone ? "border-red-400" : ""}`}
                  value={contact.phone}
                  onChange={(e) => setContact((s) => ({ ...s, phone: e.target.value }))}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-md bg-orange-400 px-6 py-3 font-semibold text-black hover:opacity-90 ${submitting ? "opacity-70" : ""}`}
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
        </form>

        {/* RIGHT: items + totals */}
        <aside className="rounded-3xl border-2 border-orange-300 p-6 lg:sticky lg:top-24">
          <h3 className="mb-6 text-3xl font-semibold text-center drop-shadow-sm">Item</h3>

          {cart.length ? (
            <ul className="mb-4 space-y-4">
              {cart.map((it) => (
                <li key={it.id} className="flex items-center gap-3 border-b pb-4 last:border-none">
                  <div className="grid h-16 w-16 place-items-center rounded bg-zinc-100">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="h-14 w-auto object-contain" />
                    ) : (
                      <div className="h-14 w-14 rounded bg-zinc-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-zinc-500">Qty: {it.qty || 1}</p>
                  </div>
                  <div className="text-right font-semibold">{GEL((it.price || 0) * (it.qty || 1))}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-4 rounded-md bg-zinc-50 p-4 text-sm">
              No items to show. <Link className="underline" to="/cart">Go to cart</Link>.
            </div>
          )}

          <hr className="my-4 border-zinc-300" />

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

          {errors.cart && <p className="mt-3 text-center text-sm text-red-600">{errors.cart}</p>}
        </aside>
      </div>
    </main>
  );
}
