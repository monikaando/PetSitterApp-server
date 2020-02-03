const express = require("express");
const router = express.Router();
const Customer = require("../../models/Customer");
const Pet = require("../../models/Pet");
const mongoose = require("mongoose");

//@route        GET api/pets/:id
//@description  retrieve customer list
//@access       PUBLIC

router.get("/:id", async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        POST api/pets
//@description  create pet
//@access       PUBLIC
router.post("/", async (req, res) => {
  const { type, name, comments, customerid } = req.body;
  try {
    let pet = new Pet({
      type,
      name,
      comments,
      customerid
    });
    await pet.save();
    console.log(pet);
    await Customer.findByIdAndUpdate(customerid, {
      $push: { pets: mongoose.Types.ObjectId(pet.id) }
    });
    res.status(200).send("Pet created");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});
//@route        UPDATE api/pets
//@description  update a pet
//@access       PUBLIC
router.put("/:id", async (req, res) => {
  const { type, name, comments } = req.body;
  try {
    await Pet.findByIdAndUpdate(
      req.params.id,
      {
        type,
        name,
        comments
      },
      { useFindAndModify: false }
    );
    res.status(200).send("Pet updated");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        DELETE api/pets
//@description  delete a pet
//@access       PUBLIC

router.delete("/:id", async (req, res) => {
  try {
    let pet = await Pet.findById(req.params.id);
    console.log(pet.customerid);
    await Customer.findByIdAndUpdate(
      pet.customerid,
      { $pull: { pets: { $in: req.params.id } } },
      { multi: true }
    );
    await Pet.findByIdAndDelete(req.params.id);
    res.status(200).send("Pet Deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});
// small comment with no purpose just so I can push to github again
module.exports = router;
