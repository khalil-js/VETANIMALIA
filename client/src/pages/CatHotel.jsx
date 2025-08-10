// src/pages/CatHotel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaUser, FaCat } from "react-icons/fa";

const LS_DRAFT = "catHotel:formDraft";
const NIGHTLY_DEFAULT = 30;

function calcNights(inDate, outDate) {
  if (!inDate || !outDate) return 0;
  const a = new Date(inDate);
  const b = new Date(outDate);
  const ms = b - a;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export default function CatHotel() {
  const [form, setForm] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(LS_DRAFT) || "null") || {
          ownerName: "",
          phone: "",
          email: "",
          catName: "",
          breed: "",
          sex: "",
          age: "",
          vaccinated: false,
          checkIn: "",
          checkOut: "",
          dropOffTime: "",
          pickUpTime: "",
          pricePerNight: NIGHTLY_DEFAULT,
          notes: "",
        }
      );
    } catch {
      return {
        ownerName: "",
        phone: "",
        email: "",
        catName: "",
        breed: "",
        sex: "",
        age: "",
        vaccinated: false,
        checkIn: "",
        checkOut: "",
        dropOffTime: "",
        pickUpTime: "",
        pricePerNight: NIGHTLY_DEFAULT,
        notes: "",
      };
    }
  });

  const [errors, setErrors] = useState({});
  const nights = useMemo(() => calcNights(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);
  const total = useMemo(() => (Number(form.pricePerNight) || 0) * nights, [form.pricePerNight, nights]);

  useEffect(() => {
    localStorage.setItem(LS_DRAFT, JSON.stringify(form));
  }, [form]);

  const onChange = (k) => (e) => {
    const val = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [k]: val }));
  };

  const validate = () => {
    const e = {};
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.catName.trim()) e.catName = "Cat name is required";
    if (!form.checkIn) e.checkIn = "Check‑in is required";
    if (!form.checkOut) e.checkOut = "Check‑out is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.phone && !/^\+?[0-9\s()-]{6,}$/.test(form.phone)) e.phone = "Invalid phone";
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn)) {
      e.checkOut = "Check‑out must be after check‑in";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert(`Booking received for ${form.catName}!\nNights: ${nights}\nTotal: ${total.toFixed(2)} GEL`);
  };

  const clearDraft = () => {
    localStorage.removeItem(LS_DRAFT);
    setForm({
      ownerName: "",
      phone: "",
      email: "",
      catName: "",
      breed: "",
      sex: "",
      age: "",
      vaccinated: false,
      checkIn: "",
      checkOut: "",
      dropOffTime: "",
      pickUpTime: "",
      pricePerNight: NIGHTLY_DEFAULT,
      notes: "",
    });
    setErrors({});
  };

  return (
    <div className="p-4 md:p-6">{/* no SideBar; no ml-16 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaCat className="text-gray-400" /> Cat Hotel Booking Form
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Owner info */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaUser className="text-gray-400" /> Owner Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Owner name *</label>
                <input
                  className={`w-full border rounded-md px-3 py-2 ${errors.ownerName ? "border-red-400" : ""}`}
                  placeholder="e.g., John Smith"
                  value={form.ownerName}
                  onChange={onChange("ownerName")}
                />
                {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input
                  className={`w-full border rounded-md px-3 py-2 ${errors.phone ? "border-red-400" : ""}`}
                  placeholder="+213 ..."
                  value={form.phone}
                  onChange={onChange("phone")}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  className={`w-full border rounded-md px-3 py-2 ${errors.email ? "border-red-400" : ""}`}
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={onChange("email")}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Cat info */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaCat className="text-gray-400" /> Cat Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Cat name *</label>
                <input
                  className={`w-full border rounded-md px-3 py-2 ${errors.catName ? "border-red-400" : ""}`}
                  placeholder="e.g., Mittens"
                  value={form.catName}
                  onChange={onChange("catName")}
                />
                {errors.catName && <p className="mt-1 text-xs text-red-600">{errors.catName}</p>}
              </div>
              <label className="flex items-center gap-2 text-sm md:col-span-3">
                <input type="checkbox" checked={form.vaccinated} onChange={onChange("vaccinated")} />
                Vaccinated
              </label>
            </div>
          </div>

          {/* Dates */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> Stay
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Check‑in *</label>
                <input type="date" className={`w-full border rounded-md px-3 py-2 ${errors.checkIn ? "border-red-400" : ""}`}
                  value={form.checkIn} onChange={onChange("checkIn")} />
                {errors.checkIn && <p className="mt-1 text-xs text-red-600">{errors.checkIn}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Check‑out *</label>
                <input type="date" className={`w-full border rounded-md px-3 py-2 ${errors.checkOut ? "border-red-400" : ""}`}
                  value={form.checkOut} onChange={onChange("checkOut")} />
                {errors.checkOut && <p className="mt-1 text-xs text-red-600">{errors.checkOut}</p>}
              </div>
              
            </div>

            <div className="mt-3 text-sm text-gray-600">
              Nights: <span className="font-semibold">{nights}</span> •
              Total: <span className="font-semibold">{total.toFixed(2)} GEL</span>
            </div>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Notes (feeding, meds, special care)</label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows="3"
              value={form.notes}
              onChange={onChange("notes")}
              placeholder="Any instructions we should know?"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={clearDraft}
              className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-50">
              Clear
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-orange-400 text-black hover:opacity-90 font-semibold"
            >
              Submit booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
