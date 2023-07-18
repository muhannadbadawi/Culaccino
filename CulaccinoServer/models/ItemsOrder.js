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
        minlength: 3,
        maxlength: 500
    },
    quantities: {
        type: Number,
        required: true,
        trim: true,
    },


},
    {
        timestamps: true
    }
);

const ItemsOrder = mongoose.model("ItemsOrder", ItemsOrderSchema);
module.exports = {
    ItemsOrder
}