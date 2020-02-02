const tradeValidator = require('../validators/trade');
const makeTrade = require('./trade-model')({ validator: tradeValidator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function strategyService ({ database }) {
    return Object.freeze({
        addTrade,
        updateTrade,
        getTrades
    });

    async function getTrades ({ _tradeId, _strategyId, }) {
        const db = await database;
        const mongoQuery = {
            _strategyId: ObjectID(_strategyId)
        };

        // Query trade id if passed
        if (_tradeId) mongoQuery._id = ObjectID(_tradeId);

        try {
            let query = await db
                .collection('trades')
                .find(mongoQuery)
                .toArray();

            if (_tradeId) [ query ] = query;

            return httpResponse({ statusCode: 200, data: query });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function addTrade ({ _strategyId, type, entry, exit, profitable }) {
        const db = await database;
        const trade = makeTrade({ _strategyId, type, entry, exit, profitable });

        try {
            const query = await db
                .collection('trades')
                .insertOne(trade)

            return httpResponse({ statusCode: 200, data: trade });

        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function updateTrade ({ strategyId, tradeId, type, entry, exit, profitable }) {
        
    }
}

module.exports = strategyService;