const adaptRequest = require('../helpers/adapt-request');
const httpResponse = require('../helpers/http-response');
const handleStrategyRequest = require('./strategy-endpoint');

async function strategyController (req, res) {
    const httpRequest = adaptRequest(req);

    try {
        const response = await handleStrategyRequest(httpRequest);

        // Set Headers
        if (response.headers) {
            res.set(response.headers)
        }

        // Send response
        res
        .status(response.statusCode)
        .send(response);

    }catch (error) {
        console.log(error);
        return httpResponse({ statusCode: 404, data: error.message });
    }
}

module.exports = strategyController;