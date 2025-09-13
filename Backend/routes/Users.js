const express = require("express");

const router = express.Router();

// User Model
const usersmodel = require("../model/Users");

// test
router.get("/test", (req, res) => res.send("model is working"));

//post
router.post("/", (req, res) => {
  usersmodel.create(req.body)
    .then(() => res.json({ msg: "User added successfully" }))
    .catch(() => res.status(400).json({ msg: "User adding failed" }));
});



module.exports = router;
