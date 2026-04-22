import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";

const BASE_URL = "https://ss-store-production.up.railway.app";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    const isLogin = !!localStorage.getItem("token");

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data);
        } catch (err) {
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${id}`);
            setReviews(res.data.data);
        } catch (err) {
            setReviews([]);
        }
    };

    const submitReview = async () => {
        try {
            const token = localStorage.getItem("token");

            // ❌ kalau belum login
            if (!token) {
                alert("Silakan login dulu");
                navigate("/login");
                return;
            }

            await api.post(
                "/reviews",
                {
                    productId: id,
                    rating,
                    comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Review berhasil dikirim");

            setComment("");
            setRating(5);

            fetchReviews();
        } catch (err) {
            console.log(err?.response?.data || err.message);
            alert("Gagal kirim review");
        }
    };
    const addToCart = () => {
        if (!isLogin) return navigate("/login");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find((i) => i._id === product._id);

        if (exist) {
            exist.qty += qty;
        } else {
            cart.push({ ...product, qty });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Masuk keranjang!");
    };

    const getImageUrl = (img) =>
        img?.startsWith("http") ? img : `${BASE_URL}${img}`;

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("id-ID");

    const discountPercent = 20;

    const discountPrice = product
        ? product.price - (product.price * discountPercent) / 100
        : 0;

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
            : 0;

    if (loading) {
        return (
            <div className="p-6 animate-pulse max-w-6xl mx-auto">
                <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 w-1/3"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-xl font-bold">Produk tidak ditemukan</h1>
                <button
                    onClick={() => navigate("/shop")}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-28">

            {/* PRODUCT */}
            <div className="max-w-6xl mx-auto px-4 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-indigo-600 text-sm mb-4"
                >
                    ← Kembali
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* IMAGE */}
                    <div className="bg-white p-4 rounded-xl shadow">
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                        />
                    </div>

                    {/* DETAIL */}
                    <div className="bg-white p-5 rounded-xl shadow flex flex-col gap-3">

                        <h1 className="text-xl md:text-2xl font-bold">
                            {product.name}
                        </h1>

                        <p className="text-yellow-500 text-sm">
                            ⭐ {avgRating.toFixed(1)}
                        </p>

                        <p className="line-through text-gray-400">
                            Rp {formatPrice(product.price)}
                        </p>

                        <p className="text-2xl font-bold text-indigo-600">
                            Rp {formatPrice(discountPrice)}
                        </p>

                        <p className="text-sm text-gray-500">
                            Stok: {product.stock}
                        </p>

                        {/* QTY */}
                        <div className="flex items-center gap-3 mt-2">
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

                        <p className="text-sm text-gray-600 mt-2">
                            {product.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* REVIEW */}
            <div className="max-w-6xl mx-auto px-4 mt-10">
                <div className="bg-white p-5 rounded-xl shadow">

                    <h2 className="font-bold mb-4">Ulasan Produk</h2>

                    <div className="space-y-3 mb-6">
                        {reviews.map((r) => (
                            <div key={r._id} className="border-b pb-2">
                                <p className="font-semibold">{r.userName}</p>
                                <p className="text-yellow-500">
                                    {"⭐".repeat(r.rating)}
                                </p>
                                <p className="text-sm">{r.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* FORM */}
                    <div className="space-y-2">
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="border p-2 w-full rounded"
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>
                                    {n} ⭐
                                </option>
                            ))}
                        </select>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border p-2 w-full rounded"
                            placeholder="Tulis review..."
                        />

                        <button
                            onClick={submitReview}
                            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
                        >
                            Kirim Review
                        </button>
                    </div>
                </div>
            </div>

            {/* STICKY BAR */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-3 flex items-center justify-between">

                <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-indigo-600">
                        Rp {formatPrice(discountPrice * qty)}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={addToCart}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg"
                    >
                        Keranjang
                    </button>

                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                        Beli
                    </button>
                </div>
            </div>
        </div>
    );
}