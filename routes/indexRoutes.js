import express from "express";
import authMiddleware from "../middleware/auth.js";
import authRoutes from "./authRouter.js";
import contactRoutes from "./contactsRouter.js";
import userRouter from "./userRouter.js"

const router = express.Router();

// router.use("/users", userRouter)
router.use("/users", authRoutes);
router.use("/api/contacts", authMiddleware, contactRoutes);

export default router;
