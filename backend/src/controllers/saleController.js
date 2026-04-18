import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import User from "../models/user.model.js"; // 🔥 TAMBAHAN

// ================== GET ALL ==================
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("product")
            .populate("user") // 🔥 biar bisa tampil nama user
            .sort({ createdAt: -1 });

        res.json({ data: sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== CREATE ==================
export const createSale = async (req, res) => {
    try {
        const { product, quantity, totalPrice, paymentMethod } = req.body;

        const foundProduct = await Product.findById(product);

        if (!foundProduct) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        if (foundProduct.stock < quantity) {
            return res.status(400).json({
                message: "Stok tidak cukup",
            });
        }

        // 🔥 kurangi stok
        foundProduct.stock -= quantity;
        await foundProduct.save();

        // 🔥 simpan transaksi
        const sale = new Sale({
            product,
            quantity,
            totalPrice,
            user: req.user.id,
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        });

        await sale.save();

        res.status(201).json({
            message: "Checkout berhasil",
            data: sale,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== HISTORY USER ==================
export const getMySales = async (req, res) => {
    try {
        const sales = await Sale.find({ user: req.user.id })
            .populate("product")
            .populate("user")
            .sort({ createdAt: -1 });

        res.json({ data: sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== UPDATE STATUS ==================
export const updateStatus = async (req, res) => {
    const { status } = req.body;

    const sale = await Sale.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    res.json({ data: sale });
};

// ================== DELETE ==================
export const deleteSale = async (req, res) => {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Berhasil dihapus" });
};

// ================== 🔥 DASHBOARD ==================
export const getDashboard = async (req, res) => {
    try {
        // total produk
        const totalProducts = await Product.countDocuments();

        // total user
        const totalUsers = await User.countDocuments();

        // 🔥 penjualan hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const salesToday = await Sale.find({
            createdAt: { $gte: today },
            status: "success",
        });

        const totalToday = salesToday.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        // 🔥 total revenue (ALL TIME)
        const allSales = await Sale.find({ status: "success" });
        const totalRevenue = allSales.reduce(
            (acc, item) => acc + item.totalPrice,
            0
        );

        // 🔥 transaksi terbaru
        const latestSales = await Sale.find()
            .populate("product")
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            data: {
                totalProducts,
                totalUsers,
                totalToday,
                totalRevenue,
                latestSales,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};