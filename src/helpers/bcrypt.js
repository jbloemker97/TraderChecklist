const bcrypt = require('bcryptjs');

async function hash (string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(string, salt);
}

async function compare (reqPassword, databasePassword) {
    const result = await bcrypt.compare(reqPassword, databasePassword);

    return result;
}

module.exports = {
    hash,
    compare
};