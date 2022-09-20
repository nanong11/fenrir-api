"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _bcrypt = require("bcrypt");
const _httpException = require("../exceptions/HttpException");
const _usersModel = _interopRequireDefault(require("../models/users.model"));
const _util = require("../utils/util");
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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
let UserService = class UserService {
    async findAllUser() {
        const users = await this.users.find();
        return users;
    }
    async findUserById(userId) {
        if ((0, _util.isEmpty)(userId)) throw new _httpException.HttpException(400, 'UserId is empty');
        const findUser = await this.users.findOne({
            _id: userId
        });
        if (!findUser) throw new _httpException.HttpException(409, "User doesn't exist");
        return findUser;
    }
    async createUser(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findOne({
            email: userData.email
        });
        if (findUser) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const createUserData = await this.users.create(_objectSpreadProps(_objectSpread({}, userData), {
            password: hashedPassword
        }));
        return createUserData;
    }
    async updateUser(userId, userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        if (userData.email) {
            const findUser = await this.users.findOne({
                email: userData.email
            });
            if (findUser && findUser._id != userId) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        }
        if (userData.password) {
            const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
            userData = _objectSpreadProps(_objectSpread({}, userData), {
                password: hashedPassword
            });
        }
        const updateUserById = await this.users.findByIdAndUpdate(userId, {
            userData
        });
        if (!updateUserById) throw new _httpException.HttpException(409, "User doesn't exist");
        return updateUserById;
    }
    async checkMobile(userMobile) {
        if ((0, _util.isEmpty)(userMobile)) throw new _httpException.HttpException(400, 'userMobile is empty');
        const findUser = await this.users.findOne({
            mobile: userMobile
        });
        return (findUser === null || findUser === void 0 ? void 0 : findUser.mobile) === userMobile ? true : false;
    }
    async checkEmail(userEmail) {
        if ((0, _util.isEmpty)(userEmail)) throw new _httpException.HttpException(400, 'userEmail is empty');
        const findUser = await this.users.findOne({
            email: userEmail
        });
        return (findUser === null || findUser === void 0 ? void 0 : findUser.email) === userEmail ? true : false;
    }
    async deleteUser(userId) {
        const deleteUserById = await this.users.findByIdAndDelete(userId);
        if (!deleteUserById) throw new _httpException.HttpException(409, "User doesn't exist");
        return deleteUserById;
    }
    constructor(){
        this.users = _usersModel.default;
    }
};
const _default = UserService;

//# sourceMappingURL=users.service.js.map