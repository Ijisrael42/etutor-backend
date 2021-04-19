const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const tokenService = require('./token.service');

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/list/:user_id', authorize(), getByUserId);
router.get('/tutor-list/:id', authorize(), getByTutorId);
router.get('/question/:id', authorize(), getByQuestionId);

router.post('/category', authorize(), getByCategory);
router.post('/', create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    tokenService.getAll()
        .then(tokens => res.json(tokens))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own token and admins can get any token
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    tokenService.getById(req.params.id)
        .then(token => token ? res.json(token) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {

    tokenService.getByUserId(req.params.user_id)
        .then(token => token ? res.json(token) : res.sendStatus(404))
        .catch(next);
}

function getByTutorId(req, res, next) {

    tokenService.getByTutorId(req.params.id)
        .then(token => token ? res.json(token) : res.sendStatus(404))
        .catch(next);
}

function getByQuestionId(req, res, next) {

    tokenService.getByQuestionId(req.params.id)
        .then(token => token ? res.json(token) : res.sendStatus(404))
        .catch(next);
}

function getByCategory(req, res, next) {
    tokenService.getByCategory(req.body)
        .then(token => res.json(token))
        .catch(next);
}


function create(req, res, next) {
    tokenService.create(req.body)
        .then(token => res.json(token))
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

    tokenService.update(req.params.id, req.body)
        .then(token => res.json(token))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own token and admins can delete any token
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    tokenService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
