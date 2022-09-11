// REQUIRED TO IMPORT
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
// Import the interface
import { TestData } from '@/interfaces/testData.interface';
// Import the model
import testDataModel from '@/models/testData.model';

class TestDataService {
  public testData = testDataModel;

  public async findAllTestData(): Promise<TestData[]> {
    const testData: TestData[] = await this.testData.find();
    return testData;
  }

  public async findTestDataById(testDataId: string): Promise<TestData> {
    if (isEmpty(testDataId)) throw new HttpException(400, 'TestDataId is empty');

    const findTestData: TestData = await this.testData.findOne({ _id: testDataId });
    if (!findTestData) throw new HttpException(409, "TestData doesn't exist");

    return findTestData;
  }

  public async createTestData(testData: Object): Promise<TestData> {
    if (isEmpty(testData)) throw new HttpException(400, 'TestData is empty');

    const createUserData: TestData = await this.testData.create({ ...testData });

    return createUserData;
  }

  public async updateTestData(testDataId: string, testData: Object): Promise<TestData> {
    if (isEmpty(testData)) throw new HttpException(400, 'testData is empty');

    const updateTestDataById: TestData = await this.testData.findByIdAndUpdate(testDataId, testData, { new: true });
    if (!updateTestDataById) throw new HttpException(409, "TestData doesn't exist");

    return updateTestDataById;
  }

  public async deleteTestData(testDataId: string): Promise<TestData> {
    const deleteTestDataById: TestData = await this.testData.findByIdAndDelete(testDataId);
    if (!deleteTestDataById) throw new HttpException(409, "TestData doesn't exist");

    return deleteTestDataById;
  }
}

export default TestDataService;
