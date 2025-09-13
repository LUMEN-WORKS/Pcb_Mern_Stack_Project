const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  UserID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  nic: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  }
});

module.exports = Employee = mongoose.model("employee", UserSchema);
