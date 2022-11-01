const express = require("express");
const User = require("../../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const app = require("../");

router.get("/signup", (req, res) => {
  res.render("./auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    res.render("auth/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("./auth/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await User.findOne({ username: username });
  if (!currentUser) {
    res.render("auth/login", { errorMessage: "No user with this username" });
  } else {
    if (bcrypt.compareSync(password, currentUser.password)) {
      req.session.user = currentUser;
      res.redirect("/profile");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password!" });
    }
  }
});

router.get("/profile", (req, res) => {
  res.render("auth/profile");
});
module.exports = router;
