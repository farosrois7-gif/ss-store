import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://ss-store-production.up.railway.app";

export default function UserHome() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [wishlist, setWishlist] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(10);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isLogin = !!localStorage.getItem("token");

    // ================= FETCH =================
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");

            const data = (res.data.data || []).map((p) => ({
                ...p,
                rating: p.rating || (Math.random() * 5).toFixed(1),
                discount: Math.floor(Math.random() * 40),
            }));

            setProducts(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ================= HERO =================
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === products.slice(0, 5).length - 1 ? 0 : prev + 1
            );
        }, 3500);

        return () => clearInterval(interval);
    }, [products]);

    // ================= INFINITE SCROLL =================
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                setVisible((prev) => prev + 10);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ================= CART =================
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.reduce((acc, item) => acc + item.qty, 0));
    }, [products]);

    // ================= IMAGE =================
    const getImageUrl = (img) =>
        img?.startsWith("http") ? img : `${BASE_URL}${img}`;

    // ================= ADD TO CART =================
    const addToCart = (product) => {
        if (!isLogin) return setShowLoginPopup(true);

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const exist = cart.find((i) => i._id === product._id);

        if (exist) exist.qty += 1;
        else cart.push({ ...product, qty: 1 });

        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.reduce((a, b) => a + b.qty, 0));
    };

    // ================= WISHLIST =================
    const toggleWishlist = (product) => {
        let updated;

        if (wishlist.find((i) => i._id === product._id)) {
            updated = wishlist.filter((i) => i._id !== product._id);
        } else {
            updated = [...wishlist, product];
        }

        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    const renderStars = (rating) => "⭐".repeat(Math.round(rating));

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const heroProducts = products.filter((p) => p.image).slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR (TIDAK DIUBAH) */}
            <div className="bg-white shadow-sm sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">

                    <h1
                        onClick={() => navigate("/shop")}
                        className="text-xl font-bold text-indigo-600 cursor-pointer"
                    >
                        SS Store
                    </h1>

                    <input
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border px-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    <div className="flex items-center gap-5">

                        {/* ❤️ */}
                        <div
                            onClick={() => navigate("/wishlist")}
                            className="relative cursor-pointer text-xl"
                        >
                            ❤️
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </div>

                        {/* 🛒 */}
                        <div
                            onClick={() =>
                                isLogin
                                    ? navigate("/cart")
                                    : setShowLoginPopup(true)
                            }
                            className="relative cursor-pointer text-xl"
                        >
                            🛒
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        {/* USER */}
                        <div className="relative group">
                            <div className="flex items-center gap-2 cursor-pointer">
                                👤
                                <span className="text-sm text-gray-600">
                                    {user?.name || "Guest"}
                                </span>
                            </div>

                            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition p-2 z-50">
                                <div
                                    onClick={() => navigate("/history")}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    📦 History
                                </div>

                                <div
                                    onClick={() => navigate("/wishlist")}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    ❤️ Wishlist
                                </div>

                                {isLogin ? (
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.reload();
                                        }}
                                        className="w-full text-left px-3 py-2 text-red-500 text-sm"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="w-full text-left px-3 py-2 text-indigo-600 text-sm"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HERO (TETAP) */}
            <div className="max-w-7xl mx-auto px-4 mt-5">
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl">
                    {heroProducts.map((item, index) => (
                        <div
                            key={item._id}
                            className={`absolute inset-0 transition-all duration-700 ${
                                index === currentSlide
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-105"
                            }`}
                        >
                            <img
                                src={getImageUrl(item.image)}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* PRODUK */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <h2 className="text-lg font-semibold mb-4">
                    Produk Terbaru
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                    {filteredProducts.slice(0, visible).map((item) => {
                        const isWish = wishlist.find(i => i._id === item._id);

                        return (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition group overflow-hidden cursor-pointer"
                            >

                                <div className="relative">
                                    <img
                                        src={getImageUrl(item.image)}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition"
                                    />

                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                        -{item.discount}%
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(item);
                                        }}
                                        className="absolute top-2 right-2 text-xl"
                                    >
                                        {isWish ? "❤️" : "🤍"}
                                    </button>
                                </div>

                                <div className="p-3">
                                    <h2 className="text-sm font-medium line-clamp-2">
                                        {item.name}
                                    </h2>

                                    <p className="text-xs text-yellow-500 mt-1">
                                        {renderStars(item.rating)} ({item.rating})
                                    </p>

                                    <p className="text-indigo-600 font-bold mt-1">
                                        Rp {item.price}
                                    </p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(item);
                                        }}
                                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
                                    >
                                        + Keranjang
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* LOGIN POPUP */}
            {showLoginPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl text-center w-80">
                        <h2 className="font-bold text-lg">Login dulu</h2>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded-lg w-full"
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}