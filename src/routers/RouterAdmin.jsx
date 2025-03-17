import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Product from "../pages/product/Product";
import Category from "../pages/category/Category";
import CreateProduct from "../pages/product/CreateProduct";

const RouterAdmin = () => {
  return (
    <Routes>
      {/* Giao diện Admin */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} /> {/* Trang mặc định */}
        <Route path="product" element={<Product />} />
        <Route path="category" element={<Category />} />

      {/* buton */}
      <Route path="createproduct" element={<CreateProduct />} />

      </Route>
    </Routes>
  );
};

export default RouterAdmin;
