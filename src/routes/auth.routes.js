const express = require("express");
const {
    signupReqBodyValidations,
    loginReqBodyValidations
} = require("../validations/auth.validations");
const jwt = require("jsonwebtoken");
const getHashAndSalt = require("../utils/hash");
const router = express.Router();
const UserService = require("../services/user.service");

router.post("/signup", async (req, res) => {
    try {
        const validations = await signupReqBodyValidations.safeParseAsync(
            req.body
        );

        if (!validations.success) throw Error(validations.error);
        const { firstname, lastname, email, password } = req.body;

        if (!(firstname && email && password))
            throw Error("Credentials are required");

        const doc = await UserService.getUserByEmail(email);

        if (doc) throw Error("User already exists");

        const { salt, hashPassword } = getHashAndSalt(password);
        
        const user = await UserService.createUser({
            firstname,
            lastname,
            email,
            password: hashPassword,
            salt,
        });

        return res.json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "something went wrong",
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const validations = await loginReqBodyValidations.safeParseAsync(
            req.body
        );

        if (!validations.success) throw Error(validations.error);
        const { email, password } = req.body;

        const user = await UserService.getUserByEmail(email);

        if(!user) throw Error("User doesn't exist");

        const { hashPassword } = getHashAndSalt(password, user.salt);

        if(user.password !== hashPassword) throw Error("Wrong credentials");

        const token = jwt.sign({
            ...user,
            iat: Date.now()
        }, process.env.JWT_PRIVATE_KEY);

        res.json({
            success: true,
            token
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message ?? "something went wrong",
        });
    }
});

module.exports = router;
