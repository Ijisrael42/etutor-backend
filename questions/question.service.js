const config = require('config.json');
const db = require('_helpers/db');
const accountService = require('../accounts/account.service');
const applicationService = require('../applications/application.service');
const crypto = require("crypto");
const fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const fs = require('fs');
var rp = require('request-promise');

module.exports = {
    getAll,
    getById,
    getByUserId,
    getByTutorId,
    getByTutorIdUnbidded,    
    getByCategory,
    getZooomSignature,
    fileUpload,
    create,
    update,
    delete: _delete,
};

async function getAll() {
    const questions = await db.Question.find();
    return questions.map(x => basicDetails(x));
}

async function getById(id) {
    const question = await getQuestion(id);
    return basicDetails(question);
}

async function getByUserId(user_id) {
    const questions = await db.Question.find({ user_id: user_id });
    return questions; //basicDetails(question);
}

async function getByTutorId(id) {
    const { tutor_id } = accountService.getWithTutorId(id);
    const app = applicationService.getById(tutor_id);
    // const questions = await db.Question.find( { category: { $in: category } } );
    return app; //basicDetails(question);
}

async function getByTutorIdUnbidded(id) {
    const bids = await db.Bid.find({ tutor_id: id });
    let questions = [];

    if( bids.length ){
        const questionIds = bids.map( bid => bid.question_id );
        questions = await db.Question.find( { tutor_id: id , id: { $nin : questionIds } } );
    }

    return questions; //basicDetails(question);
}

async function getByCategory(category) {
    const questions = await db.Question.find( { category: { $in: category } } );
    return questions; //basicDetails(question);
}

async function getZooomSignature(params) {
    const email = "ijisrael42@gmail.com";
    const reqBody = {
        "method": "POST",
        "headers": { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + generateZoomJWT()
        },
        "body": JSON.stringify(config.zoomMeetingCred)
    };

    const fetchResponse = await fetch("https://api.zoom.us/v2/users/"+ email +"/meetings", reqBody );
    const data = await fetchResponse.json();

    const { zoomApiKey, zoomApiSecret } = config;
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from( zoomApiKey + data.id + timestamp + params.role).toString('base64');
    const hash = crypto.createHmac('sha256', zoomApiSecret ).update(msg).digest('base64');
    signature = Buffer.from(`${zoomApiKey}.${data.id}.${timestamp}.${params.role}.${hash}`).toString('base64');

    return { meetingNumber: data.id, signature: signature, apiKey: zoomApiKey };
}

async function fileUpload(file) {

    var options = { 
        method: 'POST', uri: `${config.file_path}/index.php`,
        formData: {
            file: { value: fs.createReadStream(file.path), options: { filename: file.originalname, contentType: file.mimetype } }
        },
        transform: function (body, response) {
            if (response.headers['content-type'].indexOf('application/json') != -1 ) return JSON.parse(body);
            else if (response.headers['content-type'].indexOf('text/html') != -1 ) return $.load(body);
            else return body;
        }  
    };
    
    var reprp = rp(options)
    .then(function (body) { return body; })
    .catch(function (err) { return err; });
    
    return reprp;
}

function generateZoomJWT() {

    const payload = {
        iss: config.zoomApiKey,
        exp: ((new Date()).getTime() + 5000)
    };

    token = jwt.sign(payload, config.zoomApiSecret);
    return token;
}

async function create(params) {
    const question = new db.Question(params);

    // save question
    await question.save();
    return basicDetails(question);
}

async function update(id, params) {
    const question = await getQuestion(id);

    // copy params to question and save
    Object.assign(question, params);
    question.updated = Date.now();
    await question.save();

    return basicDetails(question);
}

async function _delete(id) {
    const question = await getQuestion(id);
    await question.remove();
}

// helper functions

async function getQuestion(id) {
    if (!db.isValidId(id)) throw 'Question not found';
    const question = await db.Question.findById(id);
    if (!question) throw 'Question not found';
    return question;
}

function basicDetails(question) {
    const { id, title, description, user_id, category, budget, status, image_name, image_url } = question;
    return { id, title, description, user_id, category, budget, status, image_name, image_url };
}
