const express = require("express");
const router = express.Router();

//middlewares
const{ authCheck, adminCheck } = require('../middlewares/auth')

//controller
const {upload ,remove} = require('../controllers/cloudinary')

//routes

router.post('/uploadimages',authCheck,adminCheck,upload)
router.post('/removeimage',authCheck,adminCheck,remove)

module.exports= router;