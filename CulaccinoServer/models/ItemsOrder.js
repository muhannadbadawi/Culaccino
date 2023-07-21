const mongoose = require("mongoose");

const ItemsOrderSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    orderId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
    },
    rate: {
        type: Number,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true,
        trim: true,
    }


},
    {
        timestamps: true
    }
);

const ItemsOrder = mongoose.model("ItemsOrder", ItemsOrderSchema);
module.exports = {
    ItemsOrder
}