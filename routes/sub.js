const express = require("express");
const router = express.Router();

//middlewares
const{ authCheck, adminCheck } = require('../middlewares/auth')

//controller
const{
    create,
    read,
    update,
    remove,
    list
} = require("../controllers/sub")


//^create-sub category 
router.post("/sub",authCheck,adminCheck,create);

//^get sub category list
router.get("/subs",list);

//^query sub category
router.get("/sub/:slug",read);

//^update sub category
router.put("/sub/:slug",authCheck,adminCheck,update);

//^delete sub category
router.delete("/sub/:slug",authCheck,adminCheck,remove);


module.exports = router;
