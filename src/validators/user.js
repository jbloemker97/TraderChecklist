const Joi = require('joi');

function validateUser ({ email, password, name, bio, subscription, isAdmin, isBestSeller, strategiesOwned, strategiesPublished }) {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(), 
        password: Joi.string().allow(null).default(null), 
        name: Joi.string().allow(null).default(null), 
        bio: Joi.string().allow(null).default(null), 
        subscription: Joi.string().allow(null).default(null), 
        isAdmin: Joi.boolean().default(false), 
        isBestSeller: Joi.boolean().default(false), 
        strategiesOwned: Joi.array().allow(null).default(null), 
        strategiesPublished: Joi.array().allow(null).default(null)
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

module.exports = validateUser;