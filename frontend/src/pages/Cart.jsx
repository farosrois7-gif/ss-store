import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // 🔥 ADDRESS OBJECT (WAJIB)
    const [address, setAddress] = useState({
        name: "",
        phone: "",
        detail: "",
        city: "",
        postalCode: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    // ================= UPDATE QTY =================
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

    // ================= REMOVE =================
    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    // ================= TOTAL =================
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    // ================= CHECKOUT =================
    const checkout = async () => {
        try {
            // 🔥 VALIDASI
            if (!address.name || !address.phone || !address.detail || !address.city) {
                alert("Lengkapi alamat terlebih dahulu!");
                return;
            }

            if (cart.length === 0) {
                alert("Keranjang kosong!");
                return;
            }

            // 🔥 mapping cart → backend format
            const items = cart.map((item) => ({
                product: item._id,
                quantity: item.qty,
            }));

            const res = await api.post("/sales", {
                items,
                payment: {
                    method: paymentMethod,
                },
                address,
            });

            const sale = res.data.data;

            // 🔥 kalau pakai gateway → redirect
            if (sale?.payment?.paymentUrl) {
                window.location.href = sale.payment.paymentUrl;
                return;
            }

            // 🔥 COD SUCCESS
            localStorage.removeItem("cart");
            setCart([]);

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
                        <div key={i} className="bg-white rounded-2xl shadow p-4 flex gap-4 items-center">
                            <img
                                src={`http://localhost:5000${item.image}`}
                                className="w-20 h-20 object-cover rounded-xl"
                                alt={item.name}
                            />

                            <div className="flex-1">
                                <h2 className="font-semibold">{item.name}</h2>
                                <p className="text-indigo-600 font-bold">Rp {item.price}</p>

                                <div className="flex items-center mt-2 gap-2">
                                    <button onClick={() => updateQty(i, item.qty - 1)} className="w-8 h-8 bg-gray-200 rounded-lg">-</button>
                                    <span className="px-3 font-semibold">{item.qty}</span>
                                    <button onClick={() => updateQty(i, item.qty + 1)} className="w-8 h-8 bg-gray-200 rounded-lg">+</button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">Rp {item.price * item.qty}</p>
                                <button onClick={() => removeItem(i)} className="text-red-500 text-sm mt-2 hover:underline">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                {cart.length > 0 && (
                    <div className="bg-white rounded-2xl shadow p-6 h-fit">

                        <h2 className="text-lg font-bold mb-4">Ringkasan</h2>

                        <div className="flex justify-between mb-2">
                            <span>Total</span>
                            <span className="font-bold">Rp {total}</span>
                        </div>

                        {/* 🔥 ADDRESS FORM */}
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Alamat Pengiriman</p>

                            <input placeholder="Nama"
                                   className="border p-2 rounded-lg w-full mb-2"
                                   onChange={(e) => setAddress({ ...address, name: e.target.value })}
                            />

                            <input placeholder="No HP"
                                   className="border p-2 rounded-lg w-full mb-2"
                                   onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                            />

                            <textarea placeholder="Alamat lengkap"
                                      className="border p-2 rounded-lg w-full mb-2"
                                      onChange={(e) => setAddress({ ...address, detail: e.target.value })}
                            />

                            <input placeholder="Kota"
                                   className="border p-2 rounded-lg w-full mb-2"
                                   onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            />

                            <input placeholder="Kode Pos"
                                   className="border p-2 rounded-lg w-full"
                                   onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                            />
                        </div>

                        {/* PAYMENT */}
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Metode Pembayaran</p>

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