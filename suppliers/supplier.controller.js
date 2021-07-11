const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const supplierService = require('./supplier.service');

// routes
router.get('/', getAll);//, authorize(Role.Admin)
router.get('/active', getAllActive);
router.get('/:id' , getById);
router.post('/params' , getByParams);
router.get('/supplier/:id' , getBySupplierId);
router.post('/', authorize(), createSchema, create);
router.put('/:id', update);
// router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    supplierService.getAll()
        .then(suppliers => res.json(suppliers))
        .catch(next);
}

function getAllActive(req, res, next) {
    supplierService.getAllActive()
        .then(suppliers => res.json(suppliers))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own supplier and admins can get any supplier
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    supplierService.getById(req.params.id)
        .then(supplier => supplier ? res.json(supplier) : res.sendStatus(404))
        .catch(next);
}

function getBySupplierId(req, res, next) {
 
    supplierService.getBySupplierId(req.params.id)
        .then(supplier => supplier ? res.json(supplier) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        // idpassport_no: Joi.string().required(),
        contact_no: Joi.string().required(),
        address: Joi.string().required(),
        category: Joi.string().required(),
        documents: Joi.string().required(),
        // category: Joi.array().items(Joi.number()).required(),
        application_status: Joi.string().required(),
        experience: Joi.number().required(),    
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    supplierService.create(req.body)
        .then(supplier => res.json(supplier))
        .catch(next);
}

function getByParams(req, res, next) {
    supplierService.getByParams(req.body)
        .then(supplier => res.json(supplier))
        .catch(next);
}

/* function updateSchema(req, res, next) {
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
} */

function update(req, res, next) {
    // users can update their own supplier and admins can update any supplier
/*     if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 */
    supplierService.update(req.params.id, req.body)
        .then(supplier => res.json(supplier))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own supplier and admins can delete any supplier
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    supplierService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
