import React from "react";
import Home from "./pages/Home.jsx";
import Navbar from "./component/Navbar.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import OurServices from "./pages/OurServices.jsx";
import Login from "./pages/login.jsx";
import RendezVous from "./pages/rendezVous.jsx";
import Contact from "./pages/Contact.jsx";
import Footer from "./component/footer.jsx";
import Products from "./pages/products.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Orders from "./pages/Orders.jsx";
import Appointments from "./pages/Appointments.jsx";
import Reservations from "./pages/Reservations.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import { Route, Routes } from "react-router-dom";
import CatHotel from "./pages/CatHotel";
import "./i18n/config";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/RendezVous" element={<RendezVous />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cat-hotel" element={<CatHotel />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/AdminProducts" element={<AdminProducts />} />
        <Route path="/dashboard/Orders" element={<Orders />} />
        <Route path="/dashboard/Users" element={<Users />} />
        <Route path="/dashboard/Appointments" element={<Appointments />} />
        <Route path="/dashboard/Reservations" element={<Reservations />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
