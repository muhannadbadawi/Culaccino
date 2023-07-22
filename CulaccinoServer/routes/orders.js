const { Order } = require('../models/Order');
const { ItemsOrder } = require('../models/ItemsOrder');
const { Menu } = require("../models/Menu")
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Rate } = require('../models/Rate');

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
 * @desc Get All Order
 * @route /api/order/getAllOrder
 * @method GET
 */
router.get("/getAllOrder", async (req, res) => {
    const itemList = await Order.find();
    res.status(200).json(itemList);
})


/**
 * @desc Get Order By Customer Id
 * @route /api/order/getOrder
 * @method POST
 */
router.post("/getOrder", async (req, res) => {
    const getOrder = {
        _id: "",
        customerId: "",
        totalPric: 0,
        updatedAt: ""
    };

    try {
        const item = await Order.find(req.body);
        if (item) {
            getOrder._id = item._id;
            getOrder.customerId = item.customerId;
            getOrder.totalPric = item.totalPric;
            getOrder.updatedAt = item.updatedAt
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * @desc Get Items of Order By Order Id
 * @route /api/order/getItemsOrder
 * @method POST
 */
router.post("/getItemsOrder", async (req, res) => {
    try {
        const item = await ItemsOrder.find(req.body);
        if (item) {
            const list = [];
            item.forEach(element => {
                if (!element.status)
                    list.push(element);
            });

            res.status(200).json(list);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

/**
 * @desc Add New Order
 * @route /api/order
 * @method POST
 */
router.post("/", async (req, res) => {
    try {
        const list = req.body.items;
        const newOrder = new Order(
            {
                customerId: req.body.customerId,
                totalPrice: req.body.totalPrice,
            }
        )

        newOrder.save();

        list.forEach(element => {
            const newItemsOrder = new ItemsOrder(
                {
                    itemId: element.id,
                    orderId: newOrder._id,
                    quantity: element.quantity,
                    rate: 0,
                    status: 0
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
 * @desc Ratting Item
 * @route /api/order/rate
 * @method PUT
 */
// router.put("/updateRate/:id", async (req,res)=>{
//     const item = await ItemsOrder.find(req.params.id)
//     res.status(200).json(item)
// })



module.exports = router;