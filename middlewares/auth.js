const admin=require('../firebase/')
const User=require ('../models/user')

//^token check token in headers


exports.authCheck = async (req, res, next) => {
     console.log("headers====>",req.headers); // token
     try {
      const firebaseUser = await admin
        .auth()
        .verifyIdToken(req.headers.authtoken);
        console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);

      req.user = firebaseUser;

      next();
    } catch (err) {
      res.status(401).json({
        err: "Invalid or expired token",
      });
    }
  };
  

//^user role verify-admin

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({
      err: "Admin resource. Access denied.",
    });
  } else {
    next();
  }
};









// exports.authCheck = async (req,res,next) => {
//       console.log("headers====>",req.headers); // token
//     try{
//         const firebaseUser = await admin
//            .auth()
//            .verifyIdToken(req.headers.authToken);
//         console.log("FIREBASE AUTH---->",firebaseUser);
//         req.user = firebaseUser;
//         next();
//     } catch (err) {
//         res.status(401).json({
//           err: "Invalid or expired token",
//         });
//       }
//     };
    


  