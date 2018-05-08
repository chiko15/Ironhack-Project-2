const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log("USER IS: ", req.user)
  res.render('auth/home-page', {user: req.user});
});

module.exports = router;
