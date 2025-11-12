const jwt = require("jsonwebtoken");
const { tokenPayloadValidation } = require("../validations/token.validations");

const JWT_SECRET = process.env.JWT_PRIVATE_KEY;

const createToken = async (payload) => {
    const validation = await tokenPayloadValidation.safeParseAsync(payload);

    if (!validation.success) throw Error(validation.error);
    const token = jwt.sign(validation.data, JWT_SECRET);

    return token;
};

const verifyToken = (token) => {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
}

module.exports = {
    createToken,
    verifyToken
};

/* 
    - if token header exits -> get user -> attached to req. 
    - if doesn't go on with normal req.
    - ensuring auth to protected routes
*/