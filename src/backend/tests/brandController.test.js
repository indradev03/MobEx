// src/backend/tests/brandController.test.js
import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';

// Mock model functions
jest.unstable_mockModule('../models/Brand.js', () => ({
  getAllBrands: jest.fn(),
  createBrand: jest.fn(),
  brandExists: jest.fn(),
  deleteBrandById: jest.fn(),
  updateBrandById: jest.fn(),
}));

const {
  getAllBrands,
  createBrand,
  brandExists,
  deleteBrandById,
  updateBrandById,
} = await import('../models/Brand.js');

const {
  getBrands,
  addBrand,
  deleteBrand,
  updateBrand,
} = await import('../controllers/brandController.js');

describe('brandController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBrands', () => {
    it('should return brands on success', async () => {
      const brands = [{ id: 1, name: 'Brand1' }];
      getAllBrands.mockResolvedValue(brands);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getBrands(req, res);

      expect(getAllBrands).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(brands);
    });

    it('should return 500 on error', async () => {
      getAllBrands.mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await getBrands(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to fetch brands' });
    });
  });

  describe('deleteBrand', () => {
    it('should delete brand if found', async () => {
      deleteBrandById.mockResolvedValue(true);

      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();

      await deleteBrand(req, res);

      expect(deleteBrandById).toHaveBeenCalledWith('1');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: 'Brand deleted successfully' });
    });

    it('should return 404 if brand not found', async () => {
      deleteBrandById.mockResolvedValue(false);

      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();

      await deleteBrand(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: 'Brand not found' });
    });

    it('should return 500 on error', async () => {
      deleteBrandById.mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();

      await deleteBrand(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to delete brand' });
    });
  });

  describe('addBrand', () => {
    it('should return 400 if name or image missing', async () => {
      const req = httpMocks.createRequest({ body: {}, files: {} });
      const res = httpMocks.createResponse();

      await addBrand(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Name and image are required' });
    });

    it('should return 409 if brand exists', async () => {
      brandExists.mockResolvedValue(true);

      const req = httpMocks.createRequest({
        body: { name: 'BrandX' },
        files: { image: [{ filename: 'img.jpg' }] }
      });
      const res = httpMocks.createResponse();

      await addBrand(req, res);

      expect(brandExists).toHaveBeenCalledWith('BrandX');
      expect(res.statusCode).toBe(409);
      expect(res._getJSONData()).toEqual({ error: 'Brand already exists' });
    });

    it('should create brand successfully', async () => {
      brandExists.mockResolvedValue(false);
      createBrand.mockResolvedValue({ id: 1, name: 'BrandX', image_url: '/uploads/img.jpg' });

      const req = httpMocks.createRequest({
        body: { name: 'BrandX' },
        files: { image: [{ filename: 'img.jpg' }] }
      });
      const res = httpMocks.createResponse();

      await addBrand(req, res);

      expect(createBrand).toHaveBeenCalledWith('BrandX', '/uploads/img.jpg');
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({ id: 1, name: 'BrandX', image_url: '/uploads/img.jpg' });
    });

    it('should return 500 on error', async () => {
      brandExists.mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest({
        body: { name: 'BrandX' },
        files: { image: [{ filename: 'img.jpg' }] }
      });
      const res = httpMocks.createResponse();

      await addBrand(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to add brand' });
    });
  });

  describe('updateBrand', () => {
    it('should return 400 if name missing', async () => {
      const req = httpMocks.createRequest({ body: {}, params: { id: '1' }, files: {} });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Name is required' });
    });

    it('should return 400 if image missing', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'NewBrand' },
        params: { id: '1' },
        files: {}
      });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Image is required' });
    });

    it('should update brand successfully with new image', async () => {
      updateBrandById.mockResolvedValue({ id: '1', name: 'NewBrand', image_url: '/uploads/new.jpg' });

      const req = httpMocks.createRequest({
        body: { name: 'NewBrand' },
        params: { id: '1' },
        files: { image: [{ filename: 'new.jpg' }] }
      });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(updateBrandById).toHaveBeenCalledWith('1', 'NewBrand', '/uploads/new.jpg');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ id: '1', name: 'NewBrand', image_url: '/uploads/new.jpg' });
    });

    it('should update brand successfully with existing image_url', async () => {
      updateBrandById.mockResolvedValue({ id: '1', name: 'NewBrand', image_url: '/uploads/existing.jpg' });

      const req = httpMocks.createRequest({
        body: { name: 'NewBrand', image: '/uploads/existing.jpg' },
        params: { id: '1' },
        files: {}
      });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(updateBrandById).toHaveBeenCalledWith('1', 'NewBrand', '/uploads/existing.jpg');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ id: '1', name: 'NewBrand', image_url: '/uploads/existing.jpg' });
    });

    it('should return 404 if brand not found', async () => {
      updateBrandById.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { name: 'NewBrand', image: '/uploads/existing.jpg' },
        params: { id: '1' },
        files: {}
      });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ error: 'Brand not found' });
    });

    it('should return 500 on error', async () => {
      updateBrandById.mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest({
        body: { name: 'NewBrand', image: '/uploads/existing.jpg' },
        params: { id: '1' },
        files: {}
      });
      const res = httpMocks.createResponse();

      await updateBrand(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to update brand' });
    });
  });
});
