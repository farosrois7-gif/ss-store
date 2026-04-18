import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Produk from "../pages/Produk";
import Penjualan from "../pages/Penjualan";
import UserHome from "../pages/UserHome.jsx";
import Cart from "../pages/Cart";
import History from "../pages/History";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>

            {/* redirect */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔥 PROTECTED + LAYOUT */}
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/penjualan" element={<Penjualan />} />
            </Route>
            <Route path="/shop" element={<UserHome />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/history" element={<History />} />

            {/* fallback */}
            <Route path="*" element={<h1>404 Not Found</h1>} />

        </Routes>
    );
}