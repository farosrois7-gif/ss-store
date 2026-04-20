import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://ss-store-production.up.railway.app";

export default function UserHome() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [historyNotif, setHistoryNotif] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isLogin = !!localStorage.getItem("token");

    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data.data || []);
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
        return image.startsWith("http")
            ? image
            : `${BASE_URL}${image}`;
    };

    // =========================
    // ADD TO CART (LOGIN CHECK)
    // =========================
    const addToCart = (product) => {
        if (!isLogin) {
            setShowLoginPopup(true);
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find((item) => item._id === product._id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                _id: product._id, // 🔥 pastikan ini dikirim
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                qty: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        const total = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(total);
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");


        window.location.reload();
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

                    <h1
                        onClick={() => navigate("/shop")}
                        className="text-lg md:text-xl font-bold text-indigo-600 cursor-pointer"
                    >
                        SS Store
                    </h1>

                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/3 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="flex items-center gap-4">

                        {/* CART */}
                        <div
                            className="relative cursor-pointer"
                            onClick={() => {
                                if (!isLogin) {
                                    setShowLoginPopup(true);
                                    return;
                                }
                                navigate("/cart");
                            }}
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
                                    {user?.name || "Guest"}
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

                                {isLogin ? (
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-500"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-indigo-600"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BANNER */}
            <div className="max-w-7xl mx-auto mt-4 px-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl shadow">
                    <h2 className="text-xl font-bold">Promo Hari Ini 🔥</h2>
                    <p className="text-sm opacity-90">
                        Diskon besar-besaran untuk semua produk!
                    </p>
                </div>
            </div>

            {/* PRODUK */}
            <div className="max-w-7xl mx-auto p-4 mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {filteredProducts.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                    >
                        <img
                            src={getImageUrl(item.image)}
                            className="w-full h-40 object-cover"
                            alt={item.name}
                        />

                        <div className="p-3">

                            <h2 className="font-semibold text-sm line-clamp-2">
                                {item.name}
                            </h2>

                            <p className="text-indigo-600 font-bold mt-1">
                                Rp {item.price}
                            </p>

                            <p className="text-xs text-gray-400">
                                Stok: {item.stock}
                            </p>

                            <button
                                onClick={() => addToCart(item)}
                                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
                            >
                                + Keranjang
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {/* LOGIN POPUP */}
            {showLoginPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80 text-center">

                        <h2 className="text-lg font-bold mb-2">
                            Login Dulu
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            Untuk menambahkan ke keranjang, kamu harus login dulu
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full"
                        >
                            Login Sekarang
                        </button>

                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="mt-2 text-sm text-gray-500"
                        >
                            Nanti saja
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}