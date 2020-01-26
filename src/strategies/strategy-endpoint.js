const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const user = require('./strategy-service')({ database });

async function handleStrategyRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'GET':
            return true;

        case 'POST':
            return true;

        case 'PUT':
            return true;

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

function determineRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'POST':
            return true;
    }
}

module.exports = handleStrategyRequest;