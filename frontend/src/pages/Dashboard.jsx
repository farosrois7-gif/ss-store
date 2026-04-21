import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Dashboard() {
    const [data, setData] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalToday: 0,
        totalRevenue: 0,
        latestSales: [],
    });

    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/sales/dashboard");
            setData(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="p-4 md:p-6 space-y-6 animate-fadeIn">

            {/* HEADER */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>
                <p className="text-gray-500 text-xs md:text-sm">
                    Ringkasan aktivitas toko kamu
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

                {[
                    {
                        title: "Produk",
                        value: data.totalProducts,
                        color: "from-indigo-500 to-purple-500"
                    },
                    {
                        title: "User",
                        value: data.totalUsers,
                        color: "from-blue-500 to-cyan-500"
                    },
                    {
                        title: "Hari Ini",
                        value: `Rp ${data.totalToday.toLocaleString()}`,
                        color: "from-green-500 to-emerald-500"
                    },
                    {
                        title: "Revenue",
                        value: `Rp ${data.totalRevenue.toLocaleString()}`,
                        color: "from-pink-500 to-rose-500"
                    }
                ].map((item, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl p-[1px] bg-gradient-to-r ${item.color} hover:scale-[1.03] active:scale-[0.97] transition duration-200`}
                    >
                        <div className="bg-white rounded-2xl p-4 md:p-5 shadow">

                            <p className="text-gray-500 text-xs md:text-sm">
                                {item.title}
                            </p>

                            {loading ? (
                                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded mt-2" />
                            ) : (
                                <h2 className="text-lg md:text-2xl font-bold mt-1 break-words">
                                    {item.value}
                                </h2>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* TRANSAKSI */}
            <div className="bg-white rounded-2xl shadow p-4 md:p-6">

                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                    <h2 className="text-base md:text-lg font-semibold">
                        Transaksi Terbaru
                    </h2>

                    <span className="text-xs text-gray-400">
                        realtime data
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">

                        {data.latestSales.length === 0 && (
                            <p className="text-gray-400 text-center py-6 text-sm">
                                Belum ada transaksi
                            </p>
                        )}

                        {data.latestSales.map((item, i) => (
                            <div
                                key={item._id}
                                className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-3 gap-2 animate-fadeIn"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* LEFT */}
                                <div>
                                    <p className="font-medium text-sm md:text-base">
                                        {item.product?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        👤 {item.user?.name}
                                    </p>
                                </div>

                                {/* RIGHT */}
                                <div className="flex justify-between md:block md:text-right items-center">

                                    <p className="font-semibold text-sm md:text-base">
                                        Rp {item.totalPrice}
                                    </p>

                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        item.status === "success"
                                            ? "bg-green-100 text-green-600"
                                            : item.status === "cancel"
                                                ? "bg-red-100 text-red-500"
                                                : "bg-gray-100 text-gray-500"
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>

        </div>
    );
}