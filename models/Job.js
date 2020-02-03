const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const JobSchema = new mongoose.Schema({
  customer: { type: ObjectId, ref: "customer" },
  startdate: {
    type: String
  },
  enddate: {
    type: String
  },
  numberofdays: {
    type: Number
  },
  totalprice: {
    type: Number
  },
  paid: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  }
});
module.exports = Job = mongoose.model("jobs", JobSchema);
