import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [historyNotif, setHistoryNotif] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const total = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(total);
    }, [products]);

    useEffect(() => {
        const notif = localStorage.getItem("checkoutSuccess");
        if (notif) setHistoryNotif(true);
    }, []);

    const getImageUrl = (image) => {
        if (!image) return "";
        return `http://localhost:5000${image}`;
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item._id === product._id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        const total = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(total);

        alert("Masuk ke keranjang 🛒");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const goToHistory = () => {
        localStorage.removeItem("checkoutSuccess");
        setHistoryNotif(false);
        navigate("/history");
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">

            {/* NAVBAR */}
            <div className="bg-white shadow sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3">

                    {/* LOGO */}
                    <h1
                        onClick={() => navigate("/shop")}
                        className="text-lg md:text-xl font-bold text-indigo-600 cursor-pointer"
                    >
                        SS Store
                    </h1>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {/* RIGHT */}
                    <div className="flex items-center gap-4">

                        {/* CART */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => navigate("/cart")}
                        >
                            <span className="text-xl">🛒</span>

                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        {/* USER */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span>👤</span>
                                <span className="text-xs md:text-sm text-gray-600">
                                    {user?.name || "User"}
                                </span>
                            </div>

                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition p-2 z-50">
                                <div
                                    onClick={goToHistory}
                                    className="flex justify-between items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-sm cursor-pointer"
                                >
                                    <span>📦 History</span>

                                    {historyNotif && (
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BANNER */}
            <div className="max-w-7xl mx-auto mt-4 md:mt-6 px-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-6 rounded-2xl shadow">
                    <h2 className="text-lg md:text-2xl font-bold">
                        Promo Hari Ini 🔥
                    </h2>
                    <p className="text-xs md:text-sm opacity-90">
                        Diskon besar-besaran untuk semua produk!
                    </p>
                </div>
            </div>

            {/* PRODUK */}
            <div className="max-w-7xl mx-auto p-4 mt-4 md:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">

                {filteredProducts.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                    >
                        <img
                            src={getImageUrl(item.image)}
                            className="w-full h-32 sm:h-36 md:h-40 object-cover"
                            alt={item.name}
                        />

                        <div className="p-3 md:p-4">
                            <h2 className="font-semibold text-xs md:text-sm line-clamp-2">
                                {item.name}
                            </h2>

                            <p className="text-indigo-600 font-bold mt-1 text-sm md:text-base">
                                Rp {item.price}
                            </p>

                            <p className="text-xs text-gray-400">
                                Stok: {item.stock}
                            </p>

                            <button
                                onClick={() => addToCart(item)}
                                className="mt-2 md:mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 md:py-2 rounded-lg text-xs md:text-sm"
                            >
                                + Keranjang
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}