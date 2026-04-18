import { useState } from "react";
import { api } from "../api/axios";

export default function Register() {
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
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">

            {/* Background blur */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl top-5 left-5"></div>
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl bottom-5 right-5"></div>

            {/* Card */}
            <div className="relative backdrop-blur-xl bg-white/20 border border-white/30 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    Create Account 🚀
                </h2>

                <p className="text-center text-xs md:text-sm mb-6 opacity-80">
                    Daftar untuk mulai menggunakan SS Store
                </p>

                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full mb-3 md:mb-4 p-2.5 md:p-3 rounded-lg bg-white/30 placeholder-white text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white transition"
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full mb-3 md:mb-4 p-2.5 md:p-3 rounded-lg bg-white/30 placeholder-white text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white transition"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full mb-3 md:mb-4 p-2.5 md:p-3 rounded-lg bg-white/30 placeholder-white text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white transition"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-white text-indigo-600 font-semibold p-2.5 md:p-3 rounded-lg hover:scale-105 hover:bg-gray-100 transition duration-200 text-sm md:text-base"
                >
                    Register
                </button>

                <p className="text-xs md:text-sm text-center mt-4">
                    Sudah punya akun?{" "}
                    <a href="/login" className="underline font-semibold">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}