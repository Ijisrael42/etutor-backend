const config = require('config.json');
const db = require('_helpers/db');
const accountService = require('../accounts/account.service');

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
    const tokens = await db.Token.find();
    return tokens.map(x => basicDetails(x));
}

async function getById(id) {
    const token = await getToken(id);
    return basicDetails(token);
}

async function getByUserId(user_id) {
    const tokens = await db.Token.find({ user_id: user_id });
    return tokens; //basicDetails(token);
}

async function getByTutorId(id) {
    const tokens = await db.Token.find( { tutor_id: id } );
    return tokens; //basicDetails(token);
}

async function getByCategory(category) {
    const tokens = await db.Token.find( { category: { $in: category } } );
    return tokens; //basicDetails(token);
}

async function getByQuestionId(id) {
    const tokens = await db.Token.find( { question_id: id } );
    return tokens; //basicDetails(token);
}

async function create(params) {

    const token = new db.Token(params);

    // save token
    await token.save();
    return basicDetails(token); 
}

async function update(id, params) {
    const token = await getToken(id);

    // copy params to token and save
    Object.assign(token, params);
    token.updated = Date.now();
    await token.save();

    return basicDetails(token);
}

async function _delete(id) {
    const token = await getToken(id);
    await token.remove();
}

// helper functions

async function getToken(id) {
    if (!db.isValidId(id)) throw 'Token not found';
    const token = await db.Token.findById(id);
    if (!token) throw 'Token not found';
    return token;
}

function basicDetails(token) {
    const { id, question_id, question_title, tuttor_name, tutor_id, price, status, signature } = token;
    return { id, question_id, question_title, tuttor_name, tutor_id, price, status, signature };
}
