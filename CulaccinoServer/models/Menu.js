const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
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
        minlength: 1,
        maxlength: 500
    },
    AVG: {
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