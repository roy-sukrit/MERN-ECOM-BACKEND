const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  // later apply coupon
  // later calculate price
  //1.find user
  const {couponApplied} =req.body;
  const user = await User.findOne({email: req.user.email}).exec()
//   console.log("COUPON STRIPE", req.body)
  
  //2. cart total
  const {cartTotal, totalAfterDiscount} = await Cart.findOne({orderdBy:user._id}).exec()
 console.log("STRIPE CART TOTAL",cartTotal,totalAfterDiscount)
  
 let finalAmount = 0;

 if(couponApplied && totalAfterDiscount) {
     finalAmount= totalAfterDiscount * 100
 }
 else{
     finalAmount = cartTotal * 100
     }
  //3. create payment intent with order amount and currency

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "inr",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable:finalAmount
  });
};
