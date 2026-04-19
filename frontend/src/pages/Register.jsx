import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post("/auth/register", form);
            alert("Register berhasil");

            navigate("/login");

        } catch (err) {
            alert(err.response?.data?.message || "Register gagal");
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
                    Create Account
                </h2>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Daftar SS Store
                </p>

                <input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    className="w-full mb-3 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

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
                    Register
                </button>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Sudah punya akun?{" "}
                    <a href="/login" className="text-indigo-600 font-semibold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}