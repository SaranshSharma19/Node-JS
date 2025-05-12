const ProductImage = require('../models/ProductImage');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const uploadProductImage = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });
    if (!productId) return res.status(400).json({ error: 'productId is required' });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const { path: url, filename: public_id } = req.file;

    const image = await ProductImage.create({
      productId,
      url,
      public_id,
    });

    res.status(201).json({ message: 'Image uploaded', image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getImagesByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const images = await ProductImage.findAll({ where: { productId } });

    res.json({ productId, images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const id = req.params.id;

    const image = await ProductImage.findByPk(id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });

    const image = await ProductImage.findByPk(id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await cloudinary.uploader.destroy(image.public_id);

    const { path: url, filename: public_id } = req.file;

    image.url = url;
    image.public_id = public_id;
    await image.save();

    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ProductImage.findByPk(id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await cloudinary.uploader.destroy(image.public_id);

    await image.destroy();

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadProductImage,
  getImagesByProductId,
  getImageById,
  updateProductImage,
  deleteProductImage,
};
