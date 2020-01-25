const mongodb = require('mongodb');
const { mongoURI } = require('../../config/');

async function makeDb () {
    const MongoClient = mongodb.MongoClient;
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();
    const dbName = 'TraderChecklist';
    const db = await client.db(dbName);
    
    return db
}

module.exports = makeDb;