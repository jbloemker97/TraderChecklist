const validator = require('../validators/strategy');
const makeStrategy = require('./strategy-model')({ validator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function strategyService ({ database }) {
    return Object.freeze({
        addStrategy,
        getStrategies
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
}

module.exports = strategyService;