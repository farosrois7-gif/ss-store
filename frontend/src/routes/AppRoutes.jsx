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

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <Routes>

            {/* =========================
                HOMEPAGE (USER / GUEST)
            ========================= */}
            <Route path="/" element={<UserHome />} />
            <Route path="/shop" element={<UserHome />} />

            {/* =========================
                AUTH
            ========================= */}
            <Route
                path="/login"
                element={
                    token ? <Navigate to="/" /> : <Login />
                }
            />

            <Route
                path="/register"
                element={
                    token ? <Navigate to="/" /> : <Register />
                }
            />

            {/* =========================
                USER FEATURES
            ========================= */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/history" element={<History />} />

            {/* =========================
                ADMIN PROTECTED ROUTE
            ========================= */}
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/dashboard"
                    element={
                        role === "admin"
                            ? <Dashboard />
                            : <Navigate to="/" />
                    }
                />
                <Route path="/produk" element={<Produk />} />
                <Route path="/penjualan" element={<Penjualan />} />
            </Route>

            {/* =========================
                FALLBACK
            ========================= */}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    );
}