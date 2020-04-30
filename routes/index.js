const express = require("express");
const router = express.Router();

const Item = require("../models/item");
const Cart = require("../models/cart");

let cart, id;

// @path: GET /
// @desc: get all projects
router.get("/", async (req, res) => {
  try {
    // create a cart object
    const temp = await Cart.findOne({});
    if (!temp) {
      console.log("creating a cart");
      cart = await Cart.create({ items: [] });
      id = cart._id;
    } else {
      cart = temp;
      id = temp._id;
    }
    const items = await Item.find();

    if (items.length == 0) {
      return res.status(404).json({ error: "No courses found" });
    }
    // console.log(cart);
    res.status(200).json({ items });
  } catch (error) {
    console.log(error);
  }
});

// @path: GET /cart
// @desc: get all products in a cart
router.get("/cart", async (req, res) => {
  try {
    cart = await Cart.findById(id).populate("items.item");
    res.status(200).json({ ...cart._doc });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// @path: POST /cart/:id
// @desc: add item to cart
router.post("/cart/:_id", async (req, res) => {
  try {
    // check if the item exists
    const foundItem = await Item.findById(req.params._id);
    if (!foundItem) {
      return res.status(404).json({ error: "No such item found" });
    }
    // check if it already exists
    let found = false;
    cart.items.map((itemObj) => {
      // loop throught the array and find the item
      if (
        itemObj.item == req.params._id ||
        itemObj.item._id == req.params._id
      ) {
        // increase the quantity
        itemObj.quantity += 1;
        found = true;
      }
    });
    // if the object was not already there, add it with quantity 1
    if (!found) {
      cart.items.push({
        item: req.params._id,
        quantity: 1,
      });
    }

    await cart.save();
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    console.log(cart);
    res.status(400).json({ error });
  }
});

// @path DELETE /cart/:_id
// @desc remove an item form the cart
router.delete("/cart/:_id", async (req, res) => {
  try {
    const temp = [];

    //for each itemObj in items array
    cart.items.forEach((itemObj) => {
      // if the item is not the object to be deleted save it
      if (itemObj.item._id != req.params._id) {
        temp.push(itemObj);
        // if the item is not the object is to be deleted, check if it has quantity more than 0
      } else if (itemObj.item.quantity != 0) {
        itemObj.quantity--; //reduce the quantity
        temp.push(itemObj);
      }
    });
    // console.log(cart);
    // console.log(temp);
    cart.items = temp;
    await cart.save();

    res.status(202).end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

module.exports = router;
