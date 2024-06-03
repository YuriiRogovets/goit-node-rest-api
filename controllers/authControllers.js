import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import User from "../models/user.js";
import { registerSchema, loginSchema } from "../schemas/userSchema.js";
import gravatar from "gravatar";




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
        const result = await User.create({ email, password: passwordHash, avatarURL: avatarRegister });

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
            return res.status(401).send({message:"Email or password is wrong"})
            }
            
            const isMatch = await bcrypt.compare(password, result.password);

            if (isMatch === false) {
                 return res.status(401).send({message:"Email or password is wrong"})
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

    

export default { register, login, logout, current };