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
exports.getIncidentById = exports.getAllIncidents = exports.createIncident = void 0;
const Incident_1 = __importDefault(require("../models/Incident"));
const mongoose_1 = __importDefault(require("mongoose"));
const storage_services_1 = require("../services/storage.services");
const openai_1 = __importDefault(require("openai"));
// Initialize OpenAI (Make sure OPENAI_API_KEY is in your .env file)
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Create Incident
const createIncident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { title, description, location, severity } = req.body;
        // 1. Guard clause: Ensure a file was uploaded since 'image' is required
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "An image file is required.",
            });
        }
        // --- AI VALIDATION STEP ---
        // Convert the image buffer to a base64 data URL string for OpenAI
        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;
        const dataUrl = `data:${mimeType};base64,${base64Image}`;
        const prompt = `
      You are a disaster response moderator. 
      A user is reporting with the title: "${title}" and description: "${description}".
      Does the provided image realistically show a lighter burning that matches this text?
      Reply strictly with "VALID" if it matches, or "INVALID" if it is unrelated, fake, or spam.
    `;
        // Call OpenAI Vision API
        const aiResponse = yield openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: dataUrl } },
                    ],
                },
            ],
            max_tokens: 10, // We only need a 1-word response
        });
        const validationResult = ((_c = (_b = (_a = aiResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim().toUpperCase()) || "";
        // If OpenAI says it's not a match, reject it immediately and prompt a retake
        if (validationResult.includes("INVALID")) {
            return res.status(400).json({
                success: false,
                errorType: "IMAGE_MISMATCH",
                message: "Retake picture, image doesn't match the title.",
            });
        }
        // --- END AI VALIDATION STEP ---
        // 2. Upload the valid image to ImageKit
        const uploadResult = yield (0, storage_services_1.uploadImage)(req.file.buffer, `${Date.now()}-${req.file.originalname}`);
        // 3. Map fields correctly for Mongoose
        const incident = new Incident_1.default({
            title,
            description,
            location,
            severity: severity === null || severity === void 0 ? void 0 : severity.toUpperCase(), // Convert incoming string to uppercase
            image: uploadResult.url, // Match the model field 'image'
        });
        yield incident.save();
        res.status(201).json({
            success: true,
            data: incident,
        });
    }
    catch (error) {
        console.error("Create incident error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating incident",
        });
    }
});
exports.createIncident = createIncident;
// Get all incidents
const getAllIncidents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incidents = yield Incident_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: incidents,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incidents",
            error,
        });
    }
});
exports.getAllIncidents = getAllIncidents;
// Get incident by ID
const getIncidentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request to get incident by ID:", req.params.id);
    try {
        const { id } = req.params;
        // ✅ Check if valid Mongo ID
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Incident ID",
            });
        }
        const incident = yield Incident_1.default.findById(id);
        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Incident not found",
            });
        }
        res.status(200).json({
            success: true,
            data: incident,
        });
    }
    catch (error) {
        console.error("Error fetching incident by ID:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getIncidentById = getIncidentById;
