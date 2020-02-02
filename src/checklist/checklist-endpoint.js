const httpResponse = require('../helpers/http-response');
const makeDb = require('../db/');
const database = makeDb();
const checklist = require('./checklist-service')({ database });

async function handleChecklistRequest (httpRequest) {
    let requestType;

    switch (httpRequest.method) {
        case 'GET':
            return true;

        case 'POST':           
            return checklist.addChecklist({ _strategyId: httpRequest.pathParams._strategyId, name: httpRequest.body.name, fields: httpRequest.body.fields });

        case 'DELETE':
            return checklist.removeChecklistItem({ _strategyId: httpRequest.pathParams._strategyId, _fieldId: httpRequest.pathParams._fieldId });

        default:
            return httpResponse({ statusCode: 404, data: 'Route not found' });
    }
}

function determineRequest (httpRequest) {
    
}

module.exports = handleChecklistRequest;