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
exports.updateResourceStatus = exports.getResourcesByIncident = exports.assignResourceToIncident = exports.getAllResources = exports.createResource = void 0;
const Resource_1 = __importDefault(require("../models/Resource"));
// Create resource
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, location } = req.body;
        const resource = new Resource_1.default({
            name,
            type,
            location,
        });
        yield resource.save();
        res.status(201).json({
            success: true,
            data: resource,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating resource",
            error,
        });
    }
});
exports.createResource = createResource;
// Get all resources
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield Resource_1.default.find();
        res.status(200).json({
            success: true,
            data: resources,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching resources",
            error,
        });
    }
});
exports.getAllResources = getAllResources;
// Assign resource to incident
const assignResourceToIncident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resourceId, incidentId } = req.body;
        // Find resource
        const resource = yield Resource_1.default.findById(resourceId);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }
        // Check if already assigned
        if (resource.status !== "AVAILABLE") {
            return res.status(400).json({
                success: false,
                message: "Resource is not available",
            });
        }
        // Assign resource
        resource.status = "ASSIGNED";
        resource.currentIncident = incidentId;
        yield resource.save();
        res.status(200).json({
            success: true,
            message: "Resource assigned successfully",
            data: resource,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error assigning resource",
            error,
        });
    }
});
exports.assignResourceToIncident = assignResourceToIncident;
// Get resources assigned to specific incident
const getResourcesByIncident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { incidentId } = req.params;
        const resources = yield Resource_1.default.find({
            currentIncident: incidentId,
        });
        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching assigned resources",
            error,
        });
    }
});
exports.getResourcesByIncident = getResourcesByIncident;
// Update resource status
const updateResourceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resourceId } = req.params;
        const { status } = req.body;
        const validStatuses = ["AVAILABLE", "ASSIGNED", "IN_TRANSIT", "ARRIVED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }
        const resource = yield Resource_1.default.findById(resourceId);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }
        resource.status = status;
        // If resource becomes AVAILABLE, remove incident link
        if (status === "AVAILABLE") {
            resource.currentIncident = null;
        }
        yield resource.save();
        res.status(200).json({
            success: true,
            message: "Resource status updated successfully",
            data: resource,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating resource status",
            error,
        });
    }
});
exports.updateResourceStatus = updateResourceStatus;
