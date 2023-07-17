const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { People } = require('../models/People')



router.get("/getAll", async (req, res) => {
    const peopleList = await People.find();
    res.status(200).json(peopleList);

})

router.delete("/:id", async (req, res) => {
    try {
        const person = await People.findById(req.params.id);
        if (person) {
            await People.findByIdAndDelete(req.params.id);
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



router.get("/getById/:id", async (req, res) => {
    try {
        const user = await People.findById(req.params.id);
        if (user) {
            
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        console.log("the error is " + error);
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.post("/getPerson", async (req, res) => {


    try {
        const peopleList = await People.find();
        foundIt = "false";
        peopleList.forEach(element => {
            if (element.email == req.body.email && element.password == req.body.password) {
                foundIt = "true";
                console.log(foundIt)
                const person = new People(
                    {
                        id:element._id,
                        name: element.name,
                        email: element.email
                    }
                );   
                return res.status(200).json(person)
            }
            else {
                console.log("person not found")
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.post("/", async (req, res) => {
    const { error } = validateCreatePerson(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    try {
        const person = new People(
            {
                name: req.body.name,
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

function validateCreatePerson(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(200).required(),
        email: Joi.string().trim().min(6).max(200).required(),
        password: Joi.string().trim().min(8).max(200).required(),
    });

    return schema.validate(obj);
}
module.exports = router;