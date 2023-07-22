const { Order } = require('../models/Order');
const { ItemsOrder } = require('../models/ItemsOrder');
const { Menu } = require("../models/Menu")
const { Customer } = require("../models/Customer")

const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Rate } = require('../models/Rate');
const nodmailer = require('nodemailer');
const e = require('express');
const mailTransporter = nodmailer.createTransport({
    service: "gmail",
    auth: {
        user: "culaccino70@gmail.com",
        pass: "wgdwvfrdwnfzdsys"
    }
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
 * @route /api/update/:rate
 * @method POST
 */
router.post("/update", async (req, res) => {
    const orderId = req.body.orderId
    const order = await Order.findById(orderId);
    const customerId=order.customerId;
    const customer = await Customer.findById(customerId);
    const email=customer.email
    const details = {
        from: "culaccino70@gmail.com",
        to: email,
        subject: "Test Subject",
        text: "Thanks For Ratting"
    }
    const itemId = req.body.itemId;
    const io = {
        itemId: req.body.itemId,
        orderId: req.body.orderId
    }
    const item = await ItemsOrder.find(io);
    if (!item.status) {
        try {

            const updatedItem = await ItemsOrder.updateOne(
                { itemId: req.body.itemId, orderId: req.body.orderId },
                {
                    $set: {
                        rate: parseInt(req.body.rate),
                        status: true,
                    },
                }
            );

            const rate = await Rate.findOne({ itemId });
            if (!rate) {
                const newRate = new Rate(
                    {
                        itemId: req.body.itemId,
                        ratersNumber: 1,
                        totalrate: parseInt(req.body.rate)
                    }
                );
                await newRate.save();
            }
            else {
                const oldRate = await Rate.updateOne(
                    { itemId: itemId },
                    {
                        $set: {
                            itemId: rate.itemId,
                            ratersNumber: 1 + rate.ratersNumber,
                            totalrate: parseInt(req.params.rate) + rate.totalrate
                        },
                    }
                );
            }
            mailTransporter.sendMail(details, (err) => {
                if (err) {
                    console.log("error" + err)
                }
                else {
                    console.log("email has send")
                }
            })
            res.status(200).json(rate);
        }
        catch (error) {
            console.log(error);
            res.status(500).json("wrong");
        }
    }
    else {
        res.status(404).json("is rate");
    }
});



module.exports = router;