import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    // UPDATE QTY
    const updateQty = (index, newQty) => {
        if (newQty < 1) return;

        const newCart = [...cart];

        if (newQty > newCart[index].stock) {
            alert("Stok tidak cukup!");
            return;
        }

        newCart[index].qty = newQty;
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // HAPUS ITEM
    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // TOTAL
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    // CHECKOUT
    const checkout = async () => {
        try {
            for (let item of cart) {
                await api.post("/sales", {
                    product: item._id,
                    quantity: item.qty,
                    totalPrice: item.price * item.qty,
                    paymentMethod,
                });
            }

            localStorage.removeItem("cart");
            setCart([]);

            localStorage.setItem("checkoutSuccess", "1");

            alert("Checkout berhasil 🎉");
            navigate("/shop");

        } catch (err) {
            alert(err.response?.data?.message || "Checkout gagal");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto mb-6">
                <h1 className="text-3xl font-bold">Keranjang 🛒</h1>
                <p className="text-gray-500 text-sm">
                    Review pesanan kamu sebelum checkout
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

                {/* LIST */}
                <div className="md:col-span-2 space-y-4">

                    {cart.length === 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
                            Keranjang kosong 😢
                        </div>
                    )}

                    {cart.map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center"
                        >
                            <img
                                src={`http://localhost:5000${item.image}`}
                                className="w-20 h-20 object-cover rounded-xl"
                                alt={item.name}
                            />

                            <div className="flex-1">
                                <h2 className="font-semibold">
                                    {item.name}
                                </h2>
                                <p className="text-indigo-600 font-bold">
                                    Rp {item.price}
                                </p>

                                <div className="flex items-center mt-2 gap-2">
                                    <button
                                        onClick={() => updateQty(i, item.qty - 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-lg"
                                    >
                                        -
                                    </button>

                                    <span className="px-3 font-semibold">
                                        {item.qty}
                                    </span>

                                    <button
                                        onClick={() => updateQty(i, item.qty + 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-lg"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">
                                    Rp {item.price * item.qty}
                                </p>

                                <button
                                    onClick={() => removeItem(i)}
                                    className="text-red-500 text-sm mt-2 hover:underline"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                {cart.length > 0 && (
                    <div className="bg-white rounded-2xl shadow p-6 h-fit">

                        <h2 className="text-lg font-bold mb-4">
                            Ringkasan
                        </h2>

                        <div className="flex justify-between mb-2">
                            <span>Total</span>
                            <span className="font-bold">
                                Rp {total}
                            </span>
                        </div>

                        {/* PAYMENT */}
                        <div className="mt-4">
                            <p className="font-semibold mb-2">
                                Metode Pembayaran
                            </p>

                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="border p-2 rounded-lg w-full"
                            >
                                <option value="cod">COD</option>
                                <option value="transfer">Transfer Bank</option>
                                <option value="ewallet">E-Wallet</option>
                                <option value="qris">QRIS</option>
                            </select>
                        </div>

                        {/* 🔥 DETAIL PAYMENT */}
                        {paymentMethod === "transfer" && (
                            <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg">
                                Transfer ke:
                                <br />
                                <b>BCA - 123456789</b>
                                <br />
                                a.n SS Store
                            </div>
                        )}

                        {paymentMethod === "ewallet" && (
                            <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg">
                                Kirim ke:
                                <br />
                                <b>DANA / OVO / GOPAY</b>
                                <br />
                                08123456789
                            </div>
                        )}

                        {paymentMethod === "qris" && (
                            <div className="mt-4 text-center bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm mb-2 font-semibold">
                                    Scan QRIS
                                </p>

                                <img
                                    src="/qris.png"
                                    alt="QRIS"
                                    className="w-40 mx-auto"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    (Simulasi QRIS)
                                </p>
                            </div>
                        )}

                        <button
                            onClick={checkout}
                            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Checkout
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}