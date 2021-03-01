const express = require("express");
//middlewares

const{authCheck,adminCheck} = require('../middlewares/auth')
const router = express.Router();

// import
const { createOrUpdateUser,currentUser } = require("../controllers/auth");

//^checking Firebase token
router.post("/create-or-update-user",authCheck,createOrUpdateUser);



//^return current user , logged in 
router.post("/current-user",authCheck,currentUser);


//^return currnt admin user , check 
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
