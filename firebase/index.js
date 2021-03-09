
// var admin = require("firebase-admin");

// var serviceAccount = require("../config/fbServiceAccountKey.json");
// var serviceAccount = require("../config/fbServiceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// module.exports=admin;
var admin = require("firebase-admin");
//**imp edit for heroku
//var serviceAccount = require("../config/fbServiceAccountKey.json");
// var serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))

var serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii'))


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports=admin;

