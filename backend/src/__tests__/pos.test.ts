import request from 'supertest';
import express from 'express';
import posRoutes from '../routes/posRoutes';

// Create a test app with POS routes
const app = express();
app.use(express.json());
app.use('/api/pos', posRoutes);

describe('POS & Gestion Quincaillerie', () => {
  describe('Authentication required', () => {
    // All POS routes require authenticateToken + requireProfessional
    // Without a token, they should return 401

    const endpoints = [
      { method: 'get', path: '/api/pos/dashboard' },
      { method: 'get', path: '/api/pos/reports' },
      { method: 'get', path: '/api/pos/accounting/export' },
      { method: 'get', path: '/api/pos/stock/alerts' },
      { method: 'get', path: '/api/pos/products/search' },
      { method: 'get', path: '/api/pos/products/barcode' },
      { method: 'get', path: '/api/pos/stock' },
      { method: 'patch', path: '/api/pos/stock/adjust' },
      { method: 'post', path: '/api/pos/sales' },
      { method: 'get', path: '/api/pos/sales' },
      // Invoices
      { method: 'get', path: '/api/pos/invoices/stats' },
      { method: 'post', path: '/api/pos/invoices' },
      { method: 'get', path: '/api/pos/invoices' },
      // Suppliers
      { method: 'post', path: '/api/pos/suppliers' },
      { method: 'get', path: '/api/pos/suppliers' },
      // Registers
      { method: 'post', path: '/api/pos/registers' },
      { method: 'get', path: '/api/pos/registers' },
      // Loyalty
      { method: 'post', path: '/api/pos/loyalty' },
      { method: 'get', path: '/api/pos/loyalty' },
      // Returns
      { method: 'post', path: '/api/pos/returns' },
      { method: 'get', path: '/api/pos/returns' },
    ];

    it.each(endpoints)(
      '$method $path should return 401 without auth token',
      async ({ method, path }) => {
        const res = await (request(app) as any)[method](path);
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      }
    );
  });

  describe('Route structure', () => {
    it('should have POS routes mounted', () => {
      // Verify the router has routes defined
      const routes = posRoutes.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods)
        }));

      // Verify key POS routes exist
      const paths = routes.map((r: any) => r.path);

      // Sales
      expect(paths).toContain('/sales');
      // Stock
      expect(paths).toContain('/stock');
      expect(paths).toContain('/stock/adjust');
      expect(paths).toContain('/stock/alerts');
      // Invoices
      expect(paths).toContain('/invoices');
      expect(paths).toContain('/invoices/stats');
      // Suppliers
      expect(paths).toContain('/suppliers');
      // Registers
      expect(paths).toContain('/registers');
      // Loyalty
      expect(paths).toContain('/loyalty');
      // Returns
      expect(paths).toContain('/returns');
      // Dashboard & Reports
      expect(paths).toContain('/dashboard');
      expect(paths).toContain('/reports');
      // Accounting export
      expect(paths).toContain('/accounting/export');
      // Barcode search
      expect(paths).toContain('/products/barcode');
      // Product search
      expect(paths).toContain('/products/search');
    });

    it('should have correct HTTP methods for CRUD operations', () => {
      const routes = posRoutes.stack
        .filter((layer: any) => layer.route)
        .map((layer: any) => ({
          path: layer.route.path,
          methods: Object.keys(layer.route.methods)
        }));

      const findRoute = (path: string) => routes.filter((r: any) => r.path === path);

      // Sales: POST create, GET list
      const salesRoutes = findRoute('/sales');
      expect(salesRoutes.some((r: any) => r.methods.includes('post'))).toBe(true);
      expect(salesRoutes.some((r: any) => r.methods.includes('get'))).toBe(true);

      // Suppliers: POST create, GET list
      const supplierRoutes = findRoute('/suppliers');
      expect(supplierRoutes.some((r: any) => r.methods.includes('post'))).toBe(true);
      expect(supplierRoutes.some((r: any) => r.methods.includes('get'))).toBe(true);

      // Suppliers :id: GET, PUT, DELETE
      expect(findRoute('/suppliers/:id').some((r: any) => r.methods.includes('get'))).toBe(true);
      expect(findRoute('/suppliers/:id').some((r: any) => r.methods.includes('put'))).toBe(true);
      expect(findRoute('/suppliers/:id').some((r: any) => r.methods.includes('delete'))).toBe(true);

      // Registers: POST create, GET list
      const registerRoutes = findRoute('/registers');
      expect(registerRoutes.some((r: any) => r.methods.includes('post'))).toBe(true);
      expect(registerRoutes.some((r: any) => r.methods.includes('get'))).toBe(true);

      // Returns: POST create, GET list
      const returnRoutes = findRoute('/returns');
      expect(returnRoutes.some((r: any) => r.methods.includes('post'))).toBe(true);
      expect(returnRoutes.some((r: any) => r.methods.includes('get'))).toBe(true);

      // Loyalty: POST create, GET list
      const loyaltyRoutes = findRoute('/loyalty');
      expect(loyaltyRoutes.some((r: any) => r.methods.includes('post'))).toBe(true);
      expect(loyaltyRoutes.some((r: any) => r.methods.includes('get'))).toBe(true);
    });
  });
});
