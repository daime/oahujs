'use strict';

const oahu = require('../');

describe('oahu', () => {
    describe('tasks execution', () => {
        it('should resolve immediately with null', () =>
            oahu.pipeline().should.become(null)
        );

        it('should resolve sync tasks', () =>
            oahu.pipeline(
                backdoor => {
                    backdoor.next();
                },
                backdoor => {
                    backdoor.done('ok');
                }
            )
            .should.become('ok')
        );

        it('should resolve async tasks', () =>
            oahu.pipeline(
                backdoor => {
                    setTimeout(() => {
                        backdoor.next();
                    }, 10);
                },
                backdoor => {
                    backdoor.done('ok');
                }
            )
            .should.become('ok')
        );

        it('should resolve on first done', () =>
            oahu.pipeline(
                backdoor => {
                    backdoor.next();
                },
                backdoor => {
                    backdoor.done('ok');
                },
                backdoor => {
                    backdoor.done('unexpected resolution');
                }
            )
            .should.become('ok')
        );
    });

    describe('error handling', () => {
        it('should reject with error', () => {
            const error = new Error('boom');

            oahu.pipeline(
                backdoor => {
                    backdoor.next();
                },
                backdoor => {
                    backdoor.next(error);
                },
                () => {
                    throw new Error('unexpected call');
                }
            )
            .should.be.rejectedWith(error);
        });

        it('should reject with thrown error', () => {
            const error = new Error('boom');

            oahu.pipeline(
                backdoor => {
                    backdoor.next();
                },
                () => {
                    throw error;
                },
                () => {
                    throw new Error('unexpected call');
                }
            )
            .should.be.rejectedWith(error);
        });
    });

    describe('context sharing', () => {
        it('should share context between tasks', () => {
            oahu.pipeline(
                backdoor => {
                    backdoor.set('message', 'hello world');
                    backdoor.next();
                },
                backdoor => {
                    const message = backdoor.get('message');
                    backdoor.done(message);
                }
            )
            .should.become('hello world');
        });
    });
});
