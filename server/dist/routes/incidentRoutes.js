"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/incidentRoutes.ts
const express_1 = __importDefault(require("express"));
const incidentController_1 = require("../controllers/incidentController");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post("/create", multer_1.default.single("image"), incidentController_1.createIncident);
router.get("/all", incidentController_1.getAllIncidents);
router.get("/:id", incidentController_1.getIncidentById);
exports.default = router;
