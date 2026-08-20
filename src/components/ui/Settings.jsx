import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const token = localStorage.getItem("accessToken");
  const [form, setForm] = useState({ shopName: "", phone: "", address: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("https://backend.magnateshop.uz/api/settings", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((r) => { if (r.success && r.data) setForm((p) => ({ ...p, ...r.data })); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    if (!form.shopName.trim()) { toast.error("Do'kon nomini kiriting"); return; }
    setSaving(true);
    fetch("https://backend.magnateshop.uz/api/settings", {
      method: "PUT",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((r) => r.json()).then((r) => {
      if (r.success) toast.success("Saqlandi");
      else toast.error(r.message || "Xatolik");
    }).catch(() => toast.error("Xatolik")).finally(() => setSaving(false));
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50/50";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Sozlamalar</h2>
        <p className="text-sm text-gray-400 mt-0.5">Do'kon ma'lumotlarini boshqarish</p>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-7 space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Do'kon nomi</label>
            <input type="text" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className={inputClass} placeholder="Do'kon nomi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Telefon raqam</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+998 XX XXX XX XX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Manzil</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Do'kon manzili" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="example@mail.com" />
          </div>
          <div className="pt-2">
            <button onClick={save} disabled={saving} className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all">
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
