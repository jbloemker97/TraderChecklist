const ObjectID = require('mongodb').ObjectID;

function makeChecklist ({ validator }) {
    return ({ 
        _strategyId,
        name,
        fields
    }) => {
        const checklist = validator({ _strategyId, name, fields });
        if (!checklist) throw Error('Checklist is not valid');

        return {
            _strategyId: ObjectID(_strategyId),
            name,
            fields
        }
    }
}

module.exports = makeChecklist;