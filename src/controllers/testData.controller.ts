// REQUIRED TO IMPORT
import { NextFunction, Request, Response } from 'express';
// Import the interface
import { TestData } from '@/interfaces/testData.interface';
// Import the service
import testDataService from '@/services/testData.service';

class TestDataController {
  public testDataService = new testDataService();

  public getTestData = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Testing', req);
    try {
      const findAllTestData: TestData[] = await this.testDataService.findAllTestData();

      res.status(200).json({ data: findAllTestData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTestDataById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const testDataId: string = req.params.id;
      const findOneTestData: TestData = await this.testDataService.findTestDataById(testDataId);

      res.status(200).json({ data: findOneTestData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const TestData: Object = req.body;
      const createTestData: TestData = await this.testDataService.createTestData(TestData);

      res.status(201).json({ data: createTestData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const testDataId: string = req.params.id;
      const TestData: Object = req.body;
      const updateTestData: TestData = await this.testDataService.updateTestData(testDataId, TestData);

      res.status(200).json({ data: updateTestData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTestData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const testDataId: string = req.params.id;
      const deleteTestData: TestData = await this.testDataService.deleteTestData(testDataId);

      res.status(200).json({ data: deleteTestData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TestDataController;
