const express = require("express");
const User = require("../../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const app = require("../");
let errorMessage;
router.get("/signup", (req, res) => {
  res.render("./auth/signup", { connected: false });
});

router.post("/signup", async (req, res) => {
  try {
    const search = await User.find({ username: req.body.username });
    console.log(search);
    if (search.lenght !== 0) {
      errorMessage = "Username is not unique!";
      res.render("auth/signup", { errorMessage, connected: false });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      await User.create({
        username: req.body.username,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  res.render("./auth/login", { connected: false });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await User.findOne({ username: username });
  if (!currentUser) {
    errorMessage = "No user with this username!";
    res.render("auth/login", { errorMessage, connected: false });
  } else {
    if (bcrypt.compareSync(password, currentUser.password)) {
      req.session.user = currentUser;
      res.redirect("/profile");
    } else {
      errorMessage = "Incorrect password!";
      res.render("auth/login", { errorMessage, connected: false });
    }
  }
});
module.exports = router;
