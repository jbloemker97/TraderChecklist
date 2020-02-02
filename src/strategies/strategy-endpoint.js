const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const strategy = require('./strategy-service')({ database });

async function handleStrategyRequest (httpRequest) {
    let requestType;

    switch (httpRequest.method) {
        case 'GET':
            return await strategy.getStrategies({ filter: httpRequest.body.filter || null, orderby: httpRequest.body.order || null });

        case 'POST':
            return await strategy.addStrategy({ name: httpRequest.body.name, description: httpRequest.body.description, author: httpRequest.body.author, categories: httpRequest.body.categories, tradeFrequency: httpRequest.body.tradeFrequency, price: httpRequest.body.price });

        case 'PUT':
            return await strategy.updateStrategy({ id: httpRequest.body.id, name: httpRequest.body.name, description: httpRequest.body.description, author: httpRequest.body.author, categories: httpRequest.body.categories, tradeFrequency: httpRequest.body.tradeFrequency, price: httpRequest.body.price });
           
        case 'DELETE':
            return await strategy.deleteStrategy({ _strategyId: httpRequest.body._strategyId });

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

module.exports = handleStrategyRequest;