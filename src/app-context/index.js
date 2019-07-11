'use strict';

// here we can statically configure application actions sources and returns the factory method
const createProvider = require('oja-context-provider');
// create a provider with locations where actions can be found
// in the form of domainName/actionsName
const createContextPromise = createProvider([
    'path:src' // assuming one source for simplicity
]);

const createContext = module.exports = async options => {
    const createContext = await createContextPromise;
    return createContext(options);
};

module.exports.createExpressHandler = pageActionName => {
    return async function expressContextHandler(request, response, next) {
        try {
            const context = await createContext({
                // putting them here for edge cases, though we should avoid talking to these objects directly
                properties: {
                    request,
                    response
                }
            });

            // page action
            const { model, template } = await context.controllers[pageActionName]();
            // render the results and wait till it is done
            // let someone detect the end of response
            // useful in tests            
            await context.renderers.render({template, model});
            // consume render stream and send it back to the browser
            const stream = context.consumeStream('render-content');
            for await (const chunk of stream) {
                response.write(chunk);
            }
            response.end();
        }
        catch (err) {
            next(err);
            // let someone know about failure
            // again mostly tests
            return Promise.reject(err);
        }
    }
}