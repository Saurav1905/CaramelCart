const mongoose = require("mongoose");
const Item = require("./item");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        item: {
          type: mongoose.Types.ObjectId,
          ref: "Item",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { virtuals: true }
);

const Cart = mongoose.model("Cart", cartSchema);

const TotalVirtual = cartSchema.virtual("total");

TotalVirtual.get(async () => {
  let total = 0;
  this.items.map(async (item) => {
    itemObj = await Item.find(item._id);

    total += item.quantity * itemObj.price;
  });
  return total;
});

module.exports = Cart;
