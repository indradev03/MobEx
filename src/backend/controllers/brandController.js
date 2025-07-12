// backend/controllers/brandController.js
import {
  getAllBrands,
  createBrand,
  brandExists,
  deleteBrandById,
  updateBrandById,
} from "../models/Brand.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await getAllBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteBrandById(id);
    if (!deleted) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
};

// backend/controllers/brandController.js
export const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const imageFile = req.files?.image?.[0];

    if (!name || !imageFile) {
      return res.status(400).json({ error: "Name and image are required" });
    }

    const exists = await brandExists(name);
    if (exists) {
      return res.status(409).json({ error: "Brand already exists" });
    }

    const imageUrl = `/uploads/${imageFile.filename}`;
    const newBrand = await createBrand(name, imageUrl);
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ error: "Failed to add brand" });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const imageFile = req.files?.image?.[0];

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : req.body.image;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }

    const updatedBrand = await updateBrandById(id, name, imageUrl);

    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    res.json(updatedBrand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update brand" });
  }
};

