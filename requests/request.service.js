const db = require('_helpers/db');
const sendNotification = require('_helpers/send-notification');
const accountService = require('accounts/account.service');

module.exports = {
    getAll,
    getByUserId,
    getBySupplierId,
    getBySupplierStatusId,
    getByParams,
    getById,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const requests = await db.Request.find().sort({ created: -1});
    return requests.map(x => basicDetails(x));
}

async function getByUserId(id) {
    const requests = await db.Request.find({ user_id: id}).sort({ created: -1});
    return requests.map(x => basicDetails(x));
}

async function getBySupplierId(id) {
    const requests = await db.Request.find({ supplier_id: id}).sort({ created: -1});
    return requests.map(x => basicDetails(x));
}

async function getBySupplierStatusId(params) {
    const requests = await db.Request.find({ supplier_id: params.id, status: params.status}).sort({ created: -1});
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

async function getByParams(params) {
    const requests = await db.Request.find(params);
    return requests.map(x => basicDetails(x));
}

async function create(params) {

    const request = new db.Request(params);
    let requestItem = {};
    const msg = 'Service Request has been sent to you, please accept request from the Customer';
    const title = 'Accept Service Request';
    const account = await db.Account.find( {  supplier: request.supplier_id } );

    request.verified = Date.now();

    await request.save();
    
    params.products.forEach(product => {
        requestItem = new db.RequestItem({...product, request_id: request.id});
        requestItem.save();
    });


    if( account.device_token != '' ) 
        res = sendNotification(msg, title, account.device_token, account.id);
    else {} // Send an email notifying the Tutor about the notification.

    return basicDetails(request);
}

async function update(id, params) {
    const request = await getRequest(id);

    if( params.status !== '') {

        let msg = '';
        let title = '';
        // const account = accountService.getById(request.user_id);
        const account = await db.Account.findById(request.user_id);

        if( params.status === 'Accepted') {
            msg = 'Your Service Request has been Accepted!!';
            title = 'Service Request Accepted';
        }
        else if( params.status === 'Completed') {
            msg = 'Your Service Request has been Completed!! Rate your Service Provider';
            title = 'Service Request Completed';
        }

        if( account.device_token ) {

            res = sendNotification(msg, title, account.device_token, account.id, `/request/${id}`);
            // console.log("sent!!");
        }
        else {} // Send an email notifying the Tutor about the notification.

    }

    // copy params to request and save
    Object.assign(request, params);
    request.updated = Date.now();
    await request.save();

    const response = await getById(id);
    return response;
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
    const { id, supplier_name, supplier_id, supplier_comment, supplier_rating_customer, customer_comment, customer_rating_supplier, user_id, total, status, created } = request;
    return { id, supplier_name, supplier_id, supplier_comment, supplier_rating_customer, customer_comment, customer_rating_supplier, user_id, total, status, created };
}

function basicItemDetails(request) {
    const { id, price, product_id, product_name, quantity } = request;
    return { id, price, product_id, product_name, quantity };
}