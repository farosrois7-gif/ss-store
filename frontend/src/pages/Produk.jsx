import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Produk() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        description: "",
        image: null,
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            setProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const openAdd = () => {
        setEditId(null);
        setForm({
            name: "",
            price: "",
            stock: "",
            description: "",
            image: null,
        });
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditId(item._id);
        setForm({
            name: item.name,
            price: item.price,
            stock: item.stock,
            description: item.description,
            image: null,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (form[key]) formData.append(key, form[key]);
        });

        if (editId) {
            await api.put(`/products/${editId}`, formData);
        } else {
            await api.post("/products", formData);
        }

        setShowModal(false);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin hapus produk?")) return;
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const getImageUrl = (image) => {
        if (!image) return "";
        return image.startsWith("http")
            ? image
            : `http://localhost:5000${image}`;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                        Produk
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm">
                        Kelola produk dengan mudah
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                    + Tambah
                </button>
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border animate-pulse h-40" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                    Belum ada produk
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {products.map((item) => {
                        const id = item._id;

                        return (
                            <div
                                key={id}
                                className="bg-white rounded-lg border hover:shadow-md hover:-translate-y-1 transition overflow-hidden"
                            >
                                {/* IMAGE */}
                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={getImageUrl(item.image)}
                                        className="w-full h-full object-cover hover:scale-105 transition"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="p-2 space-y-1">
                                    <h2 className="text-xs font-semibold line-clamp-1">
                                        {item.name}
                                    </h2>

                                    <p className="text-indigo-600 font-bold text-sm">
                                        Rp {Number(item.price).toLocaleString("id-ID")}
                                    </p>

                                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                                            {item.stock} pcs
                                        </span>
                                    </div>

                                    {/* ACTION */}
                                    <div className="flex justify-between pt-1 text-[10px]">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="text-blue-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(id)}
                                            className="text-red-600"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 space-y-4">

                        <h2 className="text-lg font-semibold">
                            {editId ? "Edit Produk" : "Tambah Produk"}
                        </h2>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nama produk"
                            className="w-full border p-2 rounded-lg text-sm"
                        />

                        <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Harga"
                            className="w-full border p-2 rounded-lg text-sm"
                        />

                        <input
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="Stok"
                            className="w-full border p-2 rounded-lg text-sm"
                        />

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Deskripsi"
                            className="w-full border p-2 rounded-lg text-sm"
                        />

                        <input
                            type="file"
                            onChange={handleFile}
                            className="text-sm"
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}