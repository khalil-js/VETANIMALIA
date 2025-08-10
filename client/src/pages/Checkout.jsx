import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Utility functions
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

// Reusable Input Component
const InputField = ({ label, value, onChange, error, type = "text", placeholder }) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full border-b p-2 outline-none ${error ? "border-red-400" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// Reusable Bubble Button Component
const BubbleButton = ({ options, selected, onSelect, error }) => (
  <div>
    <div className="flex gap-4">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`${
            selected === option ? "bg-orange-400 text-white" : "bg-zinc-100 text-zinc-700"
          } py-2 px-4 rounded-full border-2 border-orange-300 font-semibold hover:bg-orange-500 hover:text-white transition-colors`}
        >
          {option}
        </button>
      ))}
    </div>
    {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
  </div>
);

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [contact, setContact] = useState(loadContact());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [deliveryCompany, setDeliveryCompany] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
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
    if (!deliveryCompany) e.deliveryCompany = "Please select a delivery company";
    if (!paymentMethod) e.paymentMethod = "Please select a payment method";

    setErrors(e);
    return e;
  };

  useEffect(() => {
    const keys = Object.keys(errors);
    if (keys.length && firstErrorRef.current) firstErrorRef.current.focus();
  }, [errors]);

  const onOrder = async (e) => {
    e.preventDefault();
    
    // Validate the form
    const eMap = validate();
    if (Object.keys(eMap).length) return;

    try {
      setSubmitting(true);

      // Simulate a network request to place the order (e.g., calling a backend API)
      await new Promise((resolve, reject) => setTimeout(resolve, 1500)); // Simulate delay

      // After order is placed, generate a unique order ID
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;

      // Save the order (this can be extended to save to a backend)
      console.log("Order placed with ID:", orderId);
      
      // Clear the cart
      setCart([]);
      saveCart([]);

      // Redirect to the order confirmation page or home page
      alert(`Order ${orderId} placed! Total: ${GEL(total)}`);
      navigate(`/products`); // Redirect to order confirmation page

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="pl-8 mb-8 text-4xl font-semibold">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
        {/* LEFT: contact form */}
        <form onSubmit={onOrder} className="space-y-10">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Contact information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="First name"
                value={contact.firstName}
                onChange={(value) => setContact({ ...contact, firstName: value })}
                error={errors.firstName}
                placeholder="First name *"
              />
              <InputField
                label="Last name"
                value={contact.lastName}
                onChange={(value) => setContact({ ...contact, lastName: value })}
                error={errors.lastName}
                placeholder="Last name *"
              />
              <InputField
                label="Email"
                value={contact.email}
                onChange={(value) => setContact({ ...contact, email: value })}
                error={errors.email}
                type="email"
                placeholder="Email"
              />
              <InputField
                label="Phone"
                value={contact.phone}
                onChange={(value) => setContact({ ...contact, phone: value })}
                error={errors.phone}
                type="tel"
                placeholder="Phone *"
              />
            </div>
          </section>

          {/* Delivery companies */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Delivery companies</h2>
            <BubbleButton
              options={["YALIDINE", "ZR EXPRESS"]}
              selected={deliveryCompany}
              onSelect={setDeliveryCompany}
              error={errors.deliveryCompany}
            />
          </section>

          {/* Payment method */}
          <section>
            <h2 className="mb-4 text-lg font-semibold">Payment method</h2>
            <BubbleButton
              options={["MAIN A MAIN", "EDAHABIA"]}
              selected={paymentMethod}
              onSelect={setPaymentMethod}
              error={errors.paymentMethod}
            />
          </section>
          
        </form>

        {/* RIGHT: items + totals */}
        <aside className="rounded-3xl border-2 border-orange-300 p-6 lg:sticky lg:top-24 flex flex-col justify-between">
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
                    <p className="max-sm:hidden font-medium">{it.name}</p>
                    <p className="text-xs text-zinc-500">Qty: {it.qty || 1}</p>
                  </div>
                  <div className="text-right font-semibold">{GEL((it.price || 0) * (it.qty || 1))}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mb-4 rounded-md bg-zinc-50 p-4 text-sm">
              No items to show. <Link className="underline" to="/cart">Go to cart</Link>..
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

          {/* Place order button */}
          <form onSubmit={onOrder} action="">
          <div  className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-md bg-orange-400 px-6 py-3 font-semibold text-black hover:opacity-90 ${submitting ? "opacity-70" : ""}`}
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
        </form>
        </aside>
        
        
      </div>
    </main>
  );
}
