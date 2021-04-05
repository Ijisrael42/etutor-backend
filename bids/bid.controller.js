const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const bidService = require('./bid.service');

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(), getById);
router.get('/list/:user_id', authorize(), getByUserId);
router.get('/tutor-list/:id', authorize(), getByTutorId);
router.get('/question/:id', authorize(), getByQuestionId);

router.post('/category', authorize(), getByCategory);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    bidService.getAll()
        .then(bids => res.json(bids))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own bid and admins can get any bid
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    bidService.getById(req.params.id)
        .then(bid => bid ? res.json(bid) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {

    bidService.getByUserId(req.params.user_id)
        .then(bid => bid ? res.json(bid) : res.sendStatus(404))
        .catch(next);
}

function getByTutorId(req, res, next) {

    bidService.getByTutorId(req.params.id)
        .then(bid => bid ? res.json(bid) : res.sendStatus(404))
        .catch(next);
}

function getByQuestionId(req, res, next) {

    bidService.getByQuestionId(req.params.id)
        .then(bid => bid ? res.json(bid) : res.sendStatus(404))
        .catch(next);
}

function getByCategory(req, res, next) {
    bidService.getByCategory(req.body)
        .then(bid => res.json(bid))
        .catch(next);
}

function createSchema(req, res, next) {

    const schema = Joi.object({
        question_id: Joi.required(),
        tutor_id: Joi.required(),
        tutor_name: Joi.string().required(),
        question_title: Joi.string().required(),
        tutor_id: Joi.required(),
        status: Joi.string().required(),
        price: Joi.number().required(), 
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    bidService.create(req.body)
        .then(bid => res.json(bid))
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
    // users can update their own bid and admins can update any bid
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    bidService.update(req.params.id, req.body)
        .then(bid => res.json(bid))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own bid and admins can delete any bid
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    bidService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
