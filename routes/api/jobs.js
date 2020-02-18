const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Customer = require("../../models/Customer");
const Job = require("../../models/Job");
const mongoose = require("mongoose");

//@route        GET api/jobs
//@description  retrieve all jobs
//@access       PRIVATE

router.get("/", auth, async (req, res) => {
  try {
    let jobs = await Job.find({ user: req.user.id }).populate("customer");
    res.json(jobs);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        GET api/jobs/:id
//@description  single job
//@access       PRIVATE

router.get("/:id", auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id).populate("customer");
    res.json(job);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        GET api/jobs/fromcustomer/:id
//@description  single job
//@access       PRIVATE

router.get("/fromcustomer/:id", auth, async (req, res) => {
  try {
    let jobs = await Job.find({ customer: req.params.id }).populate("customer");
    res.json(jobs);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        POST api/jobs/:id
//@description  create job
//@access       PRIVATE

router.post("/:id", auth, async (req, res) => {
  var {
    startdate,
    enddate,
    numberofdays,
    totalprice,
    paid,
    archived,
    description,
    customer
  } = req.body;

  try {
    let job = new Job({
      startdate,
      enddate,
      numberofdays,
      totalprice,
      paid,
      archived,
      description,
      customer,
      user: req.user.id
    });
    await job.save();
    await Customer.findByIdAndUpdate(req.params.id, {
      $push: { jobs: mongoose.Types.ObjectId(job.id) }
    });
    res.status(200).send("Job created");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        PUT api/jobs/:id
//@description  update a job
//@access       PRIVATE

router.put("/:id", auth, async (req, res) => {
  var {
    startdate,
    enddate,
    numberofdays,
    totalprice,
    paid,
    archived,
    description
  } = req.body;
  try {
    await Job.findByIdAndUpdate(
      req.params.id,
      {
        startdate,
        enddate,
        numberofdays,
        totalprice,
        paid,
        archived,
        description
      },
      { useFindAndModify: false }
    );
    res.status(200).send("Job updated");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route        DELETE api/jobs
//@description  delete job
//@access       PRIVATE

router.delete("/:id", auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    await Customer.findByIdAndUpdate(
      job.customer,
      { $pull: { jobs: { $in: req.params.id } } },
      { multi: true }
    );
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).send("Assignment Deleted");
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
