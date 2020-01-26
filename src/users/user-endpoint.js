const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const user = require('./user-service')({ database });

async function handleUserRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'GET':
            return await user.getUser({ email: httpRequest.body.email });

        case 'POST':
            const requestType = determineRequest(httpRequest);

            // Determine if request is to login or register
            if (requestType === 'REGISTER') {
                return await user.addUser({ email: httpRequest.body.email, password: httpRequest.body.password, confirmPassword: httpRequest.body.confirmPassword, name: httpRequest.body.name, bio: httpRequest.body.bio, subscription: httpRequest.body.subscription, isAdmin: httpRequest.body.isAdmin });
            }else if (requestType === 'LOGIN') {
                return await user.login({ email: httpRequest.body.email, password: httpRequest.body.password });
            }
            break;

        case 'PUT':
            return await user.updateUser({ email: httpRequest.body.email, password: httpRequest.body.password, confirmPassword: httpRequest.body.confirmPassword, name: httpRequest.body.name, bio: httpRequest.body.bio, subscription: httpRequest.body.subscription, isAdmin: httpRequest.body.isAdmin, isBestSeller: httpRequest.body.isBestSeller, strategiesOwned: httpRequest.body.strategiesOwned, strategiesPublished: httpRequest.body.strategiesPublished });

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

function determineRequest (httpRequest) {
    switch (httpRequest.method) {
        case 'POST':
            return (httpRequest.body.password && httpRequest.body.confirmPassword) ? 'REGISTER' : 'LOGIN';
    }
}

module.exports = handleUserRequest;