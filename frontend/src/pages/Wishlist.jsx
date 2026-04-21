import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://ss-store-production.up.railway.app";

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();
    const isLogin = !!localStorage.getItem("token");

    // ================= LOAD DATA =================
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(data);

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.reduce((acc, item) => acc + item.qty, 0));
    }, []);

    // ================= IMAGE =================
    const getImageUrl = (img) =>
        img?.startsWith("http") ? img : `${BASE_URL}${img}`;

    // ================= REMOVE =================
    const removeWishlist = (id) => {
        const updated = wishlist.filter((item) => item._id !== id);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    // ================= ADD TO CART =================
    const addToCart = (product) => {
        if (!isLogin) {
            navigate("/login");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const exist = cart.find((i) => i._id === product._id);

        if (exist) exist.qty += 1;
        else cart.push({ ...product, qty: 1 });

        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.reduce((a, b) => a + b.qty, 0));
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <div className="bg-white shadow-sm sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

                    <h1
                        onClick={() => navigate("/shop")}
                        className="text-xl font-bold text-indigo-600 cursor-pointer"
                    >
                        SS Store
                    </h1>

                    <div
                        onClick={() => navigate("/cart")}
                        className="relative cursor-pointer text-xl"
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 mt-6">

                <h2 className="text-xl font-semibold mb-5">
                    Wishlist ❤️
                </h2>

                {/* EMPTY STATE */}
                {wishlist.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">
                            Wishlist kamu masih kosong 😢
                        </p>

                        <button
                            onClick={() => navigate("/shop")}
                            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg"
                        >
                            Belanja Sekarang
                        </button>
                    </div>
                )}

                {/* LIST */}
                {wishlist.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

                        {wishlist.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
                            >

                                <div className="relative">
                                    <img
                                        src={getImageUrl(item.image)}
                                        className="w-full h-40 object-cover"
                                    />

                                    <button
                                        onClick={() => removeWishlist(item._id)}
                                        className="absolute top-2 right-2 text-xl"
                                    >
                                        ❤️
                                    </button>
                                </div>

                                <div className="p-3">

                                    <h2 className="text-sm font-medium line-clamp-2">
                                        {item.name}
                                    </h2>

                                    <p className="text-indigo-600 font-bold mt-1">
                                        Rp {item.price}
                                    </p>

                                    <button
                                        onClick={() => addToCart(item)}
                                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
                                    >
                                        + Keranjang
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}