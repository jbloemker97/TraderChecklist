const tradeValidator = require('../validators/trade');
const makeTrade = require('./trade-model')({ validator: tradeValidator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function strategyService ({ database }) {
    return Object.freeze({
        addTrade,
        updateTrade,
        getTrades,
        deleteTrade
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

    async function updateTrade ({ _tradeId, type, entry, exit, profitable }) {
        const db = await database;
        const trade = makeTrade({ _strategyId: null, type, entry, exit, profitable });
        let updateQuery = {};
        const mongoQuery = { _id: ObjectID(_tradeId) };

        for (let field in trade) {
            if (trade[field]) updateQuery[field] = trade[field];
        }

        try {
            const query = await db
                .collection('trades')
                .updateOne(mongoQuery, { $set: updateQuery });

            const [ lookup ] = await db
                .collection('trades')
                .find(mongoQuery)
                .toArray()

            return httpResponse({ statusCode: 200, data: lookup });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function deleteTrade ({ _tradeId }) {
        const db = await database; 
        const mongoQuery = { _id: ObjectID(_tradeId) };

        try {
            const query = await db
                .collection('trades')
                .remove(mongoQuery)

            return httpResponse({ statusCode: 200, data: 'deleted' });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = strategyService;