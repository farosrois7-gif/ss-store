import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import User from "../models/user.model.js";

// ================== GET ALL ==================
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({ data: sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== CREATE ==================
export const createSale = async (req, res) => {
    try {
        const { items, payment, address } = req.body;

        // 🔥 VALIDASI BASIC
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart kosong" });
        }

        if (!payment?.method) {
            return res.status(400).json({ message: "Metode pembayaran wajib" });
        }

        if (!address?.detail) {
            return res.status(400).json({ message: "Alamat wajib diisi" });
        }

        let totalPrice = 0;
        const processedItems = [];

        // =========================
        // 🔥 LOOP ITEMS
        // =========================
        for (let item of items) {

            // 🔥 DEBUG LOG
            console.log("➡️ ITEM PRODUCT ID:", item.product);

            // 🔥 VALIDASI OBJECT ID
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({
                    message: `ID tidak valid: ${item.product}`,
                });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Produk tidak ditemukan: ${item.product}`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stok ${product.name} tidak cukup`,
                });
            }

            const subtotal = product.price * item.quantity;
            totalPrice += subtotal;

            processedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal,
            });

            // 🔥 UPDATE STOCK
            product.stock -= item.quantity;
            await product.save();
        }

        const shippingCost = 0;
        const grandTotal = totalPrice + shippingCost;

        const orderId = "ORDER-" + Date.now();

        // =========================
        // 🔥 CREATE ORDER
        // =========================
        const sale = new Sale({
            orderId,
            user: req.user.id,
            items: processedItems,
            totalPrice,
            shippingCost,
            grandTotal,
            address,
            payment: {
                method: payment.method,
                status: "pending",
            },
            status: "pending",
        });

        await sale.save();

        // =========================
        // 🔥 PAYMENT GATEWAY (DUMMY)
        // =========================
        if (payment.method !== "cod") {
            sale.payment.paymentUrl =
                "https://payment-gateway.com/pay/" + orderId;

            sale.payment.expiryTime = new Date(
                Date.now() + 24 * 60 * 60 * 1000
            );

            await sale.save();
        }

        res.status(201).json({
            message: "Checkout berhasil",
            data: sale,
        });

    } catch (error) {
        console.error("❌ ERROR CREATE SALE:", error);
        res.status(500).json({ message: error.message });
    }
};

// ================== HISTORY USER ==================
export const getMySales = async (req, res) => {
    try {
        const sales = await Sale.find({ user: req.user.id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({ data: sales });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== UPDATE STATUS ==================
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ data: sale });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== DELETE ==================
export const deleteSale = async (req, res) => {
    try {
        await Sale.findByIdAndDelete(req.params.id);
        res.json({ message: "Berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================== DASHBOARD ==================
export const getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const salesToday = await Sale.find({
            createdAt: { $gte: today },
            status: { $in: ["paid", "processing", "shipped", "delivered"] },
        });

        const totalToday = salesToday.reduce(
            (acc, item) => acc + item.grandTotal,
            0
        );

        const allSales = await Sale.find({
            status: { $in: ["paid", "processing", "shipped", "delivered"] },
        });

        const totalRevenue = allSales.reduce(
            (acc, item) => acc + item.grandTotal,
            0
        );

        const latestSales = await Sale.find()
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