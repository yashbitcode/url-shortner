const { nanoid } = require("nanoid");

const getNanoId = (size = 5) => {
    return nanoid(size);
};

module.exports = {
    getNanoId
};