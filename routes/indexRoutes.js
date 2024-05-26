import express from "express";

import authRoutes from "./authRouter.js";
import contactRoutes from "./contactsRouter.js";

const router = express.Router();

router.use("/users", authRoutes);
router.use("/api/contacts", contactRoutes);

export default router;
