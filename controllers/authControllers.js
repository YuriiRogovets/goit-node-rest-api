import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import User from "../models/user.js";


async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const userEmail = await User.findOne({ email: email });
        if (userEmail !== null) {
            return res.status(409).send({ message: "Email in use" })
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const result = await User.create({ email, password: passwordHash });

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
            const { email, password } = req.body;
            const result = await User.findOne({ email: email });
            console.log(result);
            
            if (result === null) {
            return res.status(401).send({message:"Email or password is wrong"})
            }
            
            const isMatch = await bcrypt.compare(password, result.password);

            if (isMatch === false) {
                 return res.status(401).send({message:"Email or password is wrong"})
            }
            

            const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, { expiresIn: 3600 },); 
                    
            
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
    

export default { register, login };