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
