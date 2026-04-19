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

            // =========================
            // FIX ROLE REDIRECT
            // =========================
            if (user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/shop");
            }

        } catch (err) {
            alert(err.response?.data?.message || "Login gagal");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* BACKGROUND */}
            <div className="absolute w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl top-10 left-10"></div>
            <div className="absolute w-72 h-72 bg-purple-300/30 rounded-full blur-3xl bottom-10 right-10"></div>

            {/* CARD */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Welcome Back
                </h2>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Login ke SS Store
                </p>

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-lg transition"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Belum punya akun?{" "}
                    <a href="/register" className="text-indigo-600 font-semibold">
                        Register
                    </a>
                </p>

            </div>
        </div>
    );
}