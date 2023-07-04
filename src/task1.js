/**
 * Task 1
 */
const fs = require("fs").promises;
const path = require("path");
const { validationErrorMessages } = require("./constants");

const productsPath = '/data/task1/products.json';
const imagesPath = '/data/task1/images.json';
const reviewsPath = '/data/task1/reviews.json';
const customersPath = '/data/task1/customers.json';


/**
 * Get Product info and its reviews
 * @param {Number} productId - Product id
 */

async function getProductInformationByProductId(productId) {
  let productsJSONString = '', products, images, reviews, customers;

  // Check for the valid product id which should be a positive non-zero integer.
  if (typeof productId !== 'number' || productId <= 0) {
    throw new Error(validationErrorMessages.productIdValidation);
  }

  [products, images, reviews, customers] = (await Promise.all([productsPath, imagesPath, reviewsPath, customersPath].map(path => fs.readFile(__dirname + path)))).map(jsonString => JSON.parse(jsonString));
  console.log(products, images, reviews, customers);
}

/**
 * TIP: Use the following code to test your implementation
 */
(async () => {
  try {
    const product = await getProductInformationByProductId(1);
    console.log(JSON.stringify(product, null, 3));
  } catch (err) {
    console.error(err);
  }
})();

module.exports = {
  getProductInformationByProductId,
};
