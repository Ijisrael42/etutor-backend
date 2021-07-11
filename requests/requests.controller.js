const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const requestsService = require('./request.service');

// routes

router.get('/', getAll);
router.get('/:id', getById);
router.get('/user/:id', getByUserId);
router.get('/supplier/:id', getBySupplierId);
router.get('/supplier/:id/:status', getBySupplierStatusId);
router.post('/params' , getByParams);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    requestsService.getAll()
        .then(requests => res.json(requests))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own request and admins can get any request

    requestsService.getById(req.params.id)
        .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}

function getByUserId(req, res, next) {
    // users can get their own request and admins can get any request

    requestsService.getByUserId(req.params.id)
        .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}

function getBySupplierId(req, res, next) {
    // users can get their own request and admins can get any request

    requestsService.getBySupplierId(req.params.id)
        .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}

function getBySupplierStatusId(req, res, next) {
    // users can get their own request and admins can get any request

    requestsService.getBySupplierStatusId(req.params)
        .then(request => request ? res.json(request) : res.sendStatus(404))
        .catch(next);
}

function getByParams(req, res, next) {
    requestsService.getByParams(req.body)
        .then(request => res.json(request))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User).required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    requestsService.create(req.body)
        .then(request => res.json(request))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schemaRules = {
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
        device_token: Joi.string().empty('')
    };

    // only admins can update role
    if (req.user.role === Role.Admin) {
        schemaRules.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    const schema = Joi.object(schemaRules).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    // users can update their own request and admins can update any request

    requestsService.update(req.params.id, req.body)
        .then(request => res.json(request))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own request and admins can delete any request
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    requestsService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}