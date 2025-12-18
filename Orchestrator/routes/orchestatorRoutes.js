// routes/orchestratorRoutes.js
const express = require("express");
const router = express.Router();

const orchestratorController = require("../controllers/OrchestatorController");

// Orchestrator service contract
router.get("/health", orchestratorController.health);
router.post("/run", orchestratorController.run);

module.exports = router;
