const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 1000
    },
    zerostar: {
        type: Number,
        required: true,
        trim: true,
    },
    onestar: {
        type: Number,
        required: true,
        trim: true,
    },
    twostar: {
        type: Number,
        required: true,
        trim: true,
    },
    threestar: {
        type: Number,
        required: true,
        trim: true,
    },
    fourstar: {
        type: Number,
        required: true,
        trim: true,
    },
    fivestar: {
        type: Number,
        required: true,
        trim: true,
    }



},
    {
        timestamps: true
    }
);

const Menu = mongoose.model("Menu", MenuSchema);
module.exports = {
    Menu
}