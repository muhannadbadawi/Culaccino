const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    ratersNumber: {
        type: Number,
        required: true,
        trim: true,
    },
    totalrate: {
        type: Number,
        required: true,
        trim: true,
    }


},
    {
        timestamps: true
    }
);

const Rate = mongoose.model("Rate", RateSchema);
module.exports = {
    Rate
}