"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resourceController_1 = require("../controllers/resourceController");
const router = express_1.default.Router();
router.post("/create", resourceController_1.createResource);
router.get("/all", resourceController_1.getAllResources);
router.post("/assign", resourceController_1.assignResourceToIncident);
router.get("/by-incident/:incidentId", resourceController_1.getResourcesByIncident);
router.patch("/:resourceId/status", resourceController_1.updateResourceStatus);
exports.default = router;
