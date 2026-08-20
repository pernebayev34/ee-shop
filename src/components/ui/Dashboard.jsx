import { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [values, setValues] = useState({ total: 0, sold: 0, exported: 0, money: 0 });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    fetch("https://backend.magnateshop.uz/api/products?page=1&limit=100", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        const sum = items.reduce((acc, i) => acc + (i.price * i.stock), 0);
        setValues({
          total: res.data?.total || items.length,
          sold: items.filter((i) => !i.isActive).length,
          exported: items.filter((i) => i.stock === 0).length,
          money: sum,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-5 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
              <p className="text-sm font-medium opacity-80">Jami mahsulotlar</p>
              <p className="text-3xl font-bold mt-2">{values.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
              <p className="text-sm font-medium opacity-80">Sotilganlar</p>
              <p className="text-3xl font-bold mt-2">{values.sold}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
              <p className="text-sm font-medium opacity-80">Export qilingan</p>
              <p className="text-3xl font-bold mt-2">{values.exported}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
              <p className="text-sm font-medium opacity-80">Jami pul</p>
              <p className="text-3xl font-bold mt-2">{values.money.toLocaleString()} so'm</p>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
