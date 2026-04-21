import Product from "../models/Product.js";

// GET
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product tidak ditemukan",
            });
        }

        res.json({
            data: product,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// CREATE
export const createProduct = async (req, res) => {
    try {
        const { name, price, stock, description } = req.body;

        const image = req.file ? `/uploads/${req.file.filename}` : "";

        const product = new Product({
            name,
            price,
            stock,
            description,
            image,
        });

        await product.save();

        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            data: product,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// UPDATE
export const updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            message: "Produk berhasil diupdate",
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};