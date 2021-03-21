const apiReferenceModule        = 'validator';

const Joi                       = require('joi');

const responses                 = require('./../utilities/responses');
const constants                 = require('./../utilities/constants');

exports.getRequests               = getRequests;
exports.acceptBooking             = acceptBooking;
exports.getAllRequests            = getAllRequests;
exports.createBooking             = createBooking;


function getRequests(req, res, next) {
    let apiReference = {
        module : apiReferenceModule,
        api : "getRequests"
    }
    let schema = Joi.object().keys({
        driver_id           : Joi.number().integer().positive().max(5).optional(),
        status              : Joi.number().integer().max(3).required(),
        user_id             : Joi.number().required()
    });

    let validFields = validateFields(req['body'], res, schema, apiReference);
    if (validFields) {
        next();
    }
}

function getAllRequests(req, res, next) {
    let apiReference = {
        module : apiReferenceModule,
        api : "getAllRequests"
    }
    let schema = Joi.object().keys({
        user_id             : Joi.number().required()
    });

    let validFields = validateFields(req['body'], res, schema, apiReference);
    if (validFields) {
        next();
    }
}

function acceptBooking(req, res, next) {
    let apiReference = {
        module : apiReferenceModule,
        api : "acceptBooking"
    }
    let schema = Joi.object().keys({
        driver_id           : Joi.number().integer().positive().max(5).required(),
        user_id             : Joi.number().required(),
        booking_id          : Joi.number().required()
    });

    let validFields = validateFields(req['body'], res, schema, apiReference);
    if (validFields) {
        next();
    }
}

function createBooking(req, res, next) {
    let apiReference = {
        module : apiReferenceModule,
        api : "createBooking"
    }
    let schema = Joi.object().keys({
        customer_id         : Joi.number().integer().positive().max(5).required(),
        user_id             : Joi.number().required()
    });

    let validFields = validateFields(req['body'], res, schema, apiReference);
    if (validFields) {
        next();
    }
}


function validateFields(req, res, schema, apiReference) {
    var validation = Joi.validate(req, schema);
    if (validation.error) {
        var errorReason =
                validation.error.details !== undefined
                    ? validation.error.details[0].message
                    : 'Parameter missing or parameter type is wrong';
        responses.sendCustomResponse(res, errorReason || constants.ERROR_MESSAGE, constants.responseFlags.PARAMETER_MISSING, {}, apiReference);
        return false;
    }
    return true;
}

