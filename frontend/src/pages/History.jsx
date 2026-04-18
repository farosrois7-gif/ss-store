import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function History() {
    const [sales, setSales] = useState([]);
    const [notif, setNotif] = useState(false);

    const fetchHistory = async () => {
        try {
            const res = await api.get("/sales/me");
            setSales(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHistory();

        // 🔥 NOTIF CHECKOUT
        const checkoutNotif = localStorage.getItem("checkoutSuccess");
        if (checkoutNotif) {
            setNotif(true);
            localStorage.removeItem("checkoutSuccess");
        }
    }, []);

    // 🔥 STATUS STYLE
    const getStatusStyle = (status) => {
        if (status === "success")
            return "bg-green-100 text-green-600";
        if (status === "cancel")
            return "bg-red-100 text-red-500";
        return "bg-yellow-100 text-yellow-600";
    };

    // 🔥 PAYMENT STYLE
    const getPaymentStyle = (status) => {
        return status === "paid"
            ? "text-green-600"
            : "text-yellow-500";
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Riwayat Transaksi 📦
                </h1>

                {notif && (
                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                        1 baru
                    </span>
                )}
            </div>

            <div className="max-w-5xl mx-auto space-y-4">

                {/* EMPTY */}
                {sales.length === 0 && (
                    <div className="bg-white p-10 rounded-2xl shadow text-center text-gray-500">
                        Belum ada transaksi 😢
                    </div>
                )}

                {/* LIST */}
                {sales.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-2xl shadow p-4 flex items-center justify-between hover:shadow-lg transition"
                    >
                        {/* LEFT */}
                        <div className="flex items-center gap-4">

                            <img
                                src={`http://localhost:5000${item.product?.image}`}
                                className="w-20 h-20 object-cover rounded-xl"
                                alt=""
                            />

                            <div>
                                <h2 className="font-semibold">
                                    {item.product?.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>

                                {/* 🔥 PAYMENT INFO */}
                                <p className="text-xs text-gray-400">
                                    Metode: {item.paymentMethod || "-"}
                                </p>

                                <p className={`text-xs font-semibold ${getPaymentStyle(item.paymentStatus)}`}>
                                    {item.paymentStatus || "pending"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-right space-y-2">

                            <p className="font-bold text-lg">
                                Rp {item.totalPrice}
                            </p>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}
                            >
                                {item.status}
                            </span>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}