"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginUsersDto", {
    enumerable: true,
    get: ()=>LoginUsersDto
});
const _classValidator = require("class-validator");
var __decorate = (void 0) && (void 0).__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (void 0) && (void 0).__metadata || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let LoginUsersDto = class LoginUsersDto {
};
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], LoginUsersDto.prototype, "email", void 0);
__decorate([
    (0, _classValidator.IsString)(),
    __metadata("design:type", String)
], LoginUsersDto.prototype, "password", void 0);
__decorate([
    (0, _classValidator.IsNumber)(),
    __metadata("design:type", Number)
], LoginUsersDto.prototype, "mobile", void 0);

//# sourceMappingURL=users.login.dto.js.map