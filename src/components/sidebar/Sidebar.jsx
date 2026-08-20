import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/products", label: "Mahsulotlar" },
  { to: "/dashboard/categories", label: "Kategoriyalar" },
  { to: "/dashboard/settings", label: "Sozlamalar" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-base font-bold">Magnat Shop</h2>
        <p className="text-[11px] text-gray-500">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 " +
              (isActive
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800/60 hover:text-white")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => { localStorage.removeItem("accessToken"); navigate("/login"); }}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-600/10 hover:text-red-400 transition-all duration-200"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
