const status = require('http-status');

/**
 * Creates a new Service error.
 * @param {object} error
 * @param {number} statusCode
 * @param {number} errorCode
 * @param {string} message
 * @constructor
 */
const ServiceError = function (error) {
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = error.statusCode;
    this.errorCode = error.errorCode;
    this.message = error.message;
};

const errors = {
    unsuccessfulLaunch: new ServiceError({
        statusCode: status.UNAUTHORIZED,
        errorCode: 1000,
        message: 'Something went wrong on our side. Launch terminated.'
    })
};

module.exports = errors;
