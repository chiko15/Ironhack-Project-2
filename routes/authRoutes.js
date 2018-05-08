const express  = require('express');
const router   = express.Router();
const passport = require("passport");

const User     = require("../models/user");
const flash       = require("connect-flash");
const ensureLogin = require("connect-ensure-login");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET home page */


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Please indicate username and password" });
    return;
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if(err){
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


router.get("/login", (req, res, next) => {
  res.render("auth/login",  { "message": req.flash("error") });
});


router.post("/login", passport.authenticate("local",
{
  successRedirect: "/restaurants",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}
));


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});




module.exports = router;