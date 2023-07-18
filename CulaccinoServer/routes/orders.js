const { Order } = require('../models/Order');
const { ItemsOrder } = require('../models/ItemsOrder');
const express = require("express");
const router = express.Router();
const Joi = require("joi");


/**
 * @desc Get All Order
 * @route /api/order/getAllOrder
 * @method GET
 */
router.get("/getAllOrder", async (req, res) => {
    const itemList = await Order.find();
    res.status(200).json(itemList);
})


/**
 * @desc Get All Items Order
 * @route /api/order/getAllItemsOrder
 * @method GET
 */
router.get("/getAllItemsOrder", async (req, res) => {
    const itemList = await ItemsOrder.find();
    res.status(200).json(itemList);
})


/**
 * @desc Add New Order
 * @route /api/order
 * @method POST
 */
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(
            {
                customerId: req.body.customerId,
                totalPrice: 5,
                status: 0
            }
        )
            newOrder.save();
            const list = req.body.items;
            list.forEach(element => {
                const newItemsOrder = new ItemsOrder(
                    {
                        itemId: element.itemId,
                        quantities: element.quantities,
                        orderId: newOrder._id
                    }
                );
                console.log(newItemsOrder);
                newItemsOrder.save();
            });

        res.status(201).json(newOrder._id);
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
router.put("/update/:id", async (req, res) => {
    const item = await Menu.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            zerostar: req.body.zerostar,
            onestar: req.body.onestar,
            twostar: req.body.twostar,
            threestar: req.body.threestar,
            fourstar: req.body.fourstar,
            fivestar: req.body.fivestar
        }
    },
        { new: true })
    res.status(200).json(item)
})


module.exports = router;