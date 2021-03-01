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
    list,
    getSubs
} = require("../controllers/category")


//^create-category and fet list
router.post("/category",authCheck,adminCheck,create);

//^get category list
router.get("/categories",list);

//^query category
router.get("/category/:slug",read);

//^update category
router.put("/category/:slug",authCheck,adminCheck,update);

//^delete category
router.delete("/category/:slug",authCheck,adminCheck,remove);

//^Get parent based on sub
router.get("/category/subs/:_id", getSubs)

module.exports = router;
