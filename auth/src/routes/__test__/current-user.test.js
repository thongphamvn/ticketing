"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const setup_1 = require("../../test/setup");
it("get current user", () => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = yield (0, setup_1.signin)();
    yield (0, supertest_1.default)(app_1.app)
        .get(`/api/users/currentuser`)
        .set("Cookie", cookie)
        .expect(200)
        .expect(({ body }) => {
        expect(body).toEqual({
            currentUser: expect.objectContaining({ email: "test@test.com" }),
        });
    });
}));
