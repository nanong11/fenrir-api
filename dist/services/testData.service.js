"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _httpException = require("../exceptions/HttpException");
const _util = require("../utils/util");
const _testDataModel = _interopRequireDefault(require("../models/testData.model"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
let TestDataService = class TestDataService {
    async findAllTestData() {
        const testData = await this.testData.find();
        return testData;
    }
    async findTestDataById(testDataId) {
        if ((0, _util.isEmpty)(testDataId)) throw new _httpException.HttpException(400, 'TestDataId is empty');
        const findTestData = await this.testData.findOne({
            _id: testDataId
        });
        if (!findTestData) throw new _httpException.HttpException(409, "TestData doesn't exist");
        return findTestData;
    }
    async createTestData(testData) {
        if ((0, _util.isEmpty)(testData)) throw new _httpException.HttpException(400, 'TestData is empty');
        const createUserData = await this.testData.create(_objectSpread({}, testData));
        return createUserData;
    }
    async updateTestData(testDataId, testData) {
        if ((0, _util.isEmpty)(testData)) throw new _httpException.HttpException(400, 'testData is empty');
        const updateTestDataById = await this.testData.findByIdAndUpdate(testDataId, testData, {
            new: true
        });
        if (!updateTestDataById) throw new _httpException.HttpException(409, "TestData doesn't exist");
        return updateTestDataById;
    }
    async deleteTestData(testDataId) {
        const deleteTestDataById = await this.testData.findByIdAndDelete(testDataId);
        if (!deleteTestDataById) throw new _httpException.HttpException(409, "TestData doesn't exist");
        return deleteTestDataById;
    }
    constructor(){
        this.testData = _testDataModel.default;
    }
};
const _default = TestDataService;

//# sourceMappingURL=testData.service.js.map