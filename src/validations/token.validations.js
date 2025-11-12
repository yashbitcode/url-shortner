const { z } = require("zod");

const tokenPayloadValidation = z.object({
    id: z.string(),
    firstname: z.string().min(4),
    lastname: z.string().min(4).optional(),
    email: z.email(),
    iat: z.number().optional()
});

module.exports = {
    tokenPayloadValidation
};