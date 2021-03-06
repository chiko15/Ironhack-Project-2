require('dotenv').config();

const express       = require('express');
const router        = express.Router();
const passport      = require("passport");
const User          = require("../models/user");
const Restaurant    = require("../models/restaurant");
const flash         = require("connect-flash");
const axios         = require("axios");
const multer        = require('multer');
const path          = require('path');

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



// EDIT - GET ROUTE
// url: localhost:3000/celebrities/edit/1234567890
router.get('/restaurants/edit/:id', (req, res, next) => {
    const restaurantId = req.params.id;
    // console.log(celebId);
    Restaurant.findById(restaurantId)
    .then(restuarantFromDB => {
        isAmerican = false;
        isTai = false;
        isMediteranean = false;
        
        if(restuarantFromDB.cuisines === 'american' ){
            isAmerican = true;
        }
        if(restuarantFromDB.cuisines === 'tai' ){
            isTai = true;
        }
        if(restuarantFromDB.cuisines === 'mediterenian' ){
            isMediteranean = true;
        }

        res.render("restaurants/edit", { restaurant: restuarantFromDB , isAmerican, isTai, isMediteranean})
    })
  })
  
  // EDIT - POST ROUTE
  router.post('/restaurants/update/:id', uploader.single('editedImage'), (req, res, next) => {
    const restaurantId = req.params.id;
    // console.log("editedName: ", editedName)
    Restaurant.findById(restaurantId)
    .then((oneRestaurantFromDB) => {
        console.log("oneRestaurantFromDB is: ", oneRestaurantFromDB)
        oneRestaurantFromDB.name = req.body.editedName;
        oneRestaurantFromDB.address = req.body.editedAddress;
        oneRestaurantFromDB.cuisines = req.body.editedCuisines;
        oneRestaurantFromDB.average_cost_for_two = req.body.editedAvgCost;
        oneRestaurantFromDB.price_range = req.body.editedPriceRange;
        console.log("==========================")
console.log("body is: ", req.file)
console.log("==========================")

        if(req.file){
            console.log("in if")
            oneRestaurantFromDB.image = `/images/${req.file.filename}`   
        }
        else{
            console.log("in else")
            oneRestaurantFromDB.image = oneRestaurantFromDB.image;
        }
        oneRestaurantFromDB.save((error) => {
            if(error){
                console.log("error is: ", error)
            }
            res.redirect(`/restaurants/private/${restaurantId}`)
        })
    })
    .catch( error => {
        console.log("Error while updating: ", error)
    })
  }) 


router.post('/restaurants/delete/:id', (req, res, next) => {
    const restaurantId = req.params.id;
    Restaurant.findByIdAndRemove(restaurantId)
    .then(restaurant => {
        console.log(restaurant);
    })
    .catch(error => {
        console.log(error);
    })
    res.redirect('/restaurants/private')
})



module.exports = router;