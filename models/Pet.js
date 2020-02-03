const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
  comments: {
    type: String
  },
  customerid: {
    type: String
  }
});
module.exports = Pet = mongoose.model("pets", PetSchema);
