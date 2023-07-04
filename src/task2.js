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
  const validatedItemId = Number(itemId);

  if (itemId === null || isNaN(validatedItemId) || !Number.isInteger(itemId)) {
    throw new Error(validationErrorMessages.itemIdValidtion);
  }

  const validDatedExpiryDate = new Date(expiryDate);

  if (expiryDate === null || isNaN(validDatedExpiryDate.getTime())) {
    throw new Error(validationErrorMessages.expiryDateValidation);
  }

  const readFileAsync = util.promisify(fs.readFile);

  const directoryPath = path.join(__dirname, "./data");
  const filePath = path.join(directoryPath, "task2/update_item_products.json");

  const data = await readFileAsync(filePath, "utf8");
  let item = {};

  const productList = data ? JSON.parse(data) : undefined;

  let itemFound = false;
  let productFound = {};

  for (let productIndex = 0; productIndex < products.length; productIndex++) {
    let product = products[productIndex];
    item = product?.items.findIndex(
      (element) => element.item_id === validatedItemId
    );
    if (item !== -1) {
      itemFound = true;
      productList.products[productIndex].items[item].expiry_date = expiryDate;
      productFound = productList.products[productIndex];
      productFound.items = productList.products[productIndex].items[item];
      break;
    }
  }

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
