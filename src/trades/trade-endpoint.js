const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const trade = require('./trade-service')({ database });

async function handleTradeRequest (httpRequest) {
    let requestType;

    switch (httpRequest.method) {
        case 'GET':
            return await trade.getTrades({ _tradeId: httpRequest.body._id || null, _strategyId: httpRequest.body._strategyId });

        case 'POST':           
            return await trade.addTrade({ _strategyId: httpRequest.body._strategyId, type: httpRequest.body.type, entry: httpRequest.body.entry, exit: httpRequest.body.exit, profitable: httpRequest.body.profitable });

        case 'PUT':
            return await trade.updateTrade({ strategyId: httpRequest.body.strategyId, tradeId: httpRequest.body.tradeId, type: httpRequest.body.type, entry: httpRequest.body.entry, exit: httpRequest.body.exit, profitable: httpRequest.body.profitable });
            

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

function determineRequest (httpRequest) {
    
}

module.exports = handleTradeRequest;