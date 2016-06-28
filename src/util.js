'use strict';

// See https://lodash.com/docs#isObjectLike
function isObjectLike(value) {
    return !!value && typeof value === 'object';
}

// See https://lodash.com/docs#isError
function isError(value) {
    if (!isObjectLike(value)) {
        return false;
    }

    return (Object.prototype.toString.call(value) === '[object Error]') ||
        (typeof value.message === 'string' && typeof value.name === 'string');
}

module.exports = {
    isError,
};
