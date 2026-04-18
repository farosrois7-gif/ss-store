import { useEffect, useState, useRef } from "react";
import { api } from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Penjualan() {
    const [sales, setSales] = useState([]);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const printRef = useRef();

    const fetchSales = async () => {
        const res = await api.get("/sales");
        setSales(res.data.data || []);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const updateStatus = async (id, status) => {
        await api.put(`/sales/${id}`, { status });
        fetchSales();
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus transaksi?")) return;
        await api.delete(`/sales/${id}`);
        fetchSales();
    };

    // 🔍 FILTER
    const filtered = sales.filter((item) => {
        const matchSearch = item.product?.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchMonth = month
            ? new Date(item.createdAt).getMonth() + 1 === Number(month)
            : true;

        return matchSearch && matchMonth;
    });

    // 📊 SUMMARY
    const totalSales = filtered.length;
    const totalRevenue = filtered.reduce(
        (acc, item) => acc + item.totalPrice,
        0
    );

    const getStatus = (status) => {
        if (status === "success") return "text-green-600";
        if (status === "cancel") return "text-red-500";
        return "text-gray-500";
    };

    // PDF
    const downloadPDF = async () => {
        const canvas = await html2canvas(printRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
        pdf.save("invoice.pdf");
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const win = window.open("", "", "width=800,height=600");
        win.document.write(printContent);
        win.document.close();
        win.print();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Penjualan</h1>

                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    />

                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">Semua Bulan</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i} value={i + 1}>
                                Bulan {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500">Total Transaksi</p>
                    <h2 className="text-lg font-bold">{totalSales}</h2>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <p className="text-xs text-gray-500">Total Pendapatan</p>
                    <h2 className="text-lg font-bold">
                        Rp {totalRevenue.toLocaleString("id-ID")}
                    </h2>
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-2">

                {filtered.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        Tidak ada data
                    </div>
                )}

                {filtered.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg p-3 flex justify-between items-center hover:shadow transition"
                    >
                        {/* LEFT */}
                        <div>
                            <p className="font-medium text-sm">
                                {item.product?.name}
                            </p>

                            <p className="text-[11px] text-gray-400">
                                {item.user?.name || "User"} • {item.quantity} pcs
                            </p>

                            <p className="text-[10px] text-gray-400">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-semibold">
                                Rp {item.totalPrice.toLocaleString("id-ID")}
                            </p>

                            <span className={`text-xs ${getStatus(item.status)}`}>
                                {item.status}
                            </span>

                            <div className="flex gap-2 text-xs">
                                <button
                                    onClick={() => setSelected(item)}
                                    className="text-blue-600"
                                >
                                    Detail
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(item._id, "success")
                                    }
                                    className="text-green-600"
                                >
                                    ✔
                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus(item._id, "cancel")
                                    }
                                    className="text-red-500"
                                >
                                    ✖
                                </button>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-gray-400"
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl p-5 w-full max-w-sm space-y-4">

                        <div ref={printRef}>
                            <h2 className="text-lg font-semibold mb-2">
                                Invoice
                            </h2>

                            <p className="text-sm">
                                Produk: {selected.product?.name}
                            </p>
                            <p className="text-sm">
                                User: {selected.user?.name || "-"}
                            </p>
                            <p className="text-sm">
                                Qty: {selected.quantity}
                            </p>
                            <p className="text-sm">
                                Rp {selected.totalPrice}
                            </p>
                            <p className="text-sm">{selected.status}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={downloadPDF}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded text-sm"
                            >
                                PDF
                            </button>

                            <button
                                onClick={handlePrint}
                                className="flex-1 bg-gray-800 text-white py-2 rounded text-sm"
                            >
                                Print
                            </button>
                        </div>

                        <button
                            onClick={() => setSelected(null)}
                            className="w-full bg-gray-200 py-2 rounded text-sm"
                        >
                            Tutup
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}