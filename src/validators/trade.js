const Joi = require('joi');

function validateTrade ({ _strategyId, type, entry, exit, profitable }) {
    const schema = Joi.object().keys({
        _strategyId: Joi.string().required(),
        type: Joi.string().allow(null).default(null),
        entry: Joi.object().keys({
            date: Joi.string().allow(null).default(null),
            price: Joi.number().allow(null).default(null),
            contract: Joi.string().allow(null).default(null)
        }).allow(null).default(null),   
        exit: Joi.object().keys({
            date: Joi.string().allow(null).default(null),
            price: Joi.number().allow(null).default(null),
        }).allow(null).default(null),
        profitable: Joi.bool().default(false),
    }); 

    const { error } = Joi.validate({ _strategyId, type, entry, exit, profitable }, schema);
    if (error) throw Error(error.message);

    return {
        _strategyId,
        type, 
        entry, 
        exit,
        profitable
    }
}

module.exports = validateTrade;