const Product = require("../models/product");
const slugify = require("slugify");
const { findOneAndDelete, findOneAndRemove } = require("../models/product");
const User = require("../models/user");


exports.create = async (req, res) => {
  try {
    console.log("PRODUCT BODY----->", req.body);

    //^ Added slug to request itself
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(`Product ${newProduct.title} create success`);
  } catch (err) {
    // res.json(400).send("Create Product Error!")
    //error from mongoose
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);

    res.status(400).send("Product Delete Failed");
  }
};

exports.read = async (req, res) => {
  let product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();
  res.json(product);
};

exports.update = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Product Update Failed");
  }
};

//^without pagination
// exports.list = async (req,res) => {

//     //^ from frontend sort, order , limit NEW ARRIVALS, BEST SELLERS
//     try{
//         const {sort, order , limit } = req.body
//   //^ sort - createdAt, order - desc/asc , limit - 3,4...
//         const products = await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort , order]])
//         .limit(limit)
//         .exec()

//         res.json(products)

//     }catch(err){
//         console.log(err)
//     }
// }


//*Pagination based on sort, order, page ----->

exports.list = async (req, res) => {
  //^ from frontend sort, page , limit NEW ARRIVALS, BEST SELLERS
  try {
    const { sort, order, page } = req.body;
    //*if not given 1
    const currentPage = page || 1;
    //*per page how many
    const perPage = 3;
    //* sort - createdAt, order - desc/asc , page - 3,4...
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};


//^<------------------Rating----------------------------->

// exports.productStar = async (req, res) => {


//      console.log("STAR END--->",req.boody)
//   //^ 1. params ---> star (Number), productId ----->  _id (Product: _id)

//   const product = await Product.findById(req.params.productId).exec();

//   //* 2. Email from middleware
//   const user = await User.findOne({ email: req.user.email }).exec();

//    //^ 3. 1-5 Rating
//   const { star } = req.body;
 

//   //* 4. Checking if Product.ratings exists

//   let existingRatingObject = product.ratings.find((el) => {
//     el.postedBy == user._id;
//     //*.toString for ===
//   });

//   //^ 5. If no user rating push in the ratings array--->

//   if (existingRatingObject === undefined) {
//     let ratingAdded = await Product.findByIdAndUpdate(
//       product._id,
//       {
//         $push: { ratings: { star, postedBy: user._id } },
//       },
//       { new: true }
//     ).exec();

//     console.log("rating", ratingAdded);

//     res.json(ratingAdded);

//   } 

//   //^ 6. If exists then update---->
  
//   else {
//     const ratingUpdated = await Product.updateOne(
//       {
//         ratings: { $elemMatch: existingRatingObject },
//       },
//       { $set: { "ratings.$.star": star } },

//       { new: true }
//     ).exec();
//     console.log("rating", ratingUpdated);

//     res.json(ratingUpdated);
//   }
 
// };


exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // who is updating?
  // check if currently logged in user have already added rating to this product?
  let existingRatingObject = product.ratings.find(
    (ele) => ele.postedBy.toString() === user._id.toString()
  );

  // if user haven't left rating yet, push it
  if (existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
};


//^ getting products excluding current id in req params
exports.listRelated = async (req, res) => {
  try{
  //*get id- product
  const product = await Product.findById(req.params.productId).exec();

  //* realted excluding top
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
}
catch(err){
  console.log(err)
}

};
//^<------------search filter main method with helper


const handleQuery = async (req,res ,query) => {
  const products = await Product.find({$text :{$search : query}})
  .populate("category","_id name")
  .populate("subs", "_id name")
  .populate('postedBy',"_id name")
  .exec()

  res.json(products)
}

const handlePrice = async (req,res,price) => {
  try{
    let products = await Product.find({
      price: { $gte : price[0] , $lte :price[1]},
    })
    .populate("category","_id name")
    .populate("subs", "_id name")
    .populate('postedBy',"_id name")
    .exec()
    res.json(products)

  }
  catch(err){
    console.log(err)
  }
}


const handleCategory = async (req,res ,category) => {
  try{
    let products = await Product.find({category})
    .populate("category","_id name")
    .populate("subs", "_id name")
    .populate('postedBy',"_id name")
    .exec()
    res.json(products)

  }
  catch(err){
    console.log(err)
  }
}

//^3.33 ceil -4 , 3 floor

const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        // title: "$title",
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("AGGREGATE ERROR", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("PRODUCT AGGREGATE ERROR", err);
          res.json(products);
        });
    });
};


const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};



const handleShipping = async (req,res,shipping) => {
const products = await Product.find({shipping})
.populate("category", "_id name")
.populate("subs", "_id name")
.populate("postedBy", "_id name")
.exec();

res.json(products)

}

const handleColor = async (req,res,color) => {
  const products = await Product.find({color})
  .populate("category", "_id name")
  .populate("subs", "_id name")
  .populate("postedBy", "_id name")
  .exec();
  
  res.json(products)
}

const handleBrand = async (req,res,brand) => {
  const products = await Product.find({brand})
  .populate("category", "_id name")
  .populate("subs", "_id name")
  .populate("postedBy", "_id name")
  .exec();
  
  res.json(products)
}




exports.searchFilters = async (req,res) => {

//^each input differernt so dynamic handleQuery
//^text query
  const {query, price 
    , category, stars
    ,sub, shipping,
  color, brand} = req.body

if(query){
  console.log("Text---->",query);
  await handleQuery(req,res,query);
}
//^price [a, b] 
if(price !== undefined) {
console.log("Price-->", price)

await handlePrice(req,res,price)
}
if(category){
  console.log("category--->",category)
  await handleCategory(req,res,category);

}


if(stars){
  console.log("stars--->",stars)
  await handleStar(req,res,stars);

}

if (sub) {
  console.log("sub ---> ", sub);
  await handleSub(req, res, sub);
}

if (shipping) {
  console.log("shipping ---> ", shipping);
  await handleShipping(req, res, shipping);
}
if (color) {
  console.log("color ---> ", color);
  await handleColor(req, res, color);
}

if (brand) {
  console.log("brand ---> ", brand);
  await handleBrand(req, res, brand);
}
}