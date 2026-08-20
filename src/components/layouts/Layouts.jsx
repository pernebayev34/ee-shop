import React, { useEffect } from "react";
import Login from "../ui/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../ui/Dashboard";
import Products from "../ui/Products";
import Categories from "../ui/Categories";
import Settings from "../ui/Settings";

const Layouts = () => {
  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();


  useEffect(() => {
    if (accessToken) return navigate("/dashboard");
    else return navigate("/login");
  }, [accessToken]);

  return (
    <div>
      <Routes>
        {accessToken ? (
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        ) : (
          <Route path="/login" element={<Login />} />
        )}
      </Routes>
    </div>
  );
};

export default Layouts;
