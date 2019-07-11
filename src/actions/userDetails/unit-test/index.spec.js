'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action userDetails should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.actions.userDetails);
    });

    it('action userDetails should fail', async () => {
        const context = await createContext({
            functions: {
                'actions': {
                    'userDetails': new Error('BOOM')
                }
            }
        });
        try {
            await context.actions.userDetails();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('action userDetails should be called', async () => {
        const context = await createContext();
        Assert.deepEqual(require('mock-data/user-info.json'),
            await context.actions.userDetails());
    });

});