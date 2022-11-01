const router = require("express").Router();

/* GET home page */
router.get("/", (req, res) => {
  if (req.session.user) {
    res.render("index", { connected: true });
  } else {
    res.render("index", { connected: false });
  }
});

router.get("/profile", (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user, connected: true });
  } else {
    res.redirect("/auth/login");
  }
});
module.exports = router;
