'use strict';

const Assert = require('assert');
require('app-module-path').addPath(process.cwd());
const createContext = require('src/app-context');

describe(__filename, () => {
    it('action render should be discovered', async () => {
        const context = await createContext();
        Assert.ok(context.renderers.render);
    });

    it('action render should fail', async () => {
        const context = await createContext({
            functions: {
                'renderers': {
                    'render': new Error('BOOM')
                }
            }
        });
        try {
            await context.renderers.render();
        }
        catch (err) {
            Assert.equal('BOOM', err.message);
        }
    });

    it('action render should be called', async () => {
        const context = await createContext();
        let rendered;
        await context.renderers.render({
            template: {
                render(model, out) {
                    rendered = true;
                    setImmediate(() => out.end());
                }
            },
            model: {}
        });

        Assert.ok(rendered);
    });

    it('action render some content', async () => {
        const context = await createContext();
        await context.renderers.render({
            template: {
                render(model, out) {
                    Assert.equal('bar', model.foo);
                    out.write('data1');
                    out.write('data2');
                    setImmediate(() => out.end());
                }
            },
            model: {
                foo: 'bar'
            }
        });

        const stream = context.consumeStream('render-content');
        const buffer = [];
        for await (const chunk of stream) {
            buffer.push(chunk);
        }

        Assert.equal('data1,data2', buffer.join(','));
    });
});