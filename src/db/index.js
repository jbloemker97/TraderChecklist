const mongodb = require('mongodb');
const { mongoURI } = require('../../config/dev');

async function makeDb (dbName) {
    const MongoClient = mongodb.MongoClient;
    const client = new MongoClient(mongoURI, { useNewUrlParser: true });

    await client.connect();

    const db = await client.db(dbName);
    
    return db
}