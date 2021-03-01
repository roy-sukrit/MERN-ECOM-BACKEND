const Sub =require ('../models/sub')
//^ Install slugify
const slugify = require('slugify')
const Product =require ('../models/product')


//^create category
exports.create = async (req,res)=>{
    // console.log("create",req)
    // return res.json({info:"success"})
    console.log("SUB ENTRY ---->>")

    try{
        const{name,parent}=req.body
        res.json(await new Sub({name,parent,slug:slugify(name)}).save())
    }catch(err){
        console.log("SUB ERROR ---->>")

        res.status(400).send('Error Create Sub')
    }

};


//^get list
exports.list = async (req,res)=>{
    res.json(await Sub.find({}).sort({createdAt:-1})
    .exec())

};


//^create read - single
exports.read = async (req,res)=>{
 let sub = await Sub.findOne({slug:req.params.slug})

 const products= await Product.find({subs:sub})
 .populate('category')
 .exec()
 res.json({sub,products});

};


//^update category
exports.update = async (req,res)=>{
    const {name,parent}= req.body

    try{
        const updated= await Sub.findOneAndUpdate(
        {slug:req.params.slug},
        {name,parent ,slug:slugify(name)},
        {new:true})

        res.json(updated)


        //^new-true to show the updated res in json
        

    }catch (err){

        res.status(400).send('Error Update Sub')


    }

};


//^remove category
exports.remove = async  (req,res)=>{
 try{
     const deleted=await Sub.findOneAndDelete({slug:req.params.slug})
     res.json(deleted)
 }catch(err){
    res.status(400).send('Error Delete Sub')
 }
};