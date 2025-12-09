const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const { title, price, stock, images, description, category, featured, origin, artisanStory, materialsCare, shippingReturns, sgst, cgst } = req.body;
    console.log('createProduct req.body:', JSON.stringify(req.body));
  const p = await Product.create({ 
    title,
    price,
    stock,
    images,
    description,
    origin,
    artisanStory,
    materialsCare,
    shippingReturns,
    sgst: Number(sgst) || 0,
    cgst: Number(cgst) || 0,
    category,
    featured: featured || false
  });
  res.status(201).json(p);
};

exports.updateProduct = async (req, res) => {
  const { title, price, stock, images, description, category, featured, origin, artisanStory, materialsCare, shippingReturns, sgst, cgst } = req.body;
    console.log('updateProduct req.body:', JSON.stringify(req.body));
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    {
      title,
      price,
      stock,
      images,
      description,
      category,
      featured,
      origin,
      artisanStory,
      materialsCare,
      shippingReturns,
      sgst: Number(sgst) || 0,
      cgst: Number(cgst) || 0,
    },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Product deleted successfully' });
};
