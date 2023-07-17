const { Item } = require('../models/Item')
const express = require("express");
const router = express.Router();
const Joi = require("joi");


/**
 * @desc Get All Items
 * @route /api/item/getAll
 * @method GET
 */
router.get("/getAll", async (req, res) => {
    const itemList = await Item.find();
    res.status(200).json(itemList);

})


/**
 * @desc Add New Item
 * @route /api/item
 * @method POST
 */
router.post("/", async (req, res) => {
    try {
        const item = new Item(
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                zerostar:0,
                onestar:0,
                twostar:0,
                threestar:0,
                fourstar:0,
                fivestar:0
            }
        );
        const result = await item.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * @desc Update an Item
 * @route /api/item/:id
 * @method PUT
 */
router.put("/update/:id", async (req,res)=>{
    const item = await Item.findByIdAndUpdate(req.params.id,{
        $set:{
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            zerostar:req.body.zerostar,
            onestar:req.body.onestar,
            twostar:req.body.twostar,
            threestar:req.body.threestar,
            fourstar:req.body.fourstar,
            fivestar:req.body.fivestar
        }},
        {new : true})
    res.status(200).json(item)
})


module.exports = router;