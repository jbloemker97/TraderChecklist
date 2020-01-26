const validator = require('../validators/strategy');
const makeUser = require('./strategy-model')({ validator });
const httpResponse = require('../helpers/http-response');

function strategyService ({ database }) {
    return Object.freeze({
        getStrategy
    });

    async function getStrategy () {

    }

    
}

module.exports = strategyService;