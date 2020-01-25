const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/');

function sign (payload) {
    const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });

    return token;
}

module.exports = {
    sign
};