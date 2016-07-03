'use strict';

const Bluebird = require('bluebird');
const util = require('./util');

function backdoor() {
    const context = new Map();

    return {
        get() {
            return context.get.apply(context, arguments);
        },
        set() {
            context.set.apply(context, arguments);
        },
    };
}

function pipeline() {
    const arg0 = arguments[0];
    const handlers = Array.isArray(arg0) ? arg0 : Array.from(arguments);
    const bd = backdoor();
    let finished = false;
    let reply;

    return Bluebird.reduce(handlers, (previous, current) =>
        new Bluebird((resolve, reject) => {
            if (finished) {
                resolve(reply);
                return;
            }

            function next(err) {
                if (util.isError(err)) {
                    reject(err);
                    return;
                }
                resolve();
                return;
            }

            function done(r) {
                finished = true;
                reply = r;
                resolve(r);
                return;
            }

            bd.next = next;
            bd.done = done;

            try {
                current(bd);
                return;
            } catch (e) {
                reject(e);
            }
        })
    , null);
}

module.exports = {
    pipeline,
};
