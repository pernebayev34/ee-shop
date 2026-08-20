import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductsTable from "./ProductsTable";

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://backend.magnateshop.uz/api/products?page=1&limit=100", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data.items || []); else toast.error(r.message); })
      .catch(() => toast.error("Yuklashda xatolik"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  return <ProductsTable data={data} loading={loading} onRefresh={fetchProducts} />;
};

export default Products;
