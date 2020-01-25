const validator = require('../validators/user');
const makeUser = require('./user-model')({ validator });
const httpResponse = require('../helpers/http-response');
const { hash, compare } = require('../helpers/bcrypt');
const { sign } = require('../helpers/jwt');

function userService ({ database }) {
    return Object.freeze({
        getUser,
        addUser,
        login
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

    async function login ({ email, password }) {
        const db = await database;
        const [ query ] = await db
                .collection('users')
                .find({ email })
                .toArray();

        if (!query) return httpResponse({ statusCode: 401, data: 'Email is not registered' });

        const isValidLogin = await compare(password, query.password);

        if (!isValidLogin) return httpResponse({ statusCode: 401, data: 'Received invalid email/password' }); 

        // Remove password
        delete query.password;

        // Create jwt token
        const token = sign(query.email);
        const headers = {
            authorization: token
        };

        return httpResponse({ statusCode: 200, data: query, headers });
    }

    async function addUser ({ email, password, confirmPassword, name, bio, subscription, isAdmin }) {
        const db = await database;
        const user = await makeUser({ email, password, name, bio, subscription, isAdmin });

        // Confirm passwords match
        if (password !== confirmPassword) return httpResponse({ statusCode: 401, data: 'Passwords do not match' }); 

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

            // Create jwt token
            const token = sign(user.email);
            const headers = {
                authorization: token
            };

            return httpResponse({ statusCode: 200, data: user, headers });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
}

module.exports = userService;