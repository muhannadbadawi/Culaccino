const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { People } = require('../models/People')
const {Login} =require('../models/Login')
router.post("/", async (req, res) => {
    const { error } = validateCreatePerson(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    try {
        const person = await People.findById(req.params.id);
        if(person && person.email==req.params.email&&person.password==req.params.password){
            res.status(201).json(person);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

function validateCreatePerson(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(6).max(200).required(),
        password: Joi.string().trim().min(8).max(200).required(),
    });

    return schema.validate(obj);
}
module.exports = router;