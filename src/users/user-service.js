const validator = require('../validators/user');
const makeUser = require('./user-model')({ validator });
const httpResponse = require('../helpers/http-response');
const { hash } = require('../helpers/bcrypt');

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
        const db = await database;
        const user = await makeUser({ email, password, name, bio, subscription, isAdmin });

        // Hash Password
        user.password = await hash(user.password);

        try {
            // Lookup email
            const [ lookup ] = await db
                .collection('users')
                .find({ email: user.email })
                .toArray();

            // Exit if email is found
            if (lookup) return httpResponse({ statusCode: 401, data: 'Email is already registered' });

            const query = await db  
                .collection('users')
                .insertOne(user);

            // Don't return password to client
            delete user.password;

            return httpResponse({ statusCode: 200, data: user });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = userService;