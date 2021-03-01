const Category =require ('../models/category')
const Sub =require ('../models/sub')
const Product =require ('../models/product')

//^ Install slugify
const slugify = require('slugify')

//^create category
exports.create = async (req,res)=>{
    // console.log("create",req)
    // return res.json({info:"success"})

    try{
        const{name}=req.body
        // const category =await new Category({name,slug:slugify()}).save()
        res.json(await new Category({name,slug:slugify(name)}).save())
    }catch(err){
        res.status(400).send('Error Create Category')
    }

};


//^get list
exports.list = async (req,res)=>{
    res.json(await Category.find({}).sort({createdAt:-1})
    .exec())

};


//^create read - single
exports.read = async (req,res)=>{
 let category = await (await Category.findOne({slug:req.params.slug}))

const products= await Product.find({category})
 .populate('category')
 .exec()

 res.json({
     category,products
 });

};


//^update category
exports.update = async (req,res)=>{
    const {name}= req.body

    try{
        const updated= await Category.findOneAndUpdate(
        {slug:req.params.slug},
        {name,slug:slugify(name)},
        {new:true})

        res.json(updated)


        //^new-true to show the updated res in json
        

    }catch (err){

        res.status(400).send('Error Update Category')


    }

};


//^remove category
exports.remove = async  (req,res)=>{
 try{
     const deleted=await Category.findOneAndDelete({slug:req.params.slug})
     res.json(deleted)
 }catch(err){
    res.status(400).send('Error Delete Category')
 }
};


//^ get parent category based on subs id

exports.getSubs = (req, res) => {
    Sub.find({ parent: req.params._id }).exec((err, subs) => {
      if (err) console.log(err);
      res.json(subs);
    });
  };
  