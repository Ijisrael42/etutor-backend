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
    const services = await db.Service.find();
    return services.map(x => basicDetails(x));
}

async function getAllActive() {
    const services = await db.Service.find({ status: "Enabled"});
    return services.map(x => basicDetails(x));
}

async function getById(id) {
    const service = await getService(id);
    return basicDetails(service);
}

async function create(params) {

    const service = new db.Service(params);
    service.verified = Date.now();

    await service.save();

    return basicDetails(service);
}

async function update(id, params) {
    const service = await getService(id);

    // copy params to service and save
    Object.assign(service, params);
    service.updated = Date.now();
    await service.save();

    return basicDetails(service);
}

async function _delete(id) {
    const service = await getService(id);
    await service.remove();
}

// helper functions

async function getService(id) {
    if (!db.isValidId(id)) throw 'Service not found';
    const service = await db.Service.findById(id);
    if (!service) throw 'Service not found';
    return service;
}

function basicDetails(service) {
    const { id, name, status, category } = service;
    return { id, name, status, category };
}