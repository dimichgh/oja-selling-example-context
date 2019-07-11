'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action calculateRates should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.actions.calculateRates);
    });

    it('action calculateRates should fail', async () => {
        const context = await createContext({
            functions: {
                'actions': {
                    'calculateRates': new Error('BOOM')
                }
            }
        });
        try {
            await context.actions.calculateRates();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('action calculateRates should be called', async () => {
        const context = await createContext();
        Assert.deepEqual(require('mock-data/shipping-info.json'),
            await context.actions.calculateRates());
    });

});