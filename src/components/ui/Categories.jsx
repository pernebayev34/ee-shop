import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Categories = () => {
  const token = localStorage.getItem("accessToken");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch("https://backend.magnateshop.uz/api/categories", { headers: { Authorization: "Bearer " + token } })
      .then((r) => r.json())
      .then((r) => { if (r.success) setCategories(r.data.items || r.data || []); else toast.error(r.message); })
      .catch(() => toast.error("Yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditingItem(null); setForm({ name: "", description: "" }); setModalOpen(true); };
  const openEdit = (item) => { setEditingItem(item); setForm({ name: item.name, description: item.description || "" }); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditingItem(null); setForm({ name: "", description: "" }); };

  const save = () => {
    if (!form.name.trim()) { toast.error("Nomini kiriting"); return; }
    setSaving(true);
    const url = editingItem ? "https://backend.magnateshop.uz/api/categories/" + editingItem.id : "https://backend.magnateshop.uz/api/categories";
    fetch(url, {
      method: editingItem ? "PUT" : "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name.trim(), description: form.description.trim() }),
    }).then((r) => r.json()).then((r) => {
      if (r.success) {
        toast.success(editingItem ? "Yangilandi" : "Qo'shildi");
        editingItem ? setCategories(categories.map((c) => c.id === editingItem.id ? { ...c, name: form.name.trim(), description: form.description.trim() } : c)) : setCategories([...categories, r.data]);
        close();
      } else toast.error(r.message);
    }).catch(() => toast.error("Xatolik")).finally(() => setSaving(false));
  };

  const remove = (id) => {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    fetch("https://backend.magnateshop.uz/api/categories/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } })
      .then((r) => { if (r.ok) { toast.success("O'chirildi"); setCategories(categories.filter((c) => c.id !== id)); } });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kategoriyalar</h2>
          <p className="text-sm text-gray-400 mt-0.5">Jami {categories.length} ta kategoriya</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
          Qo'shish
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : categories.length === 0 ? (
        <p className="p-12 text-center text-gray-400">Kategoriyalar topilmadi</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Nomi</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Tavsif</th>
                <th className="text-right px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.description || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(cat)} className="px-3.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Tahrirlash</button>
                      <button onClick={() => remove(cat.id)} className="px-3.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">O'chirish</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-5">{editingItem ? "Tahrirlash" : "Yangi kategoriya"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Nomi</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" placeholder="Kategoriya nomi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Tavsif</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none" placeholder="Tavsif (ixtiyoriy)" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-7">
              <button onClick={close} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Bekor qilish</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
