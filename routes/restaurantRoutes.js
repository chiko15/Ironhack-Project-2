const express = require('express');
const router  = express.Router();

const passport    = require("passport");
const User        = require("../models/user");
const flash       = require("connect-flash");
const axios          = require("axios");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
  
      res.redirect('/login')
    }
  }


  var instance = axios.create({
      baseURL: "https://developers.zomato.com/api/v2.1",
      headers: {'user-key': ''}
  })


/* GET home page */
router.get('/restaurants', ensureAuthenticated, (req, res, next) => {
    instance.get("/search?entity_type=city&q=miami")
        .then(responseFromApi => {
            console.log("responseFromApi: ", responseFromApi.data)
              res.render('restaurants/list', {list:responseFromApi.data });
        })
    // console.log("blah: ", req.user)
});

module.exports = router;
