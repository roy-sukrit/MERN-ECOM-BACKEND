const express = require("express");
//middlewares

const{authCheck,adminCheck} = require('../middlewares/auth')
const router = express.Router();

// import
const { orders,orderStatus } = require("../controllers/admin");

//^checking Firebase token
router.get("/admin/orders",authCheck,adminCheck,orders);



//^return current user , logged in 
router.put("/admin/order-status",authCheck,adminCheck,orderStatus);



module.exports = router;
