const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const requests = await db.Request.find();
    return requests.map(x => basicDetails(x));
}

async function getById(id) {
    const request = await getRequest(id);
    return basicDetails(request);
}

async function create(params) {

    const request = new db.Request(params);
    let requestItem = {};
    request.verified = Date.now();

    await request.save();
    
    params.products.forEach(product => {
        requestItem = new db.RequestItem({...product, request_id: request.id});
        requestItem.save();
    });

    return basicDetails(request);
}

async function update(id, params) {
    const request = await getRequest(id);

    // copy params to request and save
    Object.assign(request, params);
    request.updated = Date.now();
    await request.save();

    return basicDetails(request);
}

async function _delete(id) {
    const request = await getRequest(id);
    await request.remove();
}

// helper functions

async function getRequest(id) {
    if (!db.isValidId(id)) throw 'Request not found';
    const request = await db.Request.findById(id);
    if (!request) throw 'Request not found';
    return request;
}

function basicDetails(request) {
    const { id, name } = request;
    return { id, name };
}