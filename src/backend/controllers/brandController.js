// backend/controllers/brandController.js
import { getAllBrands, createBrand, brandExists } from '../models/Brand.js';

export const getBrands = async (req, res) => {
  try {
    const brands = await getAllBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
};

export const addBrand = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: "Name and image are required" });
    }

    const exists = await brandExists(name);
    if (exists) {
      return res.status(409).json({ error: "Brand already exists" });
    }

    const newBrand = await createBrand(name, image);
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(500).json({ error: "Failed to add brand" });
  }
};
