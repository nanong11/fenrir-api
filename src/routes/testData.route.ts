// REQUIRED TO IMPORT
import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// Import controller
import TestDataController from '@/controllers/testData.controller';
// Import auth middleware
import authMiddleware from '@/middlewares/auth.middleware';

class TestDataRoute implements Routes {
  public path = '/test-data';
  public router = Router();
  public testDataController = new TestDataController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.testDataController.getTestData);
    this.router.get(`${this.path}/:id`, authMiddleware, this.testDataController.getTestDataById);
    this.router.post(`${this.path}`, authMiddleware, this.testDataController.createTestData);
    this.router.put(`${this.path}/:id`, authMiddleware, this.testDataController.updateTestData);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.testDataController.deleteTestData);
  }
}

export default TestDataRoute;
