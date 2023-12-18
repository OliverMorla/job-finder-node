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
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const account = true;
    if (account) {
        return next();
    }
});
userRouter.get("/dashboard", isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .json({
        message: "User dashboard route!",
    })
        .status(200);
}));
userRouter.route("/login").post(userController_1.signInUser);
userRouter.route("/register").post(userController_1.createUser);
exports.default = userRouter;
