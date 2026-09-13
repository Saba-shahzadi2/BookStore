import express from "express";

import { submitContactMessage } from "../controllers/contactController.js";

import { contactLimiter } from "../middleware/rateLimitMiddleware.js";

import { validateContactMessage } from "../validators/contactValidator.js";

const router = express.Router();

// ==========================================
// Contact
// ==========================================

router.post("/", contactLimiter, validateContactMessage, submitContactMessage);

export default router;
