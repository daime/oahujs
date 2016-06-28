/* eslint no-console: "off" */
'use strict';

const oahu = require('../index');

oahu.pipeline(
    backdoor => {
        console.log('step 1');
        backdoor.next();
    },
    backdoor => {
        setTimeout(() => {
            console.log('step 2');
            backdoor.set('name', 'World');
            backdoor.next();
        }, 1000);
    },
    backdoor => {
        console.log('step 3');
        const name = backdoor.get('name');
        backdoor.done(name);
    }
)
.then(name => {
    console.log(`Hello ${name}!`);
})
.catch(err => {
    console.error(err, ':(');
});
