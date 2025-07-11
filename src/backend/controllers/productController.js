// controllers/productController.js
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../models/ProductModel.js";

export const fetchProducts = async (req, res) => {
  try {
    const brandId = req.query.brandId ? parseInt(req.query.brandId) : null;
    const products = await getAllProducts(brandId);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const fetchProductById = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand_id,
      details,
      old_price,
      new_price,
      discount,
      status,
      condition,
      storage,
      battery_health,
      features,
      specs,
    } = req.body;

    const imageFile = req.files?.image ? req.files.image[0] : null;
    const thumbnailFiles = req.files?.thumbnails || [];

    if (!name || !brand_id || !new_price || !status || !condition || !imageFile) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const image_url = `/uploads/${imageFile.filename}`;
    const thumbnail_urls = thumbnailFiles.map(file => `/uploads/${file.filename}`);

    let featuresArr = [];
    if (features) {
      try {
        featuresArr = JSON.parse(features);
      } catch {
        featuresArr = [];
      }
    }

    let specsObj = {};
    if (specs) {
      try {
        specsObj = JSON.parse(specs);
      } catch {
        specsObj = {};
      }
    }

    const product = {
      name,
      brand_id: parseInt(brand_id),
      image_url,
      details,
      old_price: old_price ? parseFloat(old_price) : null,
      new_price: parseFloat(new_price),
      discount,
      status,
      condition,
      storage,
      battery_health,
      thumbnail_urls,
      features: featuresArr,
      specs: specsObj,
    };

    const newProduct = await createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      brand_id,
      details,
      old_price,
      new_price,
      discount,
      status,
      condition,
      storage,
      battery_health,
      features,
      specs,
    } = req.body;

    const imageFile = req.files?.image ? req.files.image[0] : null;
    const thumbnailFiles = req.files?.thumbnails || [];

    // Fetch existing product only if no new image and no image_url in body
    let existingProduct = null;
    if (!imageFile && !req.body.image_url) {
      existingProduct = await getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
    }

    // Determine image_url with fallback
    let image_url = null;
    if (imageFile) {
      image_url = `/uploads/${imageFile.filename}`;
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    } else if (existingProduct?.image_url && existingProduct.image_url.trim() !== "") {
      image_url = existingProduct.image_url;
    } else {
      image_url = null; // no old image present, keep null
    }

    // Determine thumbnail_urls with fallback
    let thumbnail_urls = [];
    if (thumbnailFiles.length > 0) {
      thumbnail_urls = thumbnailFiles.map(file => `/uploads/${file.filename}`);
    } else if (req.body.thumbnail_urls) {
      try {
        thumbnail_urls = JSON.parse(req.body.thumbnail_urls);
      } catch {
        thumbnail_urls = [];
      }
    } else if (
      existingProduct?.thumbnail_urls &&
      Array.isArray(existingProduct.thumbnail_urls) &&
      existingProduct.thumbnail_urls.length > 0
    ) {
      thumbnail_urls = existingProduct.thumbnail_urls;
    } else {
      thumbnail_urls = [];
    }

    // Parse features JSON with fallback
    let featuresArr = [];
    if (features) {
      try {
        featuresArr = JSON.parse(features);
      } catch {
        featuresArr = [];
      }
    } else if (existingProduct?.features && Array.isArray(existingProduct.features)) {
      featuresArr = existingProduct.features;
    }

    // Parse specs JSON with fallback
    let specsObj = {};
    if (specs) {
      try {
        specsObj = JSON.parse(specs);
      } catch {
        specsObj = {};
      }
    } else if (existingProduct?.specs && typeof existingProduct.specs === 'object') {
      specsObj = existingProduct.specs;
    }

    const product = {
      name,
      brand_id: brand_id ? parseInt(brand_id) : null,
      image_url,
      details,
      old_price: old_price ? parseFloat(old_price) : null,
      new_price: new_price ? parseFloat(new_price) : null,
      discount,
      status,
      condition,
      storage,
      battery_health,
      thumbnail_urls,
      features: featuresArr,
      specs: specsObj,
    };

    const updatedProduct = await updateProduct(id, product);
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};


export const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const fetchProductsByBrand = async (req, res) => {
  const brandId = req.params.brandId;
  const limit = parseInt(req.query.limit) || 1000;

  try {
    const products = await getAllProducts(brandId); // or use a separate model method if you want limit support
    res.json(products.slice(0, limit)); // if limiting in controller for now
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
