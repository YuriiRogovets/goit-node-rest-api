import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { registerSchema, loginSchema, repeatVerifySchema } from "../schemas/userSchema.js";
import gravatar from "gravatar";
import mail from "../mail.js";
import crypto from "node:crypto";
import HttpError from "../helpers/HttpError.js";


async function register(req, res, next) {
    try {
        const data = req.body;
        const { error } = registerSchema.validate(data, { abortEarly: false })
            
        if (typeof error !== "undefined") {

          return res.status(400).send({ message: "the request is not valid"});
        }

        const { email, password } = req.body;
        const userEmail = await User.findOne({ email: email });
        if (userEmail !== null) {
            return res.status(409).send({ message: "Email in use" })
        }
        
        const avatarRegister = gravatar.url(email);

        const passwordHash = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomUUID();

        mail.sendMail({
            to: email,
            from: "yura.rogovets@gmail.com",
            subject: "Welcome to your Phone Book!",
            html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you email please open the link http://localhost:3000/users/verify/${verificationToken}`,
        })

        const result = await User.create({ email, password: passwordHash, avatarURL: avatarRegister, verificationToken });

        const feedbackMessage = {
            user: {
                email: result.email,
                subscription: result.subscription
            }
        };

        res.status(201).send(feedbackMessage);

    } catch (error) {
        next(error);
    }

};

async function login(req, res, next) {
    try {
            
        const data = req.body;
        const { error } = loginSchema.validate(data)
            
        if (typeof error !== "undefined") {

          return res.status(400).send({ message: "the request is not valid"});
        }
        
            const { email, password } = req.body;
            const result = await User.findOne({ email: email });
                        
            if (result === null) {
                return res.status(401).send({ message: "Email or password is wrong" });
            }
            
            const isMatch = await bcrypt.compare(password, result.password);

            if (isMatch === false) {
                return res.status(401).send({ message: "Email or password is wrong" });
            }
            
            if (result.verify === false) {
                return res.status(401).send({ message: "Please verify your email" });
            }
            
            const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: "8h" }); 
                    
            const updatedUser = await User.findByIdAndUpdate(result._id, { token }, { new: true });

            const feedbackMessage = {
            token : token,
            user: {
                email: updatedUser.email,
                subscription: updatedUser.subscription
            }
            };

        res.status(200).send(feedbackMessage);
  
        

    } catch (error) {
        next(error)
    }

};

async function logout(req, res, next) {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
    
};

async function current(req, res, next) {
    const { id } = req.user;
    const user = await User.findById(id);
  
  res.status(200).send({
    email: user.email,
    subscription: user.subscription,
  });
}

async function verifyEmail(req, res, next) {
    
    try {
       
        const {verificationToken} = req.params;

        const result = await User.findOne({ verificationToken: verificationToken });

        if (result === null) {

            res.status(404).send({ message: "User not found" });
        }

        await User.findByIdAndUpdate(result._id, { verify: true, verificationToken: null });

        res.status(200).send({ message: "Verification successful" });

    } catch (error) {

        next(error);
    } 

}

async function repeatVerifyEmail(req, res, next) {
         
    try {
        const { email } = req.body;

        const { error } = repeatVerifySchema.validate({email});

        if (error) throw HttpError(400, error.message);


        const result = await User.findOne({ email });

        if (result === null) {
            throw HttpError(404);
        }

        if (result.verify) {

            throw HttpError(400, "Verification has already been passed");
        }
        
        mail.sendMail({
            to: email,
            from: "yura.rogovets@gmail.com",
            subject: "Welcome to your Phone Book!",
            html: `To confirm you email please click on <a href="http://localhost:3000/users/verify/${result.verificationToken}">link</a>`,
            text: `To confirm you email please open the link http://localhost:3000/users/verify/${result.verificationToken}`,
        })

      res.status(200).send({ message: "Verification email sent" });
     
    } catch (error) {

        next(error);
    }

}

export default { register, login, logout, current, verifyEmail, repeatVerifyEmail };