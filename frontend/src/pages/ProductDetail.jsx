import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

const BASE_URL = "https://ss-store-production.up.railway.app";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);

    const isLogin = !!localStorage.getItem("token");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            // ✅ FIX DISINI (hapus /api)
            const res = await api.get(`/products/${id}`);

            setProduct(res.data.data);
        } catch (err) {
            console.log("ERROR:", err);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (img) =>
        img?.startsWith("http") ? img : `${BASE_URL}${img}`;

    const addToCart = () => {
        if (!isLogin) return navigate("/login");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find((i) => i._id === product._id);

        if (exist) exist.qty += qty;
        else cart.push({ ...product, qty });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Berhasil ditambahkan ke keranjang!");
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="p-10 text-center animate-pulse">
                Loading produk...
            </div>
        );
    }

    // ================= NOT FOUND =================
    if (!product) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">
                    Produk tidak ditemukan
                </h2>

                <button
                    onClick={() => navigate("/shop")}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Kembali ke Shop
                </button>
            </div>
        );
    }

    // ================= UI =================
    return (
        <div className="max-w-6xl mx-auto p-4">

            {/* BACK */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-indigo-600"
            >
                ← Kembali
            </button>

            <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow">

                {/* IMAGE */}
                <div>
                    <img
                        src={getImageUrl(product.image)}
                        className="w-full rounded-xl shadow hover:scale-105 transition"
                    />
                </div>

                {/* DETAIL */}
                <div>
                    <h1 className="text-2xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-3xl text-indigo-600 font-bold mt-2">
                        Rp {product.price}
                    </p>

                    <p className="text-gray-500 mt-2">
                        Stok: {product.stock}
                    </p>

                    {/* QTY */}
                    <div className="flex items-center gap-3 mt-5">
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="px-3 py-1 border rounded"
                        >
                            -
                        </button>

                        <span className="font-semibold">{qty}</span>

                        <button
                            onClick={() => setQty(qty + 1)}
                            className="px-3 py-1 border rounded"
                        >
                            +
                        </button>
                    </div>

                    {/* ACTION */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={addToCart}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                        >
                            + Keranjang
                        </button>

                        <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
                            Beli Sekarang
                        </button>
                    </div>

                    {/* DESC */}
                    <div className="mt-6">
                        <h2 className="font-semibold mb-2">
                            Deskripsi Produk
                        </h2>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            {product.description || "Tidak ada deskripsi"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}