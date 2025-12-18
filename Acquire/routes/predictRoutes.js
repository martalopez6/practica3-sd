// routes/acquireRoutes.js
const express = require("express");
const router = express.Router();

const acquireController = require("../controlers/acquireController");

// Service contract for ACQUIRE
router.get("/health", acquireController.health);
router.post("/data", acquireController.data);

module.exports = router;
