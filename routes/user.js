const express = require("express");
const router = express.Router();

const {authCheck} = require('../middlewares/auth')
const {userCart,getUserCart,emptyCart,saveAddress
    , applyCouponToUserCart,
    createOrder,orders,
    addToWishlist,
    wishList,
    removeFromWishlist,
    createCashOrder

} =require ('../controllers/user')

// cart to database
router.post('/user/cart',authCheck ,userCart)
//get cart
router.get('/user/cart',authCheck ,getUserCart)

//orders of user 
router.get('/user/orders',authCheck ,orders)
// cart clear

router.delete('/user/cart',authCheck ,emptyCart)

router.post('/user/address',authCheck ,saveAddress)

//coupon
router.post('/user/cart/coupon',authCheck , applyCouponToUserCart)

//oprder
router.post('/user/order', authCheck, createOrder)


//wishlist
router.post('/user/wishlist',authCheck, addToWishlist)

router.get('/user/wishlist',authCheck, wishList)

router.put('/user/wishlist/:productId',authCheck, removeFromWishlist)


//cash order
router.post('/user/cash-order',authCheck, createCashOrder)

module.exports = router;
