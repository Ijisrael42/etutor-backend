const config = require('config.json');
const db = require('_helpers/db');
const fetch = require("node-fetch");
const sendNotification = require('_helpers/send-email');

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByTutorId,
    getByCategory,
    getByQuestionId,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const bids = await db.Bid.find();
    return bids.map(x => basicDetails(x));
}

async function getById(id) {
    const bid = await getBid(id);
    return basicDetails(bid);
}

async function getByUserId(user_id) {
    const bids = await db.Bid.find({ user_id: user_id });
    return bids; //basicDetails(bid);
}

async function getByTutorId(id) {
    const bids = await db.Bid.find( { tutor_id: id } );
    return bids; //basicDetails(bid);
}

async function getByCategory(category) {
    const bids = await db.Bid.find( { category: { $in: category } } );
    return bids; //basicDetails(bid);
}

async function getByQuestionId(id) {
    const bids = await db.Bid.find( { question_id: id } );
    return bids; //basicDetails(bid);
}

async function create(params) {

    if (await db.Bid.findOne({ tutor_id: params.tutor_id, question_id: params.question_id })) {
        throw 'Bid for question already exists';
    }

    const bid = new db.Bid(params);

    // save bid
    await bid.save();

    sendBid(params.question_id);
    return basicDetails(bid); 
}

async function sendBid(question_id)
{
    const msg = 'New question to attend to.';
    const title = 'Qestion Post';
    let res = [];
    let tokens = [];
    const question = await db.Question.findById(question_id);
    const account = await db.Account.findById(question.user_id);

    if( account.device_token != '' ) 
        res = await sendNotification(msg, title, account.device_token, account.id);

    return res;
}

async function update(id, params) {
    const bid = await getBid(id);

    // copy params to bid and save
    Object.assign(bid, params);
    bid.updated = Date.now();
    await bid.save();

    return basicDetails(bid);
}

async function _delete(id) {
    const bid = await getBid(id);
    await bid.remove();
}

// helper functions

async function getBid(id) {
    if (!db.isValidId(id)) throw 'Bid not found';
    const bid = await db.Bid.findById(id);
    if (!bid) throw 'Bid not found';
    return bid;
}

function basicDetails(bid) {
    const { id, question_id, question_title, tuttor_name, tutor_id, price, status, signature } = bid;
    return { id, question_id, question_title, tuttor_name, tutor_id, price, status, signature };
}
