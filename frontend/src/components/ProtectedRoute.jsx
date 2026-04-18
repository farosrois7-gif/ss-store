import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // belum login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // bukan admin
    if (role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    // admin boleh masuk
    return children;
}