"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _mongoose = require("mongoose");
const testDataSchema = new _mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    }
});
const testDataModel = (0, _mongoose.model)('TestData', testDataSchema);
const _default = testDataModel;

//# sourceMappingURL=testData.model.js.map