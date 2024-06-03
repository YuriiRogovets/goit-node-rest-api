import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js"
import Jimp from "jimp";


async function changeAvatar(req, res, next) {
    try {

        const newPath = path.resolve("public", "avatars", req.file.filename);

        (await Jimp.read(req.file.path)).resize(250, 250).write(req.file.path);

        await fs.rename(req.file.path, newPath);
        console.log(req.user);

        const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatarURL: req.file.filename }, { new: true });

        const feedbackMessage = {
            avatarURL: updatedUser.avatarURL
            };

        res.send(feedbackMessage);
    
    } catch (error) {
        next(error)
    }
    
}

export default {changeAvatar};