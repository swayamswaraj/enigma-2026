"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/utils/multer.js
const multer_1 = __importDefault(require("multer"));
// Explicitly type 'upload' as 'Multer' to break the inference loop
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage()
});
exports.default = upload;
