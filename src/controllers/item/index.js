'use strict';

const template = require('./index.marko');

/**
 * Action: item
 * Domain: controllers
 */
module.exports = context => async parameters => {
    // get item details
    const itemDetailsPromise = context.actions.itemDetails(context.itemId);
    // get seller info
    const sellerInfoPromise = itemDetailsPromise.then(itemDetails => {
        return context.actions.sellerInfo(itemDetails.sellerId);
    })
    // get buyer info
    const buyerInfoPromise = context.actions.userDetails(context.userId);
    // wait for seller and buyer info before we can calculate shipping rates
    const ratesPromise = Promise.all([buyerInfoPromise, sellerInfoPromise]).then(info => {
        const [buyerInfo, sellerInfo] = info;
        // calc rates
        return context.actions.calculateRates(sellerInfo.zipCode, buyerInfo.zipCode);
    }).catch(err => ({
        error: 'Shipping is temporary not available'
    }));
    // build data model and render
    const [itemDetails, sellerInfo, buyerInfo, rates] =
    await Promise.all([itemDetailsPromise, sellerInfoPromise, buyerInfoPromise, ratesPromise]);
    // return for unit test of final render action
    return {
        template,
        model: {
            itemDetails,
            sellerInfo,
            buyerInfo,
            rates
        }
    };
};