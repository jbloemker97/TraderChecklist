const checklistValidator = require('../validators/checklist');
const makeChecklist = require('./checklist-model')({ validator: checklistValidator });
const httpResponse = require('../helpers/http-response');
const ObjectID = require('mongodb').ObjectID;

function checklistService ({ database }) {
    return Object.freeze({
       addChecklist,
       removeChecklistItem
    });

    async function addChecklist ({ _strategyId, name, fields }) {
        // Add ID to fields
        for (let i = 0; i < fields.length; i++) {
            fields[i]['_id'] = ObjectID();
        }

        const db = await database;
        const checklist = makeChecklist({ _strategyId, name, fields });

        try {
            const query = await db
                .collection('checklist')
                .insertOne(checklist)

            return httpResponse({ statusCode: 200, data: checklist });

        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }

    async function removeChecklistItem ({ _fieldId }) {
        const db = await database;
        let mongoQuery = { 'fields._id': ObjectID(_fieldId) };

        try {
            const update = await db
                .collection('checklist')
                .updateOne(mongoQuery, { $pull: {
                    'fields': { _id: ObjectID(_fieldId) } 
                } });

            return httpResponse({ statusCode: 200, data: 'Deleted' });
        }catch (error) {
            return httpResponse({ statusCode: 404, data: error.message });
        }
    }
    
}

module.exports = checklistService;