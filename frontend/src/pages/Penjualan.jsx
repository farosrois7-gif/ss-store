import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Penjualan() {
    /* ================= STATE ================= */
    const [sales, setSales] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [tab, setTab] = useState("sales");

    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");

    const printRef = useRef();

    /* ================= FETCH ================= */
    const fetchSales = async () => {
        const res = await api.get("/sales");
        setSales(res.data.data || []);
    };

    const fetchReviews = async () => {
        const res = await api.get("/reviews");
        setReviews(res.data.data || []);
    };

    useEffect(() => {
        fetchSales();
        fetchReviews();
    }, []);

    /* ================= SALES ACTION ================= */
    const updateStatus = async (id, status) => {
        await api.put(`/sales/${id}`, { status });
        fetchSales();
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus transaksi?")) return;
        await api.delete(`/sales/${id}`);
        fetchSales();
    };

    /* ================= REVIEW ACTION ================= */
    const approveReview = async (id) => {
        await api.patch(`/reviews/${id}/approve`);
        fetchReviews();
    };

    const hideReview = async (id) => {
        await api.patch(`/reviews/${id}/hide`);
        fetchReviews();
    };

    const deleteReview = async (id) => {
        await api.delete(`/reviews/${id}`);
        fetchReviews();
    };

    /* ================= FILTER SALES ================= */
    const filteredSales = sales.filter((item) => {
        const matchSearch = item.product?.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchMonth = month
            ? new Date(item.createdAt).getMonth() + 1 === Number(month)
            : true;

        return matchSearch && matchMonth;
    });

    /* ================= PDF ================= */
    const downloadPDF = async () => {
        const canvas = await html2canvas(printRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
        pdf.save("invoice.pdf");
    };

    const handlePrint = () => {
        const win = window.open("", "", "width=800,height=600");
        win.document.write(printRef.current.innerHTML);
        win.document.close();
        win.print();
    };

    const getStatus = (status) => {
        if (status === "success") return "text-green-600";
        if (status === "cancel") return "text-red-500";
        return "text-gray-500";
    };

    /* ================= UI ================= */
    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Admin Panel</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setTab("sales")}
                        className={`px-3 py-1 rounded ${tab === "sales" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                    >
                        Penjualan
                    </button>

                    <button
                        onClick={() => setTab("reviews")}
                        className={`px-3 py-1 rounded ${tab === "reviews" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                    >
                        Review
                    </button>
                </div>
            </div>

            {/* ================= SALES ================= */}
            {tab === "sales" && (
                <>
                    {/* FILTER */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <input
                            placeholder="Cari produk"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">Semua bulan</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    Bulan {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* LIST SALES */}
                    <div className="space-y-2">
                        {filteredSales.map((item) => (
                            <div key={item._id} className="bg-white p-3 rounded flex justify-between">

                                <div>
                                    <p className="font-medium">{item.product?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {item.user?.name}
                                    </p>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <span className={getStatus(item.status)}>
                                        {item.status}
                                    </span>

                                    <button onClick={() => updateStatus(item._id, "success")}>✔</button>
                                    <button onClick={() => updateStatus(item._id, "cancel")}>✖</button>
                                    <button onClick={() => handleDelete(item._id)}>🗑</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ================= REVIEWS ================= */}
            {tab === "reviews" && (
                <div className="space-y-3">
                    {reviews.map((r) => (
                        <div key={r._id} className="bg-white p-3 rounded flex justify-between">

                            <div>
                                <p className="font-semibold">{r.userId?.name}</p>
                                <p>{r.comment}</p>
                                <p className="text-yellow-500">
                                    {"⭐".repeat(r.rating)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {r.status}
                                </p>
                            </div>

                            <div className="flex gap-2 items-center">
                                <button onClick={() => approveReview(r._id)} className="text-green-600">
                                    ✔
                                </button>

                                <button onClick={() => hideReview(r._id)} className="text-yellow-500">
                                    👁
                                </button>

                                <button onClick={() => deleteReview(r._id)} className="text-red-500">
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL (tetap punya kamu, tidak dihapus) */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-4 rounded">
                        <div ref={printRef}>
                            <p>{selected.product?.name}</p>
                            <p>{selected.totalPrice}</p>
                        </div>

                        <button onClick={downloadPDF}>PDF</button>
                        <button onClick={handlePrint}>Print</button>
                        <button onClick={() => setSelected(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}