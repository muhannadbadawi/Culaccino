const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    totalPrice: {
        type: Number,
        required: true,
        trim: true,
    }


},
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = {
    Order
}