'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action error should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.controllers.error);
    });

    it('action error should fail', async () => {
        const context = await createContext({
            functions: {
                'controllers': {
                    'error': new Error('BOOM')
                }
            }
        });
        try {
            await context.controllers.error();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });
    it('action error should be called', async () => {
        const context = await createContext();
        const view = await context.controllers.error();
        Assert.deepEqual({
            error: 'Failed to handle your command'
        }, view.model);
    });


});