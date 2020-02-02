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
            _strategyId
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
            console.log(error)
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
        const db = await database;
        const trade = makeTrade({ id: tradeId, type, entry, exit, profitable });
        const updateQuery = {};
        const mongoQuery = {
            _id: ObjectID(strategyId),
            'trades._id': ObjectID(tradeId)  
        };

        if (trade.type) updateQuery.type = trade.type;
        if (trade.entry && trade.entry.date) updateQuery.entry.date = trade.entry.date;
        if (trade.entry && trade.entry.price) updateQuery.entry.price = trade.entry.price;
        if (trade.entry && trade.entry.contract) updateQuery.entry.contract = trade.entry.contract;
        if (trade.exit && trade.exit.date) updateQuery.exit.date = trade.exit.date;
        if (trade.exit && trade.exit.price) updateQuery.exit.price = trade.exit.price;
        if (trade.exit && trade.profitable) updateQuery.profitable = trade.profitable;
        if (trade.profitable) updateQuery.profitable = trade.profitable;

        console.log(updateQuery);
        
        try {
            // const update = await db
            //     .collection('strategy')
            //     .updateOne(mongoQuery, { $set: { trades: updateQuery } });

            const [ query ] = await db
                .collection('trades')
                .find(mongoQuery)
                .toArray() 

            console.log(query)

            return httpResponse({ statusCode: 200, data: 'success' });


        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = strategyService;