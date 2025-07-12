// backend/models/Brand.js
import pool from '../database/db.js';

export const getAllBrands = async () => {
  const result = await pool.query("SELECT * FROM brands ORDER BY brand_id ASC");
  return result.rows;
};

export const createBrand = async (name, image) => {
  const result = await pool.query(
    "INSERT INTO brands (name, image) VALUES ($1, $2) RETURNING *",
    [name, image]
  );
  return result.rows[0];
};

export const brandExists = async (name) => {
  const result = await pool.query("SELECT 1 FROM brands WHERE LOWER(name) = LOWER($1)", [name]);
  return result.rowCount > 0;
};

export const deleteBrandById = async (id) => {
  const result = await pool.query("DELETE FROM brands WHERE brand_id = $1", [id]);
  return result.rowCount > 0;
};

export const updateBrandById = async (id, name, image) => {
  const result = await pool.query(
    "UPDATE brands SET name = $1, image = $2 WHERE brand_id = $3 RETURNING *",
    [name, image, id]
  );
  return result.rows[0];
};