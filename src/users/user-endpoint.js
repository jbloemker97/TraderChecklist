const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const user = require('./user-service')({ database });

async function handleUserRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'GET':
            return await user.getUser({ email: httpRequest.body.email });

        case 'POST':
            return await user.addUser({ email: httpRequest.body.email, password: httpRequest.body.password, name: httpRequest.body.name, bio: httpRequest.body.bio, subscription: httpRequest.body.subscription, isAdmin: httpRequest.body.isAdmin });

        case 'PUT':
            return true;

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

module.exports = handleUserRequest;