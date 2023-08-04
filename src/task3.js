/**
 * Task 3
 */
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { validationErrorMessages } = require("./constants");
/**
 * Add item to a product
 * @param {Number} productId - Product id
 * @param {Object} item - { id: 1010, expiry_date: "2050-03-30T12:57:07.846Z" }
 */
async function addItem(productId, item) {
    // Validate `productId`
    if (!Number.isInteger(productId) || productId <= 0) {
        throw new Error(validationErrorMessages.productIdValidation);
    }

    // Check if `item` is a valid object
    if (
        typeof item !== 'object' ||
        typeof item?.id !== 'number' ||
        typeof item?.expiry_date !== 'string'
    ) {
        throw new Error(validationErrorMessages.itemValidation);
    }

    // Read product data from file
    const productsPath = 'data/task3/products.json';
    let { products } = await fs.promises.readFile(path.join(__dirname, productsPath)).then(JSON.parse);

    // Find product by productId
    const product = products.find(product => product.id === productId);

    // Check if the product with the matching id is found
    if (product == null) {
        throw new Error(validationErrorMessages.productNotFound);
    }

    // Check if the item already exists with the given id
    if (product.items.findIndex(i => i.item_id === item.id) !== -1) {
        throw new Error(validationErrorMessages.itemAlreadyExists);
    }

    // Check if the item has expired
    if (Date.now() > Date.parse(item.expiry_date)) {
        throw new Error(validationErrorMessages.itemExpired);
    }

    // Add the given item to the product
    product.items.push({ item_id: item.id, expiry_date: item.expiry_date });
    product.items_left++;
    product.items.sort((a, b) => a.item_id - b.item_id);

    return product;
}

/**
 * TIP: Use the following code to test your implementation
 * Use different values for input parameters to test different scenarios
 */
(async () => {
    try {
        const result = await addItem(4, {
            id: 410,
            expiry_date: "2050-03-30T12:57:07.846Z",
        });
        console.log(result);
    } catch (err) {
        console.error(err);
    }
})();

module.exports = {
    addItem,
};
