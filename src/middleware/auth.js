const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/');
const httpResponse = require('../helpers/http-response');

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).send(httpResponse({ statusCode: 403, data: 'No access token' }));

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded;
        next();
    }catch (err) {
        res.status(400).send(httpResponse({ statusCode: 400, data: 'Invalid access token' }));
    }

}