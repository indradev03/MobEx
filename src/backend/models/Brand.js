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
