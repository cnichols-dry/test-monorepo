const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: {
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ]
  }
});

userSchema.plugin(uniqueValidator);

userSchema.methods.addToCart = function(book) {
  const cartBookIndex = this.cart.items.findIndex(cp => {
    return cp.bookId.toString() === book._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartBookIndex >= 0) {
    newQuantity = this.cart.items[cartBookIndex].quantity + 1;
    updatedCartItems[cartBookIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      bookId: book._id,
      quantity: newQuantity,
      price: book.price
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(book) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.bookId.toString() !== book._id.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
