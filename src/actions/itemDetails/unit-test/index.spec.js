'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action itemDetails should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.actions.itemDetails);
    });

    it('action itemDetails should fail', async () => {
        const context = await createContext({
            functions: {
                'actions': {
                    'itemDetails': new Error('BOOM')
                }
            }
        });
        try {
            await context.actions.itemDetails();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('action itemDetails should be called', async () => {
        const context = await createContext();
        Assert.deepEqual(require('mock-data/item-details.json'),
            await context.actions.itemDetails());
    });

});