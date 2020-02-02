const strategyValidator = require('../validators/strategy');
const makeStrategy = require('./strategy-model')({ validator: strategyValidator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function strategyService ({ database }) {
    return Object.freeze({
        addStrategy,
        getStrategies,
        updateStrategy,
        deleteStrategy
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

    async function deleteStrategy ({ _strategyId }) {
        const db = await database; 
        const mongoQuery = { _id: ObjectID(_strategyId) };

        try {
            const query = await db
                .collection('strategy')
                .remove(mongoQuery)

            return httpResponse({ statusCode: 200, data: 'deleted' });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = strategyService;