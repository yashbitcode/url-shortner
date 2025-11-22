const { z } = require("zod");

const urlShortenReqBodyValidation = z.object({
    url: z.url(),
    code: z.string().optional(),
});

module.exports = {
    urlShortenReqBodyValidation
};