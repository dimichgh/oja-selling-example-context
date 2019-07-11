'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action sellerInfo should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.actions.sellerInfo);
    });

    it('action sellerInfo should fail', async () => {
        const context = await createContext({
            functions: {
                'actions': {
                    'sellerInfo': new Error('BOOM')
                }
            }
        });
        try {
            await context.actions.sellerInfo();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('action sellerInfo should be called', async () => {
        const context = await createContext();
        Assert.deepEqual(require('mock-data/seller-info.json'),
            await context.actions.sellerInfo());
    });

});