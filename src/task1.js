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
    productId = Number(productId);

    // Check for the valid product id which should be a positive non-zero integer.
    if (!Number.isSafeInteger(productId) || productId <= 0) {
        throw new Error(validationErrorMessages.productIdValidation);
    }

    // Read products, images, reviews, and customers from files
    // Note: Keep the order aligned with the paths.
    const [
        { products },
        { images },
        { reviews },
        { customers }
    ] = await Promise.all([
        productsPath,
        imagesPath,
        reviewsPath,
        customersPath].map(readFileAsJSON)
    );

    // Find the product with the given productId
    const product = products.find(p => p.id === productId);

    // Check if product exists
    if (!product) {
        throw new Error(validationErrorMessages.productNotFound);
    }

    // Filter the product data - `expiry_date` and `manufactured_date` aren't needed.
    const { expiry_date: _, manufactured_date: __, ...filteredProduct } = product;

    // Create maps for better search speed.
    const imageMap = createMapByProperty(images, 'id');
    const customerMap = createMapByProperty(customers, 'id');

    // Collect reviews for the product
    filteredProduct.reviews = reviews
        .filter(review => review.product_id === productId)
        .map(review => {
            const { product_id: _, customer_id, images, ...filteredReview } = review;

            // Retrieve the information of the customer who provided the review.
            filteredReview.customer = customerMap.get(customer_id);
            
            if (filteredReview.customer) {
                // `phone_number` should be encoded with base64.
                filteredReview.customer.phone_number = btoa(filteredReview.customer.phone_number);

                // `credit_card` and `country` should be excluded.
                delete filteredReview.customer.credit_card;
                delete filteredReview.customer.country;
            }

            // Populate the attached image data
            filteredReview.images = images.map(imageId => imageMap.get(imageId));

            return filteredReview;
        })
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

    return filteredProduct;
};

async function readFileAsJSON(filePath) {
    const text = await fs.readFile(path.join(__dirname, filePath), 'UTF8');
    return JSON.parse(text);
}

function createMapByProperty(array, keyProperty) {
    return new Map(array.map(item => [item[keyProperty], item]));
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
