const adaptRequest = require('../helpers/adapt-request');
const httpResponse = require('../helpers/http-response');
const handleUserRequest = require('./user-endpoint');

function userController (req, res) {
    const httpRequest = adaptRequest(req);

    try {
        const response = await handleUserRequest(httpRequest);

        // Set Headers
        if (response.headers) {
            res.set(response.headers)
        }

        // Send response
        res
        .statusCode(response.statusCode)
        .send(response.data);

    }catch (error) {
        return httpResponse({ statusCode: 404, data: error.message });
    }
}

module.exports = userController;