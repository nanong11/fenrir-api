"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _express = require("express");
const _testDataController = _interopRequireDefault(require("../controllers/testData.controller"));
const _authMiddleware = _interopRequireDefault(require("../middlewares/auth.middleware"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let TestDataRoute = class TestDataRoute {
    initializeRoutes() {
        this.router.get(`${this.path}`, _authMiddleware.default, this.testDataController.getTestData);
        this.router.get(`${this.path}/:id`, _authMiddleware.default, this.testDataController.getTestDataById);
        this.router.post(`${this.path}`, _authMiddleware.default, this.testDataController.createTestData);
        this.router.put(`${this.path}/:id`, _authMiddleware.default, this.testDataController.updateTestData);
        this.router.delete(`${this.path}/:id`, _authMiddleware.default, this.testDataController.deleteTestData);
    }
    constructor(){
        this.path = '/test-data';
        this.router = (0, _express.Router)();
        this.testDataController = new _testDataController.default();
        this.initializeRoutes();
    }
};
const _default = TestDataRoute;

//# sourceMappingURL=testData.route.js.map