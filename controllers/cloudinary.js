const cloudinary = require('cloudinary')

//config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET

})

//^binary data to server JSON DATA 

exports.upload = async (req,res) => {
    let result = await cloudinary.uploader.upload(req.body.image,{
        public_id:`${Date.now()}` , 
        //^name public of image
        resource_type:'auto'
        //^jpg,png etc
    })

    //^result--->url of uploaded image -----> client

    res.json({
        public_id: result.public_id,
        url: result.secure_url
    })

};

exports.remove = (req,res) => {

   //^id of image
  let image_id = req.body.public_id

  cloudinary.uploader.destroy(image_id, (err,result)=>{
      if(err) return res.json({sucess: false,err});

      res.send("ok")

  })

}