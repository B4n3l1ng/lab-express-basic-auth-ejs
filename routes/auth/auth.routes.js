const express = require("express");
const User = require("../../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const app = require("../");
let errorMessage;
router.get("/signup", (req, res) => {
  res.render("./auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const search = await User.find({ username: req.body.username });
    console.log(search);
    if (search.lenght !== 0) {
      errorMessage = "Username is not unique!";
      res.render("auth/signup", { errorMessage });
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
  res.render("./auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await User.findOne({ username: username });
  if (!currentUser) {
    errorMessage = "No user with this username!";
    res.render("auth/login", { errorMessage });
  } else {
    if (bcrypt.compareSync(password, currentUser.password)) {
      req.session.user = currentUser;
      res.redirect("/profile");
    } else {
      errorMessage = "Incorrect password!";
      res.render("auth/login", { errorMessage });
    }
  }
});

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});
module.exports = router;
