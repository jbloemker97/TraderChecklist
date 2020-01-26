const Joi = require('joi');

function validateStrategy ({ email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished }) {
    const schema = Joi.object().keys({
        name: Joi.string().allow(null).default(null),
        description: Joi.string().allow(null).default(null),
        author: Joi.string().allow(null).default(null),
        categories: Joi.array().items(Joi.string).allow(null).default(null),
        tradeFrequency: Joi.string().allow(null).default(null),
        price: Joi.number().default(null).allow(null),
        performance: Joi.object().keys({
            winningPercent: Joi.number().allow(null).default(null),
            winners: Joi.number().allow(null).default(null),
            losers: Joi.number().allow(null).default(null),
            averageWinner: Joi.number().allow(null).default(null),
            averageLoser: Joi.number().allow(null).default(null),
            watchList: Joi.array(Joi.items(Joi.object().keys({
                symbol: Joi.string().allow(null).default(null),
                notes: Joi.string().allow(null).default(null),
                entryChecklist: Joi.object().keys({
                    fields: Joi.array(Joi.items(Joi.object().keys({
                        name: Joi.string().allow(null).default(null),
                        isChecked: Joi.boolean().default(false)
                    }))).allow(null).default(null)
                }).allow(null).default(null)
            }))).allow(null).default(null),
            trades: Joi.array(Joi.items(Joi.object().keys({
                type: Joi.string().allow(null).default(null),
                entry: Joi.object().keys({
                    date: Joi.date().allow(null).default(null),
                    price: Joi.number().allow(null).default(null),
                    contract: Joi.string().allow(null).default(null)
                }).allow(null).default(null),
                exit: Joi.object().keys({
                    date: Joi.date().allow(null).default(null),
                    price: Joi.number().allow(null).default(null),
                }).allow(null).default(null),
            }))).allow(null).default(null),
            return: Joi.number().allow(null).default(null)
        }).allow(null).default(null)
    }); 

    const { error } = Joi.validate({ email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished }, schema);
    if (error) throw Error(error.message);

    return {
        email, 
        password, 
        name, 
        bio, 
        subscription, 
        isAdmin, 
        isBestSeller, 
        strategiesOwned, 
        strategiesPublished
    }
}

module.exports = validateStrategy;