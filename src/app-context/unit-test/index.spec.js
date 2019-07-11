'use strict';

const Assert = require('assert');
const { createExpressHandler } = require('..');
require('app-module-path').addPath(process.cwd());
require('marko/node-require').install();

describe(__filename, () => {
    it('should render item page', async () => {
        let output = '';
        let error;
        const itemHandler = createExpressHandler('item');
        await itemHandler({}, {
            write(data) {
                output += data;
            },
            end() {}
        }, err => {
            error = err;
        });
        // validate
        Assert.ok(!error, error && error.stack);
        Assert.equal('<!doctype html><html><body><div class="content"><div>Item: nike</div><div>Description: Nike Air Max Torch 4 IV Running Cross Training Shoes Sneakers NIB MENS</div><div>Description: 49.99</div><div>Seller: john</div><div>Shipping options:</div><select><option value="3day-shipping">Three day shipping</option><option value="2day-shipping">Two day shipping</option><option value="same-day-shipping">Same day shipping</option></select></div></body></html>', output);
    });
})