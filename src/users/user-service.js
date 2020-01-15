const makeUser = require('./user-model');
const httpResponse = require('../helpers/http-response');

function userService ({ database }) {
    return Object.freeze({
        getUser,
        addUser
    });

    async function getUser ({ email }) {
        const db = await database;
        const mongoQuery = { email };

        try {
            const [ query ] = await db
                .collection('users')
                .find(mongoQuery, { password: 0 }) // Exclude password
                .toArray()

            return httpResponse({ statusCode: 200, data: query });
        }catch (error) {
            throw Error(error.message);
        }
    }

    async function addUser ({ email, password, name, bio, subscription, isAdmin }) {
        const user = makeUser({ email, password, name, bio, subscription, isAdmin });

        try {
            const query = await db  
                .collection('users')
                .insertOne(user);

            return httpResponse({ statusCode: 200, data: user });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = userService;