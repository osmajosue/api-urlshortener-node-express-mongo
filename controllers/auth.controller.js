import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = new User({ email, password });

        await user.save();

        // jwt token

        return res.status(201).json({"ok": `${email} registered succesfully`});
    } catch (error) {
        console.log(error.code);

        //Second Alternative to see if the user is already registered
        if (error.code === 11000) {
            return res.status(400).json({error: "The user already exists"});
        }

        return res.status(500).json({error: "Server Error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

   try {
        let user = await User.findOne({email});
        const token = jwt.sign({ uid: user._id}, process.env.JWT_SECRET);
        
        if(!user) return res.status(403).json({error: 'User does not exist'});

        const passValidation = await user.comparePassword(password);

        if(!passValidation) 
            return res.status(403).json({error: 'Incorrect Password'});


        return res.json({token});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Server Error"});
    }
}