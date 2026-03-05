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
exports.uploadImage = void 0;
//src/services/storage.services.ts
// 1. Changed to a default import
const nodejs_1 = __importDefault(require("@imagekit/nodejs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const imageKit = new nodejs_1.default({
    // 2. Removed publicKey; only privateKey and urlEndpoint belong here
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
const uploadImage = (fileBuffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 3. Updated to use the .files namespace
        const result = yield imageKit.files.upload({
            file: fileBuffer.toString("base64"),
            fileName,
            folder: "/incidents",
        });
        return result;
    }
    catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
});
exports.uploadImage = uploadImage;
