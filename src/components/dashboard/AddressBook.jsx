import { useEffect, useState } from "react";
import { MapPin, Plus, ArrowLeft, Check, Pencil, Trash2 } from "lucide-react";
import {
  getAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/addresses";

const BRAND = "#ea5b3a";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  district: "",
  zone: "",
  address: "",
};

export default function AddressBook({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [view, setView] = useState("list"); // "list" | "form"
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAddresses().then(setAddresses);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setError("");
    setForm({
      ...emptyForm,
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    setView("form");
  };

  const openEdit = (addr) => {
    setEditingId(addr.id);
    setError("");
    setForm({
      name: addr.name,
      phone: addr.phone,
      email: addr.email,
      district: addr.district,
      zone: addr.zone,
      address: addr.address,
    });
    setView("form");
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Name, phone number and address line are required.");
      return;
    }

    const list = await saveAddress({ ...form, ...(editingId && { id: editingId }) });
    setAddresses(list);
    setView("list");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    setAddresses(await deleteAddress(id));
  };

  const handleSelect = async (id) => setAddresses(await setDefaultAddress(id));

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#ea5b3a] focus:ring-4 focus:ring-[#ea5b3a]/10 transition-all";
  const labelClass =
    "block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5";

  const brandBtn =
    "inline-flex items-center gap-2 bg-[#ea5b3a] hover:bg-[#d44a2a] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95";

  /* ---------------- FORM VIEW ---------------- */
  if (view === "form") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Edit Address" : "Create New Address"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Please provide accurate shipping/billing information
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView("list")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>District</label>
              <input name="district" value={form.district} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Zone</label>
              <input name="zone" value={form.zone} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Address Line</label>
            <input name="address" value={form.address} onChange={handleChange} className={inputClass} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-5 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button type="submit" className={brandBtn}>
              <Plus className="w-4 h-4" /> Save Address
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* ---------------- LIST VIEW ---------------- */
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-start justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Address Book</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your saved addresses for a faster checkout experience
          </p>
        </div>
        <button onClick={openCreate} className={brandBtn}>
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Record found!</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            Whoops! It seems no addresses are added yet. Add a shipping address to get started.
          </p>
          <button onClick={openCreate} className={`${brandBtn} mt-6`}>
            <Plus className="w-4 h-4" /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr.id)}
              className="relative cursor-pointer rounded-xl p-4 transition-all border-2"
              style={{ borderColor: addr.isDefault ? BRAND : "#e2e8f0" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center border-2"
                  style={{
                    background: addr.isDefault ? BRAND : "transparent",
                    borderColor: addr.isDefault ? BRAND : "#cbd5e1",
                  }}
                >
                  {addr.isDefault && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {addr.name}{" "}
                    <span className="font-normal text-sm text-slate-500">({addr.phone})</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {[addr.address, addr.zone, addr.district].filter(Boolean).join(", ")}
                  </p>
                  {addr.email && (
                    <p className="text-xs text-slate-400 mt-1">{addr.email}</p>
                  )}
                </div>

                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(addr)}
                    className="p-1.5 text-slate-400 hover:text-[#ea5b3a] rounded"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
