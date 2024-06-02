import express from "express";
import userControllers from "../controllers/userControllers.js"

const userRouter = express.Router();

userRouter.patch("/avatars", userControllers.changeAvatar)

export default userRouter;