const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/');

module.exports = function (req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) return res.status(403).send({ error: 'Access denied. No token provided' });

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded;
        next();
    }catch (err) {
        res.status(400).send({ error: `Access denied. Invalid token. ${err}` });
    }

}