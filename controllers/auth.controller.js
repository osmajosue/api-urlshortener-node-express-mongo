import { User } from '../models/user.js';
import { UserService } from '../services/user.service.js';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { email, password } = req.body;
    const userService = new UserService();
    return userService.saveUser({email, password}, res);

    // try {
        
    //     let user = new User({ email, password });

    //     await user.save();

    //     // jwt token

    //     return res.status(201).json({"ok": `${email} registered succesfully`});
    // } catch (error) {
    //     console.log(error.code);

    //     //Second Alternative to see if the user is already registered
    //     if (error.code === 11000) {
    //         return res.status(400).json({error: "The user already exists"});
    //     }

    //     return res.status(500).json({error: "Server Error"});
    // }
    
}

export const login = async (req, res) => {
    const {email, password} = req.body;

   try {
        let user = await User.findOne({email});
        
        if(!user) return res.status(403).json({error: 'Invalid Credentials'});

        const passValidation = await user.comparePassword(password);

        if(!passValidation) 
            return res.status(403).json({error: 'Invalid Credentials'});
        //Generating JWT
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res)

        // Saving the JWT in the cookies
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: !(process.env.MODE === "developer"),
        // });

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Server Error"});
    }
}

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    const userService = new UserService();
    return userService.deleteUser({ uid }, res);
}

export const userInfo = async (req, res) => {
    // const { uid } = req.params;
    const userService = new UserService();
    return userService.getUserInfo( req , res);

    // try {
    //     const user = await User.findById(req.uid).select('email').lean();
    //     return res.json({ user });
    // } catch (error) {
    //     res.status(500).json({error: 'Non authenticated'});
    // }
}


export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie) throw new Error('There is no token in the headers. Bearer should be used')

        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const { token, expiresIn } = generateToken(uid);
        
        return res.json({ token, expiresIn });
    } catch (error) {
        const TokenVerificationErrors = {
            "invalid signature": "JWT signature is not valid",
            "jwt expired": "JWT has expired",
            "invalid token": "Invalid Token",
            "No Bearer": "Use Bearer format",
            "jwt malformed" : "Token Malformado o Incorrecto"
        }

        return res
            .status(401)
            .json({error: TokenVerificationErrors[error.message]})
    }
}