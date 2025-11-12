const crypto = require("node:crypto");

const getHashAndSalt = (password, userSalt) => {
    const salt = userSalt ?? crypto.randomBytes(10).toString("base64");
    const hashPassword = crypto
        .createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    return {
        salt,
        hashPassword
    };
};

module.exports = getHashAndSalt;