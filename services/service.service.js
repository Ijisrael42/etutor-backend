const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const accounts = await db.Service.find();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getService(id);
    return basicDetails(account);
}

async function create(params) {

    const account = new db.Service(params);
    account.verified = Date.now();

    await account.save();

    return basicDetails(account);
}

async function update(id, params) {
    const account = await getService(id);

    // copy params to account and save
    Object.assign(account, params);
    account.updated = Date.now();
    await account.save();

    return basicDetails(account);
}

async function _delete(id) {
    const account = await getService(id);
    await account.remove();
}

// helper functions

async function getService(id) {
    if (!db.isValidId(id)) throw 'Service not found';
    const account = await db.Service.findById(id);
    if (!account) throw 'Service not found';
    return account;
}

function basicDetails(account) {
    const { id, name } = account;
    return { id, name };
}