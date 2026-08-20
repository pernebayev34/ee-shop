import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("https://backend.magnateshop.uz/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        setLoading(false);
        if (r.success) { localStorage.setItem("accessToken", r.data.accessToken); navigate("/dashboard"); }
        else toast.error(r.message);
      })
      .catch(() => { setLoading(false); toast.error("Xatolik yuz berdi"); });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -bottom-20 -right-20"></div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-[420px] relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/30">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Magnat Shop</h1>
          <p className="text-sm text-gray-400 mt-1">Admin panelga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Login</label>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login kiriting"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Parol</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parolni kiriting"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-gray-50/50" />
          </div>
          <button disabled={loading} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 disabled:opacity-50 transition-all duration-200">
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
