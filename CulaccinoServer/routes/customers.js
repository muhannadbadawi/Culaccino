const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Customer } = require('../models/Customer');
const e = require("express");


/**
 * @desc Get All Customer
 * @route /api/customer/getAll
 * @method GET
 */
router.get("/getAll", async (req, res) => {
    const customerList = await Customer.find();
    res.status(200).json(customerList);

})



/**
 * @desc Delete person
 * @route /api/customer/:id
 * @method DELETE
 */
router.delete("/:id", async (req, res) => {
    try {
        const person = await Customer.findById(req.params.id);
        if (person) {
            await Customer.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "person has been deleted" })
        }
        else {
            res.status(404).json({ message: "person not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})


/**
 * @desc get person without password
 * @route /api/customer
 * @method POST
 */
router.post("/getPerson", async (req, res) => {
    const getPerson = {
        id: "",
        name: "",
        phone: "",
        email: ""
    };
    try {
        const person = await Customer.findOne(req.body);

        if (person) {
            getPerson.id = person._id;
            getPerson.name = person.name;
            getPerson.phone = person.phone;
            getPerson.email = person.email;
            console.log(req.body);
            res.json(getPerson);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});




/**
 * @desc Add New person
 * @route /api/customer
 * @method POST
 */
router.post("/", async (req, res) => {
    const { error } = validateCreatePerson(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    try {
        const person = new Customer(
            {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password
            }
        );
        const result = await person.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});


/**
 * @desc Update customer information
 * @route /api/customer/update/:id
 * @method PUT
 */
router.put("/update/:id", async (req, res) => {
    try {
        const p = await Customer.findById(req.params.id);
        if (p.password === req.body.password) {
            const person = await Customer.findByIdAndUpdate(req.params.id, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                }
            },
                { new: true })
            res.status(200).json({ message: "changed successfully!" })
        }
        else{
            res.status(404).json({ message: "The password is wrong" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

});
/**
 * @desc Update an Item
 * @route /api/customer/updatePassword/:id
 * @method PUT
 */
router.put("/updatePassword/:id", async (req, res) => {
    try {
        const p = await Customer.findById(req.params.id);
        if (p) {
            if (p.password === req.body.oldPassword) {
                const item = await Customer.findByIdAndUpdate(req.params.id, {
                    $set: {
                        password: req.body.newPassword
                    }
                },
                    { new: true })
                res.status(200).json({ message: "Password changed successfully!" })
            }
            else {
                res.status(404).json({ message: "The old password is wrong" });
            }
        }
        else {
            res.status(404).json({ message: "person not found" });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Something went wrong" });
    }
})


function validateCreatePerson(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(200).required(),
        phone: Joi.string().trim().min(6).max(20).required(),
        email: Joi.string().trim().min(6).max(200).required(),
        password: Joi.string().trim().min(8).max(200).required(),
    });

    return schema.validate(obj);
}
module.exports = router;