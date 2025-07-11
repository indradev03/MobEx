import pool from "../database/db.js";

export const getAllProducts = async (brandId = null) => {
  let query = `
    SELECT p.*, b.name AS brand
    FROM products p
    JOIN brands b ON p.brand_id = b.brand_id
  `;
  const params = [];

  if (brandId) {
    query += ` WHERE p.brand_id = $1`;
    params.push(parseInt(brandId));
  }

  query += ` ORDER BY p.created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const getProductById = async (id) => {
  const query = `
    SELECT p.*, b.name AS brand
    FROM products p
    JOIN brands b ON p.brand_id = b.brand_id
    WHERE p.product_id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const createProduct = async (product) => {
  const {
    name,
    brand_id,
    image_url,
    details,
    old_price,
    new_price,
    discount,
    status,
    condition,
    storage,
    battery_health,
    thumbnail_urls,
    features,
    specs,
  } = product;

  const query = `
    INSERT INTO products
      (name, brand_id, image_url, details, old_price, new_price, discount, status, condition,
        storage, battery_health, thumbnail_urls, features, specs)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING *;
  `;

  const values = [
    name,
    brand_id,
    image_url,
    details || null,
    old_price || null,
    new_price,
    discount || null,
    status,
    condition,
    storage || null,
    battery_health || null,
    thumbnail_urls.length > 0 ? thumbnail_urls : null,
    features.length > 0 ? features : null,
    Object.keys(specs).length > 0 ? specs : null,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateProduct = async (id, product) => {
  // 1. Destructure product fields from incoming data
  let {
    name,
    brand_id,
    image_url,
    details,
    old_price,
    new_price,
    discount,
    status,
    condition,
    storage,
    battery_health,
    thumbnail_urls,
    features,
    specs,
  } = product;

  // 2. Add your fallback code here (fetch existing product and fallback logic)
  const existingProductRes = await pool.query(
    `SELECT * FROM products WHERE product_id = $1`,
    [id]
  );
  const existingProduct = existingProductRes.rows[0];

  if (!existingProduct) {
    return null; // Product not found
  }

  if (!image_url) {
    if (existingProduct.image_url && existingProduct.image_url.trim() !== "") {
      image_url = existingProduct.image_url;
    } else {
      image_url = null;
    }
  }

  if (!thumbnail_urls || (Array.isArray(thumbnail_urls) && thumbnail_urls.length === 0)) {
    if (
      existingProduct.thumbnail_urls &&
      Array.isArray(existingProduct.thumbnail_urls) &&
      existingProduct.thumbnail_urls.length > 0
    ) {
      thumbnail_urls = existingProduct.thumbnail_urls;
    } else {
      thumbnail_urls = null;
    }
  }

  if (!features || (Array.isArray(features) && features.length === 0)) {
    features = existingProduct.features || null;
  }

  if (!specs || (Object.keys(specs).length === 0)) {
    specs = existingProduct.specs || null;
  }

  // 3. Build your update query and values as usual, using the possibly updated variables

  const query = `
    UPDATE products SET
      name = $1,
      brand_id = $2,
      image_url = $3,
      details = $4,
      old_price = $5,
      new_price = $6,
      discount = $7,
      status = $8,
      condition = $9,
      storage = $10,
      battery_health = $11,
      thumbnail_urls = $12,
      features = $13,
      specs = $14,
      updated_at = NOW()
    WHERE product_id = $15
    RETURNING *;
  `;

  const values = [
    name,
    brand_id,
    image_url,
    details || null,
    old_price || null,
    new_price,
    discount || null,
    status,
    condition,
    storage || null,
    battery_health || null,
    thumbnail_urls && thumbnail_urls.length > 0 ? thumbnail_urls : null,
    features && features.length > 0 ? features : null,
    specs && Object.keys(specs).length > 0 ? specs : null,
    id,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};



export const deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE product_id = $1", [id]);
};
