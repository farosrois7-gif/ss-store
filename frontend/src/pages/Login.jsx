import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom"; // ✅ tambah ini

export default function Login() {
    const navigate = useNavigate(); // ✅ tambah ini

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

            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);

            if (user.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/shop"); // ✅ user masuk sini
            }

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

            <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10"></div>

            <div className="relative backdrop-blur-lg bg-white/20 border border-white/30 p-8 rounded-2xl shadow-2xl w-96 text-white">

                <h2 className="text-3xl font-bold text-center mb-6">
                    Welcome Back 👋
                </h2>

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 rounded-lg bg-white/30"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full mb-4 p-3 rounded-lg bg-white/30"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-indigo-600 font-semibold p-3 rounded-lg hover:scale-105 transition"
                >
                    Login
                </button>

                <p className="text-sm text-center mt-4">
                    Belum punya akun?{" "}
                    <a href="/register" className="underline font-semibold">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}