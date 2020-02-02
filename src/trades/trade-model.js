const ObjectID = require('mongodb').ObjectID;

function makeTrade ({ validator }) {
    return ({ 
        _strategyId,
        type,
        entry,
        exit,
        profitable
    }) => {
        const trade = validator({ _strategyId, type, entry, exit, profitable });
        if (!trade) throw Error('Trade is not valid');

        return {
            _strategyId: ObjectID(_strategyId) || null,
            date: new Date(Date.now()).toISOString(),
            ...trade
        }
    }
}

module.exports = makeTrade;