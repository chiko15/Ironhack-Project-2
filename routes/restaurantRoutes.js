const express = require('express');
const router  = express.Router();

const passport    = require("passport");
const User        = require("../models/user");
const Restaurant        = require("../models/restaurant");

const flash       = require("connect-flash");
const axios       = require("axios");

const multer = require('multer');
const path = require('path');

const uploader = multer({
    dest:path.join(__dirname,'../public/images')
})



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
  
      res.redirect('/login')
    }
  }


  var instance = axios.create({
      baseURL: "https://developers.zomato.com/api/v2.1",
      headers: {'user-key': process.env.api_key}
  })


/* GET home page */
router.get('/restaurants', ensureAuthenticated, (req, res, next) => {
    instance.get("/search?entity_type=city&q=miami")
        .then(responseFromApi => {
            // console.log("responseFromApi: ", responseFromApi.data)
              res.render('restaurants/list', {list:responseFromApi.data });
        })
    // console.log("blah: ", req.user)
});


// get route to display the form
router.get('/restaurants/create', (req, res, next) => {
    res.render('restaurants/createRestaurant')
})


//post route to submit new restaurant
router.post('/restaurants/create', uploader.single('restImage'), (req, res, next) => {
    // console.log("body is: ", req.body)
    const newRestaurant = new Restaurant({
        name: req.body.restName,
        address: req.body.restAddress,
        cuisines: req.body.cuisines,
        average_cost_for_two: req.body.avgCost,
        price_range: req.body.priceRange,
        image: `/images/${req.file.filename}`
    })
    newRestaurant.save()
    .then( () => {
        res.redirect('/restaurants/private')
    } )
    .catch( error => {
        console.log("error while displaying: ", error)
    } )
})

router.get('/restaurants/private', (req, res, next) => {
    Restaurant.find()
    .then( restaurants => {
        res.render('restaurants/private', {restaurants: restaurants})
    } )
})

router.get('/restaurants/private/:theId', (req, res, next) => {
    const restaurantId = req.params.theId;
    // console.log(restaurantId);
    Restaurant.findById(restaurantId)
    .then(oneRestaurantFromDB => {
        console.log(oneRestaurantFromDB);
        res.render('restaurants/details', { restaurant: oneRestaurantFromDB })
    })
    .catch( error => {
        console.log("Error while getting details: ", error)
    })
});

module.exports = router;
