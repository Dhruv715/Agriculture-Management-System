const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Cart Schema
const ProductSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [ProductSchema],
    totalAmount: { type: Number, required: true, default: 0 }
});


CartSchema.methods.calculateTotal = function() {
    this.totalAmount = this.products.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
    }, 0);
    return this.totalAmount;
};


CartSchema.pre('save', function(next) {
    this.calculateTotal();
    next();
});

module.exports = mongoose.model('Cart',CartSchema);