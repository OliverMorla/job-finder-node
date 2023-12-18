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
exports.getUserByID = exports.deleteUser = exports.createUser = exports.signInUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../lib/models/userModel"));
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield req.body;
    try {
        const user = yield userModel_1.default.findOne({
            email: email,
        });
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "User does not exist!",
            });
        }
        const doesItMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!doesItMatch) {
            return res.status(400).json({
                ok: false,
                message: "Password is incorrect!",
            });
        }
        return res.status(200).json({
            ok: true,
            message: "User logged in successfully!",
            user: {
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar,
            },
        });
    }
    catch (err) { }
});
exports.signInUser = signInUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { displayName, email, password } = yield req.body;
    if (!process.env.SALT_ROUNDS) {
        return res.status(404).json({
            ok: false,
            message: "Failed to read .env",
        });
    }
    if (displayName === "" || email === "" || password === "") {
        return res.status(404).json({
            ok: false,
            message: "Please fill out all required fields!",
        });
    }
    // const hashedPassword = bcrypt.hash(
    //   password,
    //   process.env.SALT_ROUNDS,
    //   (err, hash) => {
    //     if (err) return;
    //     return hash;
    //   }
    // );
    // console.log(hashedPassword)
    // try {
    //   const user = await User.create({
    //     displayName,
    //     email,
    //     password: hashedPassword,
    //   });
    // } catch (err) {}
});
exports.createUser = createUser;
const deleteUser = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteUser = deleteUser;
const getUserByID = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.getUserByID = getUserByID;
