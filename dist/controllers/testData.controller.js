"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _testDataService = _interopRequireDefault(require("../services/testData.service"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let TestDataController = class TestDataController {
    constructor(){
        this.testDataService = new _testDataService.default();
        this.getTestData = async (req, res, next)=>{
            console.log('Testing', req);
            try {
                const findAllTestData = await this.testDataService.findAllTestData();
                res.status(200).json({
                    data: findAllTestData,
                    message: 'findAll'
                });
            } catch (error) {
                next(error);
            }
        };
        this.getTestDataById = async (req, res, next)=>{
            try {
                const testDataId = req.params.id;
                const findOneTestData = await this.testDataService.findTestDataById(testDataId);
                res.status(200).json({
                    data: findOneTestData,
                    message: 'findOne'
                });
            } catch (error) {
                next(error);
            }
        };
        this.createTestData = async (req, res, next)=>{
            try {
                const TestData = req.body;
                const createTestData = await this.testDataService.createTestData(TestData);
                res.status(201).json({
                    data: createTestData,
                    message: 'created'
                });
            } catch (error) {
                next(error);
            }
        };
        this.updateTestData = async (req, res, next)=>{
            try {
                const testDataId = req.params.id;
                const TestData = req.body;
                const updateTestData = await this.testDataService.updateTestData(testDataId, TestData);
                res.status(200).json({
                    data: updateTestData,
                    message: 'updated'
                });
            } catch (error) {
                next(error);
            }
        };
        this.deleteTestData = async (req, res, next)=>{
            try {
                const testDataId = req.params.id;
                const deleteTestData = await this.testDataService.deleteTestData(testDataId);
                res.status(200).json({
                    data: deleteTestData,
                    message: 'deleted'
                });
            } catch (error) {
                next(error);
            }
        };
    }
};
const _default = TestDataController;

//# sourceMappingURL=testData.controller.js.map