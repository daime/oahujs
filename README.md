# Oahu JS [![CircleCI](https://circleci.com/gh/daime/oahujs.svg?style=shield)](https://circleci.com/gh/daime/oahujs) [![Code Climate](https://codeclimate.com/github/daime/oahujs/badges/gpa.svg)](https://codeclimate.com/github/daime/oahujs) [![Test Coverage](https://codeclimate.com/github/daime/oahujs/badges/coverage.svg)](https://codeclimate.com/github/daime/oahujs/coverage)

Oahu orchestrates tasks

## Usage

```javascript
'use strict';

const oahu = require('oahu');

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
```
