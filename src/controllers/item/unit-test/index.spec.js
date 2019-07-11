'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');
require('marko/node-require').install();

describe(__filename, () => {
    it('action item should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.controllers.item);
    });

    it('action item should fail', async () => {
        const context = await createContext({
            functions: {
                'controllers': {
                    'item': new Error('BOOM')
                }
            }
        });
        try {
            await context.controllers.item();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('should render page with empty mock data', async () => {
        const context = await createContext({
            functions: {
                actions: {
                    itemDetails: Promise.resolve({}),
                    sellerInfo: {},
                    userDetails: {},
                    calculateRates: {}
                }
            }
        });

        const ret = await context.controllers.item();
        const { template, model } = ret;

        Assert.ok(template);
        Assert.deepEqual({
            sellerInfo: {},
            buyerInfo: {},
            rates: {},
            itemDetails: {}
        }, model);
    });

    it('should render page', async () => {
        const context = await createContext({
            functions: {
                actions: {
                    itemDetails: Promise.resolve(require('mock-data/item-details')),
                    sellerInfo: require('mock-data/seller-info'),
                    userDetails: require('mock-data/user-info'),
                    calculateRates: require('mock-data/shipping-info')
                }
            }
        });

        const { template, model } = await context.controllers.item();
        Assert.ok(template);
        Assert.deepEqual({
            itemDetails: require('mock-data/item-details'),
            sellerInfo: require('mock-data/seller-info'),
            buyerInfo: require('mock-data/user-info'),
            rates: require('mock-data/shipping-info')
        }, model);
    });

    it('should handle failed shipping service', async () => {
        const context = await createContext({
            functions: {
                actions: {
                    itemDetails: Promise.resolve({}),
                    sellerInfo: {},
                    userDetails: {},
                    calculateRates: new Error('Boom')
                }
            }
        });

        const { model } = await context.controllers.item();
        Assert.deepEqual({
            sellerInfo: {},
            buyerInfo: {},
            rates: {
                error: 'Shipping is temporary not available'
            },
            itemDetails: {}
        }, model);
    });

    it('should render page with real data', async () => {
        const context = await createContext();
        const { model } = await context.controllers.item();
        Assert.deepEqual({
            "itemDetails": {
                "id": 1234,
                "title": "nike",
                "description": "Nike Air Max Torch 4 IV Running Cross Training Shoes Sneakers NIB MENS",
                "sellerId": "seller123",
                "price": 49.99
            },
            "sellerInfo": {
                "username": "john",
                "location": {
                    "zip": 12345
                }
            },
            "buyerInfo": {
                "username": "bob",
                "location": {
                    "zip": 34527
                }
            },
            "rates": [
                {
                    "name": "3day-shipping",
                    "desc": "Three day shipping",
                    "rate": 6.99
                },
                {
                    "name": "2day-shipping",
                    "desc": "Two day shipping",
                    "rate": 9.99
                },
                {
                    "name": "same-day-shipping",
                    "desc": "Same day shipping",
                    "rate": 15.99
                }
            ]
        }, model);
    });
});