const Joi = require('joi');

function validateStrategy ({ name, description, author, categories, tradeFrequency, price }) {
    const schema = Joi.object().keys({
        name: Joi.string().allow(null).default(null),
        description: Joi.string().allow(null).default(null),
        author: Joi.string().allow(null).default(null),
        categories: Joi.array().items(Joi.string()).allow(null).default(null),
        tradeFrequency: Joi.string().allow(null).default(null),
        price: Joi.number().default(null).allow(null)
    }); 

    const { error } = Joi.validate({ name, description, author, categories, tradeFrequency, price }, schema);
    if (error) throw Error(error.message);

    return {
        date: new Date(Date.now()).toISOString(),
        name, 
        description, 
        author, 
        categories, 
        tradeFrequency, 
        price 
    }
}

module.exports = validateStrategy;