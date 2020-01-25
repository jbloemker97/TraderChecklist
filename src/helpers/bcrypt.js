const bcrypt = require('bcryptjs');

async function hash (string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(string, salt);
}

module.exports = {
    hash
};