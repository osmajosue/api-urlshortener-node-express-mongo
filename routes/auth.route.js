import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from 'express-validator';
import { userValidationResult } from "../middlewares/expressUserValidations.js";

//Middleware para manejar rutas.
const router = express.Router();

router.post('/register', [ 
    //Validation of the email on the BODY
    body('email', "Email format not correct")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', "Password must be 6 characters long")
        .trim()
        .isLength({ min: 6 }),
    body('password')
        .trim()
        .custom((value, { req }) => {
            if(value !== req.body.repassword) {
                throw new Error('Passwords do not match')
            }
            return value;
        })
], 
userValidationResult,
register
);

router.post('/login', [
    body('email', "Email format not correct")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', "Password must be 6 characters long")
        .trim()
        .isLength({ min: 6 })
], 
userValidationResult,
login
);

export default router;