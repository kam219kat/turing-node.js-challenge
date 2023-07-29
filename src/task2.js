/**
 * Task 2
 */

const fs = require("fs");
const path = require("path");
const util = require("util");
const { validationErrorMessages } = require("./constants");

/**
 * Update expiry date of the item
 * @param {Number} itemId - Item id
 * @param {String} expiryDate - Expiry date in ISO8601 format
 */
async function updateExpiryDateByItemId(itemId, expiryDate) {
    // Check if `itemId` is a safe integer and greater than 0
    itemId = Number(itemId);
    if (!Number.isSafeInteger(itemId) || itemId <= 0) {
        throw new Error(validationErrorMessages.itemIdValidtion);
    }

    // Check if `expiryDate` is a valid date.
    const validDatedExpiryDate = new Date(expiryDate);
    if (!+validDatedExpiryDate) {
        throw new Error(validationErrorMessages.expiryDateValidation);
    }

    const readFileAsync = util.promisify(fs.readFile);

    // Get the product data
    const directoryPath = path.join(__dirname, "./data");
    const filePath = path.join(directoryPath, "task2/update_item_products.json");
    const data = await readFileAsync(filePath, "utf8");
    const productList = data ? JSON.parse(data).products : undefined;

    // Check whether the product data is obtained successfully.
    if (productList == null) {
        throw new Error(validationErrorMessages.itemNotFound);
    }

    // Holds the item with the given `item_id`
    let item = {};

    // Index of the product which contains the matching item with the given `item_id`
    const productIndex = productList.findIndex((product) => (
        // Find the item with the given `item_id`
        item = product.items.find(item => item.item_id === itemId)
    ));

    // Check if the item is found, otherwise throws `itemNotFound` error
    if (item == null) {
        throw new Error(validationErrorMessages.itemNotFound);
    }

    // Update the expiry_date of the item
    item.expiry_date = expiryDate;

    // Create a shallow copy of the product to make it only contain the updated item.
    const productFound = { ...productList[productIndex] };
    productFound.items = [item];

    return productFound;
}

/**
 * TIP: Use the following code to test your implementation.
 * You can change the itemId and expiryDate that is passed to
 * the function to test different use cases/scenarios
 */
(async () => {
    try {
        const product = await updateExpiryDateByItemId(142, "2022-01-01");
        console.log(JSON.stringify(product, null, 3));
    } catch (err) {
        console.error(err);
    }
})();

module.exports = {
    updateExpiryDateByItemId,
};
