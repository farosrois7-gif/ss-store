import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post("/auth/login", form);

            const token = res.data.data.token;
            const user = res.data.data.user;

            // simpan auth
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user.role);

            // 🔥 PENTING: replace biar ga nyangkut di route lama
            if (user.role === "admin") {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/shop", { replace: true });
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login gagal");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-3 p-3 border rounded-lg"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border rounded-lg"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg"
                >
                    Login
                </button>
            </div>
        </div>
    );
}