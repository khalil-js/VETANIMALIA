import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../photo/imgs/logo.png";

const CART_KEY = "cart";

function useCartCount() {
  const [count, setCount] = useState(0);

  const readCount = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [];
      const c = items.reduce((s, it) => s + (it?.qty || 1), 0);
      setCount(c);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    readCount();
    const onStorage = (e) => e.key === CART_KEY && readCount();
    const onCustom = () => readCount();

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onCustom);
    };
  }, []);

  return count;
}

const Navbar = () => {
  const { t } = useTranslation();
  const cartCount = useCartCount();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        (!buttonRef.current || !buttonRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="flex justify-between items-center p-3 sm:p-4 lg:p-5 shadow-lg font-sans 
                  mb-5 bg-white rounded-full mt-5 relative"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center z-10">
        <img src={logo} alt="logo" className="w-20 h-auto" />
      </Link>

      {/* Desktop Navigation (hidden below lg) */}
      <ul className="hidden lg:flex space-x-4 lg:space-x-8 text-center">
        <li>
          <Link to="/About" className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 text-sm lg:text-base">
            {t("navbar.about")}
          </Link>
        </li>
        <li>
          <Link to="/services" className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 text-sm lg:text-base">
            {t("navbar.services")}
          </Link>
        </li>
        <li>
          <Link to="/products" className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 text-sm lg:text-base">
            {t("navbar.products")}
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 text-sm lg:text-base">
            {t("navbar.contact")}
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:text-orange-600 transition-colors duration-200 py-2 px-1 text-sm lg:text-base">
            {t("navbar dashboard")}
          </Link>
        </li>
        <li>
          <Link
            to="/cat-hotel"
            className="hover:text-orange-600 w-3xl text-sm  lg:text-base "
          >
            {t("navbar.catHotel", { defaultValue: "Cat Hotel" })}
          </Link>
        </li>
      </ul>

      {/* Desktop Buttons (hidden below lg) */}
      <div className="hidden lg:flex items-center space-x-3 lg:space-x-4">
        <LanguageSwitcher />

        {/* Cart */}
        <Link
          to="/cart"
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-orange-300 hover:bg-orange-50 transition"
          aria-label="Cart"
          title="Cart"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13l-2-8H3M7 13l-1.5 6h12.9M9 21a1 1 0 110-2 1 1 0 010 2zm8 1a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-orange-400 text-black text-xs px-1.5 py-0.5 leading-none">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/login" className="px-3 lg:px-5 py-1 text-center bg-[#FFBD89] text-white hover:bg-orange-400 rounded-full transition duration-300 text-sm lg:text-base">
          {t("navbar.login")}
        </Link>
        <Link to="/RendezVous" className="px-3 lg:px-5 py-1 text-center bg-[#FFBD89] text-white hover:bg-orange-400 rounded-full transition duration-300 text-sm lg:text-base">
          {t("navbar.appointment")}
        </Link>
      </div>

      {/* Mobile / Tablet Menu Button (visible below lg) */}
      <div className="flex items-center space-x-2 lg:hidden">
        <LanguageSwitcher />

        {/* Cart */}
        <Link
          to="/cart"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-orange-300 hover:bg-orange-50 transition"
          aria-label="Cart"
          onClick={() => setIsOpen(false)}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13l-2-8H3M7 13l-1.5 6h12.9M9 21a1 1 0 110-2 1 1 0 010 2zm8 1a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-orange-400 text-black text-[10px] px-1 py-0.5 leading-none">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Hamburger */}
        <button
          ref={buttonRef}
          className="focus:outline-none z-10 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl rounded-2xl mt-1 mx-4 z-50 
                    overflow-hidden transition-all duration-300 ease-in-out transform origin-top 
                    ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 h-0"}`}
        style={{ minWidth: "calc(100% - 2rem)" }}
      >
        <ul className="flex flex-col p-2 space-y-1">
          <li>
            <Link to="/About" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.about")}
            </Link>
          </li>
          <li>
            <Link to="/services" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.services")}
            </Link>
          </li>
          <li>
            <Link to="/products" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.products")}
            </Link>
          </li>
          <li>
            <Link to="/contact" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.contact")}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.dashboard")}
            </Link>
          </li>
          <li>
            <Link to="/cart" className="block py-3 px-4 hover:bg-orange-50 rounded-lg text-sm" onClick={() => setIsOpen(false)}>
              {t("navbar.cart", { defaultValue: "Cart" })}
            </Link>
          </li>
        </ul>

        <div className="flex p-2 border-t border-gray-100 space-x-2">
          <Link to="/login" className="flex-1 text-center px-2 py-2 bg-[#FFBD89] text-white hover:bg-orange-400 rounded-full text-xs sm:text-sm" onClick={() => setIsOpen(false)}>
            {t("navbar.login")}
          </Link>
          <Link to="/RendezVous" className="flex-1 text-center px-2 py-2 bg-[#FFBD89] text-white hover:bg-orange-400 rounded-full text-xs sm:text-sm" onClick={() => setIsOpen(false)}>
            {t("navbar.appointment")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
