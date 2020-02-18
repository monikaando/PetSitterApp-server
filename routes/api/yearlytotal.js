const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const Job = require("../../models/Job");

//@route        GET api/yearlytotal/:year
//@description  retrieve totalsper job for that year
//@access       PUBLIC

router.get("/:year", auth, async (req, res) => {
  var query = req.params.year;
  try {
    let jobs = await Job.find({ startdate: { $regex: query }, paid: true });
    res.json(jobs);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
