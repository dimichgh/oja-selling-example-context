'use strict';

/**
 * Action: render
 * Domain: renderers
 */
module.exports = context => async ({ template, model }) => {
    // here we still use flow which is convinient to control marko template data rendering
    template.render(model, {
        write(content) {
            // can be called multiple times
            context.define('render-content', content);
        },

        end() {
            context.define('render-content', null); // end of stream
            context.define('render-content-end', 'done'); // signal end of render
        }
    });

    // wait till we done in case one needs to know the moment
    // usually in unit tests
    await context.consume('render-content-end');
};
