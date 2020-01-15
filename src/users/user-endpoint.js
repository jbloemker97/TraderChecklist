const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const db = makeDb();
const user = require('./user-service')({ db });

function handleUserRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'GET':
            return user.getUser({ email: httpRequest.body.email });

        case 'POST':
            return user.addUser({ email, password, name, bio, subscription, isAdmin });

        case 'PUT':
            return true;

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

module.exports = handleUserRequest;