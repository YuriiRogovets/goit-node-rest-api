import express from "express";
import AuthController from "../controllers/authControllers.js";
import UserControllers from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js"
import uploadMiddleware from "../middleware/upload.js";


const authRouter = express.Router()
const jsonParser = express.json()

authRouter.post("/register", jsonParser, AuthController.register);
authRouter.post("/login", jsonParser, AuthController.login);
authRouter.post("/logout", authMiddleware, AuthController.logout);
authRouter.get("/current", authMiddleware, AuthController.current);
authRouter.patch("/avatars", authMiddleware, uploadMiddleware.single("avatar"), UserControllers.changeAvatar);

authRouter.get("/verify/:verificationToken", AuthController.verifyEmail)
authRouter.post("/verify", AuthController.repeatVerifyEmail)

export default authRouter;
