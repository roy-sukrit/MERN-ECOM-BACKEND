const express = require("express");
const router = express.Router();

//middlewares
const{ authCheck, adminCheck } = require('../middlewares/auth')

//controller
const{create,listAll , remove ,read 
    , update , list, productsCount , 
    productStar,searchFilters, listRelated} = require("../controllers/product")


//^get product count
router.get("/products/total",productsCount);

//^create product route
router.post("/product",authCheck,adminCheck,create);


//^get product route - 10 at a time
router.get("/products/:count",listAll);

//^get product delete
router.delete("/products/:slug",authCheck,adminCheck , remove);



//^get product based on slug
router.get("/product/:slug",read);



//^ product update based on slug
router.put("/product/:slug",authCheck,adminCheck,update);



//^list product with sort and limit - bestsellers, etc Frontend params no of products
router.post("/products",list);



//^ product update star rating based on id
router.put("/product/star/:productId", authCheck, productStar);


//^get related products based on category references
router.get("/product/related/:productId",listRelated);





//^<----------------- 1 end point ----all results baed on filter -> DATA FILTERING ------------------>

router.post("/search/filters",searchFilters)


module.exports = router;
