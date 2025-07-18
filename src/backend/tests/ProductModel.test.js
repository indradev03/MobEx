import { jest } from '@jest/globals';

// Mock the pool import before importing ProductModel
jest.unstable_mockModule('../database/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

const pool = (await import('../database/db.js')).default;
const ProductModel = await import('../models/ProductModel.js');

describe('ProductModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch all products without brand filter', async () => {
      const mockRows = [{ product_id: 1, name: 'Product A' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await ProductModel.getAllProducts();

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('FROM products p'), []);
      expect(result).toEqual(mockRows);
    });

    it('should fetch products filtered by brandId', async () => {
      const brandId = 5;
      const mockRows = [{ product_id: 2, brand_id: brandId, name: 'Product B' }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await ProductModel.getAllProducts(brandId);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE p.brand_id = $1'), [brandId]);
      expect(result).toEqual(mockRows);
    });
  });

  describe('getProductById', () => {
    it('should fetch a product by id', async () => {
      const mockProduct = { product_id: 1, name: 'Product A' };
      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const result = await ProductModel.getProductById(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE p.product_id = $1'), [1]);
      expect(result).toEqual(mockProduct);
    });

    it('should return undefined if product not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ProductModel.getProductById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('createProduct', () => {
    it('should insert a new product and return it', async () => {
      const productData = {
        name: 'New Product',
        brand_id: 1,
        image_url: '/uploads/img.jpg',
        details: 'Details here',
        old_price: 100,
        new_price: 80,
        discount: '20%',
        status: 'available',
        condition: 'new',
        storage: '128GB',
        battery_health: '95%',
        thumbnail_urls: ['/uploads/thumb1.jpg', '/uploads/thumb2.jpg'],
        features: ['feature1', 'feature2'],
        specs: { cpu: 'A14', ram: '6GB' },
      };
      pool.query.mockResolvedValue({ rows: [productData] });

      const result = await ProductModel.createProduct(productData);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO products'), expect.any(Array));
      expect(result).toEqual(productData);
    });

    it('should handle empty arrays and objects properly', async () => {
      const productData = {
        name: 'Prod',
        brand_id: 1,
        image_url: '/img.jpg',
        details: null,
        old_price: null,
        new_price: 50,
        discount: null,
        status: 'sold',
        condition: 'used',
        storage: null,
        battery_health: null,
        thumbnail_urls: [],
        features: [],
        specs: {},
      };
      pool.query.mockResolvedValue({ rows: [productData] });

      const result = await ProductModel.createProduct(productData);

      expect(result).toEqual(productData);
      // Check that nulls passed correctly instead of empty arrays/objects
      const calledArgs = pool.query.mock.calls[0][1];
      expect(calledArgs[11]).toBeNull(); // thumbnail_urls
      expect(calledArgs[12]).toBeNull(); // features
      expect(calledArgs[13]).toBeNull(); // specs
    });
  });

  describe('updateProduct', () => {
    const existingProduct = {
      product_id: 1,
      name: 'Old Prod',
      brand_id: 1,
      image_url: '/uploads/old.jpg',
      thumbnail_urls: ['/uploads/old1.jpg'],
      features: ['old feature'],
      specs: { cpu: 'oldcpu' },
    };

    it('should return null if product not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // for select existing product

      const result = await ProductModel.updateProduct(999, { name: 'X' });
      expect(result).toBeNull();
    });

    it('should update product with fallback values', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [existingProduct] }) // fetch existing
        .mockResolvedValueOnce({ rows: [{ ...existingProduct, name: 'Updated Prod' }] }); // update

      const updateData = {
        name: 'Updated Prod',
        brand_id: 2,
        image_url: null, // should fallback to existing
        thumbnail_urls: [],
        features: [],
        specs: {},
        new_price: 120,
        status: 'available',
        condition: 'new',
      };

      const result = await ProductModel.updateProduct(existingProduct.product_id, updateData);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('SELECT * FROM products WHERE product_id = $1'),
        [existingProduct.product_id]
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('UPDATE products SET'),
        expect.arrayContaining([
          'Updated Prod',
          2,
          existingProduct.image_url, // fallback value
          expect.anything(),
          expect.anything(),
          120,
          expect.anything(),
          'available',
          'new',
          expect.anything(),
          expect.anything(),
          existingProduct.thumbnail_urls,
          existingProduct.features,
          existingProduct.specs,
          existingProduct.product_id,
        ])
      );

      expect(result.name).toBe('Updated Prod');
    });

    it('should handle empty arrays and nulls correctly in update', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [existingProduct] })
        .mockResolvedValueOnce({ rows: [{ ...existingProduct, name: 'Updated Prod' }] });

      const updateData = {
        name: 'Updated Prod',
        brand_id: 2,
        image_url: '',
        thumbnail_urls: null,
        features: null,
        specs: null,
        new_price: 120,
        status: 'available',
        condition: 'new',
      };

      await ProductModel.updateProduct(existingProduct.product_id, updateData);

      const calledArgs = pool.query.mock.calls[1][1];
      expect(calledArgs[2]).toBe(existingProduct.image_url); // fallback to existing
      expect(calledArgs[11]).toEqual(existingProduct.thumbnail_urls); // fallback to existing array
      expect(calledArgs[12]).toBeNull(); // features fallback to null
      expect(calledArgs[13]).toBeNull(); // specs fallback to null
    });

    it('should throw if DB update fails', async () => {
      pool.query.mockResolvedValueOnce({ rows: [existingProduct] });
      pool.query.mockRejectedValueOnce(new Error('DB error'));

      await expect(ProductModel.updateProduct(existingProduct.product_id, { name: 'X' })).rejects.toThrow('DB error');
    });
  });

  describe('deleteProduct', () => {
    it('should call pool.query with delete SQL and id', async () => {
      pool.query.mockResolvedValue({});

      await ProductModel.deleteProduct(10);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM products WHERE product_id = $1",
        [10]
      );
    });

    it('should throw if delete fails', async () => {
      pool.query.mockRejectedValue(new Error('Delete error'));

      await expect(ProductModel.deleteProduct(10)).rejects.toThrow('Delete error');
    });
  });
});
