const strategyValidator = require('../validators/strategy');
const makeStrategy = require('./strategy-model')({ validator: strategyValidator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function strategyService ({ database }) {
    return Object.freeze({
        addStrategy,
        getStrategies,
        updateStrategy
    });

    async function getStrategies ({ filter, orderby }) {
        const db = await database;
        let mongoQuery = filter || {};
        let order = orderby || { name: 1 };

        // Parse mongo id
        if (mongoQuery.id) {
            mongoQuery._id = ObjectID(mongoQuery.id);
            delete mongoQuery.id;
        }

        try {

            const query  = await db  
                .collection('strategy')
                .find(mongoQuery, order)
                .sort(order)
                .toArray()

            return httpResponse({ statusCode: 200, data: query });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function addStrategy ({ name, description, author, categories, tradeFrequency, price }) {
        const db = await database;
        const strategy = makeStrategy({ name, description, author, categories, tradeFrequency, price });

        try {
            // Confirm no other strategy exists with the same name
            const [ lookup ] = await db 
                .collection('strategy')
                .find({ name })
                .toArray()

            // If strategy already exists, error
            if (lookup) return httpResponse({ statusCode: 401, data: 'Strategy name already taken' });

            const query = await db
                .collection('strategy')
                .insertOne(strategy)

            return httpResponse({ statusCode: 200, data: strategy });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function updateStrategy ({ id, name, description, categories, tradeFrequency, price }) {
        const db = await database;
        const strategy = makeStrategy({ name, description, author: null, categories, tradeFrequency, price });
        const mongoQuery = { _id: ObjectID(id) };
        const updateData = {};

        if (strategy.name) updateData.name = strategy.name;
        if (strategy.description) updateData.description = strategy.description;
        if (strategy.categories) updateData.categories = strategy.categories;
        if (strategy.tradeFrequency) updateData.tradeFrequency = strategy.tradeFrequency;
        if (strategy.price) updateData.price = strategy.price;

        try {
            const update = await db
                .collection('strategy')
                .updateOne(mongoQuery, { $set: updateData })

            const [ query ] = await db 
                .collection('strategy')
                .find(mongoQuery)
                .toArray();

            return httpResponse({ statusCode: 200, data: query });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function addTrade ({ strategyId, type, entry, exit, profitable }) {
        const db = await database;
        const id = ObjectID();
        const trade = makeTrade({ id, type, entry, exit, profitable });
        const mongoQuery = { _id: ObjectID(strategyId) };

        try {
            const query = await db
                .collection('strategy')
                .updateOne(mongoQuery, {
                    $push: {
                        trades: trade
                    } 
                })

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
                .collection('strategy')
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