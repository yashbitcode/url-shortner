const { z } = require("zod");

const signupReqBodyValidations = z.object({
    firstname: z.string().min(4),
    lastname: z.string().min(4).optional(),
    email: z.email(),
    password: z
        .string()
        .min(8)
        .max(20)
        .refine((password) => /^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)),
});

const loginReqBodyValidations = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8)
        .max(20)
        .refine((password) => /^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)),
});

module.exports = {
    signupReqBodyValidations,
    loginReqBodyValidations
};
