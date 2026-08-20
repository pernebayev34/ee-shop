import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API = "https://backend.magnateshop.uz/api";
const EMPTY_FORM = { name: "", price: "", stock: "", category: "", description: "", image: "" };

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
    <input {...props} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all" />
  </div>
);

const ProductsTable = ({ data, loading, onRefresh }) => {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((r) => { if (r.success) setCategories(r.data.items || r.data || []); });
  }, []);

  const totalPages = Math.ceil(data.length / perPage);
  const start = (page - 1) * perPage;
  const pageData = data.slice(start, start + perPage);

  const openAdd = () => { setEditingItem(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (item) => { setEditingItem(item); setForm({ name: item.name, price: item.price, stock: item.stock, category: item.categoryId || item.category?.id || "", description: item.description || "", image: item.image || "" }); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditingItem(null); setForm(EMPTY_FORM); };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = () => {
    if (!form.name || !form.price || !form.stock) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setSaving(true);
    const url = editingItem ? `${API}/products/${editingItem.id}` : `${API}/products`;
    const body = { name: form.name, price: Number(form.price), stock: Number(form.stock), description: form.description, image: form.image };
    if (form.category) body.categoryId = Number(form.category);

    fetch(url, { method: editingItem ? "PUT" : "POST", headers, body: JSON.stringify(body) })
      .then((r) => r.json())
      .then((r) => {
        if (r.success) { toast.success(editingItem ? "Yangilandi" : "Qo'shildi"); close(); onRefresh(); }
        else toast.error(r.message);
      })
      .catch(() => toast.error("Xatolik"))
      .finally(() => setSaving(false));
  };

  const remove = (id) => {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    fetch(`${API}/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.ok) { toast.success("O'chirildi"); onRefresh(); } });
  };

  const toggleActive = (id, status) => {
    fetch(`${API}/products/${id}`, { method: "PUT", headers, body: JSON.stringify({ isActive: !status }) })
      .then((r) => r.json())
      .then((r) => { if (r.success) { toast.success(status ? "Nofaol" : "Faol"); onRefresh(); } });
  };

  const thClass = "text-left px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider";
  const btnClass = "px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mahsulotlar</h2>
          <p className="text-sm text-gray-400 mt-0.5">Jami {data.length} ta mahsulot</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
          Qo'shish
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 mt-3">Yuklanmoqda...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className={thClass}>#</th>
                  <th className={thClass}>Nomi</th>
                  <th className={thClass}>Kategoriya</th>
                  <th className={thClass}>Narxi</th>
                  <th className={thClass}>Soni</th>
                  <th className={thClass}>Holat</th>
                  <th className="text-right px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageData.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{start + i + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.category?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.price?.toLocaleString()} so'm</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.stock} dona</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? "bg-emerald-500" : "bg-red-400"}`}></span>
                        {item.isActive ? "Faol" : "Nofaol"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(item)} className={`${btnClass} text-blue-600 bg-blue-50 hover:bg-blue-100`}>Tahrirlash</button>
                        <button onClick={() => toggleActive(item.id, item.isActive)} className={`${btnClass} ${item.isActive ? "text-orange-600 bg-orange-50 hover:bg-orange-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}>
                          {item.isActive ? "Nofaol" : "Faol"}
                        </button>
                        <button onClick={() => remove(item.id)} className={`${btnClass} text-red-600 bg-red-50 hover:bg-red-100`}>O'chirish</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.length === 0 && <p className="p-12 text-center text-gray-400">Mahsulotlar topilmadi</p>}

          {totalPages > 1 && (
            <div className="p-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">{start + 1}–{Math.min(start + perPage, data.length)} / {data.length}</p>
              <div className="flex gap-1.5">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all">Oldingi</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button key={num} onClick={() => setPage(num)} className={`w-9 h-9 text-sm font-medium rounded-lg transition-all ${page === num ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-50"}`}>{num}</button>
                ))}
                <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3.5 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all">Keyingi</button>
              </div>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-5">{editingItem ? "Tahrirlash" : "Yangi mahsulot"}</h3>
            <div className="space-y-4">
              <Input label="Nomi" type="text" value={form.name} onChange={set("name")} placeholder="Mahsulot nomi" />
              <Input label="Narxi" type="number" value={form.price} onChange={set("price")} placeholder="Narxi" />
              <Input label="Soni" type="number" value={form.stock} onChange={set("stock")} placeholder="Soni" />
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Kategoriyasi</label>
                <select value={form.category} onChange={set("category")} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all">
                  <option value="">Kategoriya tanlang</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <Input label="Tavsif" type="text" value={form.description} onChange={set("description")} placeholder="Tavsif" />
              <Input label="Rasmi" type="url" value={form.image} onChange={set("image")} placeholder="Rasm URL" />
            </div>
            <div className="flex gap-3 justify-end mt-7">
              <button onClick={close} className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Bekor qilish</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all">{saving ? "Saqlanmoqda..." : "Saqlash"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
