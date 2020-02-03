const express = require("express");
const router = express.Router();
// const auth = require("../../middleware/auth");
const Customer = require("../../models/Customer");
const Pet = require("../../models/Pet");

const { validationResult } = require("express-validator");

//@route        GET api/customers
//@description  retrieve customer list
//@access       PUBLIC

router.get("/", async (req, res) => {
  try {
    let customers = await Customer.find({});
    res.json(customers);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        GET api/customers/:id
//@description  retrieve customer list
//@access       PUBLIC

router.get("/:id", async (req, res) => {
  try {
    let customer = await await Customer.findById(req.params.id)
      .populate("pets")
      .populate("jobs");
    res.json(customer);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        POST api/customers
//@description  create / update customer
//@access       PUBLIC

router.post("/", async (req, res) => {
  const errors = validationResult(req.body.phone);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, address, phone, priceperday } = req.body;
  try {
    //Check if customer exist
    let customer = await Customer.findOne({ phone });
    if (customer) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Customer already exists" }] });
    }
    customer = new Customer({
      name,
      address,
      phone,
      priceperday
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        PUT api/customers/edit/:id
//@description  update customer
//@access       PUBLIC

router.put("/edit/:id", async (req, res) => {
  try {
    const { name, address, phone, priceperday } = req.body;
    await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        phone,
        priceperday
      },
      { useFindAndModify: false }
    );
    res.status(200).send("Customer updated");
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

//@route        DELETE api/customers
//@description  delete customer
//@access       PUBLIC

router.delete("/:id", async (req, res) => {
  try {
    let promises = [];
    let customer = await Customer.findById(req.params.id);
    customer.pets.forEach(pet => {
      promises.push(Pet.findByIdAndDelete(pet._id));
    });
    Promise.all(promises);
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).send("Customer Deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/validation/phone-number", (req, res) => {
  Customer.findOne({ phone: req.body.phone }).then(customer => {
    if (customer)
      res.status(400).send("A customer with this phone number already exists.");
    else res.status(200).send("Available");
  });
});

module.exports = router;
