import express from "express";
import AuthController from "../controllers/authControllers.js";
import authMiddleware from "../middleware/auth.js"

const authRouter = express.Router()
const jsonParser = express.json()

authRouter.post("/register", jsonParser, AuthController.register);
authRouter.post("/login", jsonParser, AuthController.login);
authRouter.get("/logout", authMiddleware, AuthController.logout);
authRouter.get("/current", authMiddleware, AuthController.current);

export default authRouter;
