const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const questionService = require('./question.service');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/list/user/:id', authorize(), getByUserId);
router.get('/list/tutor/:id', authorize(), getByTutorId);
router.get('/tutor/unbidded/:id', authorize(), getByTutorIdUnbidded);
router.post('/category', authorize(), getByCategory);
router.post('/zoom-signature', getZooomSignature);
router.post('/file-upload', upload.single('file'), fileUpload);

router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    questionService.getAll()
        .then(questions => res.json(questions))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own question and admins can get any question
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    questionService.getById(req.params.id)
        .then(question => question ? res.json(question) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {

    questionService.getByUserId(req.params.id)
        .then(question => question ? res.json(question) : res.sendStatus(404))
        .catch(next);
}

function getByTutorId(req, res, next) {

    questionService.getByTutorId(req.params.id)
        .then(question => question ? res.json(question) : res.sendStatus(404))
        .catch(next);
}

function getByTutorIdUnbidded(req, res, next) {

    questionService.getByTutorIdUnbidded(req.params.id)
        .then(question => question ? res.json(question) : res.sendStatus(404))
        .catch(next);
}

function getByCategory(req, res, next) {
    questionService.getByCategory(req.body)
        .then(question => res.json(question))
        .catch(next);
}

function getZooomSignature(req, res, next) {
    questionService.getZooomSignature(req.body)
        .then(signature => res.json(signature))
        .catch(next);
}

async function fileUpload(req, res, next) {

    let response = await questionService.fileUpload(req.file)
        .then(response => { return response; })
        .catch(next);

    // Delete the file like normal
    await unlinkAsync(req.file.path)
    res.json(response);
}

function createSchema(req, res, next) {

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        user_id: Joi.required(),
        category: Joi.number().required(),
        status: Joi.string().required(),
        budget: Joi.number().required(), 
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    questionService.create(req.body)
        .then(question => res.json(question))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own question and admins can update any question
    
    questionService.update(req.params.id, req.body)
        .then(question => res.json(question))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own question and admins can delete any question
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    questionService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
