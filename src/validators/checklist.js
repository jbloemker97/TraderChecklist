const Joi = require('joi');

function validateChecklist ({ _strategyId, name, fields }) {
    const schema = Joi.object().keys({
        _strategyId: Joi.string(),
        name: Joi.string().allow(null).default(null),
        fields: Joi.array().items(Joi.object().keys({
            _id: Joi.any(),
            name: Joi.string(),
            isChecked: Joi.bool().default(false)
        }))
        
    }); 

    const { error } = Joi.validate({ _strategyId, name, fields }, schema);
    if (error) throw Error(error.message);

    return {
        _strategyId,
        name, 
        fields
    }
}

module.exports = validateChecklist;