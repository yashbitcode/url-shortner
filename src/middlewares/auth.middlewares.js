const express = require("express");
const { verifyToken } = require("../utils/token");
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns 
 */

const authMiddleware = async (req, res, next) => {
    try {
        const tokenHeader = req.get("Authorization");
        if(!tokenHeader) return next();

        if(!tokenHeader.startsWith("Bearer")) throw Error("Token should starts with Bearer");

        const token = tokenHeader.split(" ")[1];
        if(!token) throw Error("Invalid token");

        const tokenVerificationResult = verifyToken(token);
        req.user = tokenVerificationResult;

        next();
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const ensureAuthenticated = async (req, res, next) => {
    try {
        const user = req.user;
        if(!user) throw Error("You must be authenticated");
        
        next();
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
} 

module.exports = {
    authMiddleware,
    ensureAuthenticated
};