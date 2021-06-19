const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const applicationService = require('./application.service');

// routes
router.get('/', getAll);//, authorize(Role.Admin)
router.get('/:id' , getById);
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function getAll(req, res, next) {
    applicationService.getAll()
        .then(applications => res.json(applications))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own application and admins can get any application
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    applicationService.getById(req.params.id)
        .then(application => application ? res.json(application) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        description: Joi.string().required(),
        category: Joi.array().items(Joi.number()).required(),
        status: Joi.string().required(),
        experience: Joi.string().required(),

    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    applicationService.create(req.body)
        .then(application => res.json(application))
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
    // users can update their own application and admins can update any application
/*     if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 */
    applicationService.update(req.params.id, req.body, req.ip)
        .then(application => res.json(application))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own application and admins can delete any application
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    applicationService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
