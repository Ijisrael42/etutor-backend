const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const requests = await db.Request.find();// db.Request.find({ user_id: user_id});
    return requests.map(x => basicDetails(x));
}

async function getItems(id) {
    const requests = await db.RequestItem.find({ request_id: id});
    return requests.map(x => basicItemDetails(x));
}

async function getById(id) {
    const request = await getRequest(id);
    const items = await getItems(id);
    return { ...basicDetails(request), products: items};
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
    const { id, supplier_name, supplier_id, user_id } = request;
    return { id, supplier_name, supplier_id, user_id };
}

function basicItemDetails(request) {
    const { id, price, product_id, product_name, quantity } = request;
    return { id, price, product_id, product_name, quantity };
}