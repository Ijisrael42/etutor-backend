const db = require('_helpers/db');

module.exports = {
    getAll,
    getAllActive,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const fields = await db.Field.find();
    return fields.map(x => basicDetails(x));
}

async function getAllActive() {
    const fields = await db.Field.find({ status: "Enabled"});
    return fields.map(x => basicDetails(x));
}

async function getById(id) {
    const field = await getField(id);
    return basicDetails(field);
}

async function create(params) {

    const field = new db.Field(params);
    field.verified = Date.now();

    await field.save();

    return basicDetails(field);
}

async function update(id, params) {
    const field = await getField(id);

    // copy params to field and save
    Object.assign(field, params);
    field.updated = Date.now();
    await field.save();

    return basicDetails(field);
}

async function _delete(id) {
    const field = await getField(id);
    await field.remove();
}

// helper functions

async function getField(id) {
    if (!db.isValidId(id)) throw 'Field not found';
    const field = await db.Field.findById(id);
    if (!field) throw 'Field not found';
    return field;
}

function basicDetails(field) {
    const { id, name, status } = field;
    return { id, name, status };
}