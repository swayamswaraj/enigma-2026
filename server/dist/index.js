"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/incidents", incidentRoutes_1.default);
app.use("/api/resources", resourceRoutes_1.default);
app.get("/test", (req, res) => {
    res.json({ message: "Test working" });
});
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
