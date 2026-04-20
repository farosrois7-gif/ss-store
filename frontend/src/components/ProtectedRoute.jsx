import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // belum login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // bukan admin → lempar ke shop (bukan login lagi)
    if (role !== "admin") {
        return <Navigate to="/shop" replace />;
    }

    return children;
}