"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _bcrypt = require("bcrypt");
const _jsonwebtoken = require("jsonwebtoken");
const _config = require("../config");
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
let AuthService = class AuthService {
    async signup(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUserEmail = await this.users.findOne({
            email: userData.email
        });
        if (findUserEmail) throw new _httpException.HttpException(409, `This email ${userData.email} already exists`);
        const findUserMobile = await this.users.findOne({
            mobile: userData.mobile
        });
        if (findUserMobile) throw new _httpException.HttpException(409, `This mobile ${userData.mobile} already exists`);
        const hashedPassword = await (0, _bcrypt.hash)(userData.password, 10);
        const createUserData = await this.users.create(_objectSpreadProps(_objectSpread({}, userData), {
            password: hashedPassword
        }));
        return createUserData;
    }
    async login(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        if (userData.mobile) {
            const findUser = await this.users.findOne({
                mobile: userData.mobile
            });
            if (!findUser) throw new _httpException.HttpException(404, `This mobile ${userData.mobile} was not found`);
            const isPasswordMatching = await (0, _bcrypt.compare)(userData.password, findUser.password);
            if (!isPasswordMatching) throw new _httpException.HttpException(401, 'Password is not matching');
            const tokenData = this.createToken(findUser);
            const cookie = this.createCookie(tokenData);
            return {
                cookie,
                findUser
            };
        } else {
            const findUser1 = await this.users.findOne({
                email: userData.email
            });
            if (!findUser1) throw new _httpException.HttpException(404, `This email ${userData.email} was not found`);
            const isPasswordMatching1 = await (0, _bcrypt.compare)(userData.password, findUser1.password);
            if (!isPasswordMatching1) throw new _httpException.HttpException(401, 'Password is not matching');
            const tokenData1 = this.createToken(findUser1);
            const cookie1 = this.createCookie(tokenData1);
            return {
                cookie: cookie1,
                findUser: findUser1
            };
        }
    }
    async logout(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        const findUser = await this.users.findOne({
            email: userData.email,
            password: userData.password
        });
        if (!findUser) throw new _httpException.HttpException(404, `This email ${userData.email} was not found`);
        return findUser;
    }
    async findUserData(userData) {
        if ((0, _util.isEmpty)(userData)) throw new _httpException.HttpException(400, 'userData is empty');
        if (userData) {
            const findUser = await this.users.findOne({
                email: userData.email,
                mobile: userData.mobile
            });
            if (!findUser) throw new _httpException.HttpException(404, `No user found`);
            return findUser;
        }
    }
    createToken(user) {
        const dataStoredInToken = {
            _id: user._id
        };
        const secretKey = _config.SECRET_KEY;
        const expiresIn = 60 * 60;
        return {
            expiresIn,
            token: (0, _jsonwebtoken.sign)(dataStoredInToken, secretKey, {
                expiresIn
            })
        };
    }
    createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
    constructor(){
        this.users = _usersModel.default;
    }
};
const _default = AuthService;

//# sourceMappingURL=auth.service.js.map