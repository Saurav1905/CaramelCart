const Item = require("../models/item");
const Cart = require("../models/cart");
const products = require("./products.json");

module.exports = seedDB = async () => {
  try {
    await Cart.deleteMany({});
    await Item.deleteMany({});

    products.map(async (product) => {
      //   console.log(product);
      await Item.create(product);
    });
  } catch (error) {
    console.log(error);
  }
};
