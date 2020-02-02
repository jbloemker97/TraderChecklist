const adaptRequest = require('../helpers/adapt-request');
const httpResponse = require('../helpers/http-response');
const handleTradeRequest = require('./trade-endpoint');

async function tradeController (req, res) {
    const httpRequest = adaptRequest(req);

    try {
        const response = await handleTradeRequest(httpRequest);

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

module.exports = tradeController;