const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const vehicleService = require('./vehicle.service');

// routes
router.get('/', getAll);//, authorize(Role.Admin)
router.get('/:id' , getById);
router.get('/supplier/:id' , getBySupplierId);
router.get('/supplier/active/:id' , getAllActiveSupplierId);
router.post('/', authorize(), createSchema, create);
router.put('/:id',  update);
router.delete('/:id',  _delete);

module.exports = router;

function getAll(req, res, next) {
    vehicleService.getAll()
        .then(vehicles => res.json(vehicles))
        .catch(next);
}

function getAllActiveSupplierId(req, res, next) {
    vehicleService.getAllActiveSupplierId(req.params.id)
        .then(services => res.json(services))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own vehicle and admins can get any vehicle
/*     if (req.params.user_id !== req.user.id ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

 */    vehicleService.getById(req.params.id)
        .then(vehicle => vehicle ? res.json(vehicle) : res.sendStatus(404))
        .catch(next);
}

function getBySupplierId(req, res, next) {

    vehicleService.getBySupplierId(req.params.id)
        .then(vehicle => vehicle ? res.json(vehicle) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().required(),
        supplier: Joi.string().required(),
        contact_no: Joi.string().required(),
        car_model: Joi.string().required(),
        car_color: Joi.string().required(),
        no_plate: Joi.string().required(),
        documents: Joi.string().required(),
        profile_picture: Joi.string().required(),
        status: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    vehicleService.create(req.body)
        .then(vehicle => res.json(vehicle))
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
    // users can update their own vehicle and admins can update any vehicle
/*     if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 */
    vehicleService.update(req.params.id, req.body)
        .then(vehicle => res.json(vehicle))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own vehicle and admins can delete any vehicle
/*     if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
 */
    vehicleService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}
