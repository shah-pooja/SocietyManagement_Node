var express =require("express");
var app=express();
var body=require("body-parser");
var router = express.Router();
require('dotenv').config();
var Member=require("./members_schema.js");
var userModule=require('./modules/userModule.js');
var vehicleModule=require('./modules/vehicleModule.js');
var feedwallModule=require('./modules/feedwallModule.js');

app.use(body.urlencoded({ extended: false }));
app.use(body.json());

var iname=Date.now();
var port=process.env.PORT || 3000;
//console.log(process.env.PORT)
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PUT,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type,token,Accept, Authorization');
    next();
});

// router.route('/test').get(function(req,res){console.log("test")})
// router.route('/test1').get(function(req,res){console.log("test1")})
// router.route('/test2').get(function(req,res){console.log("test2")})
app.use(router)
// app.get("/test",function(req,res){
//     res.send("test");
// });

//login
router.route('/login').post(userModule.login);
router.route('/signup').post(userModule.signup);
router.route('/user-profile').get(isAuthenticated,userModule.userProfile);
router.route('/maintenance').post(isAdmin,userModule.maintenance);
//app.post("/login",userModule.login);

// app.post("/signup",userModule.signup);

// app.get("/user-profile",isAuthenticated,userModule.userProfile);

// app.post("/maintenance",isAdmin,userModule.maintenance);

// app.post("/upload",function(req,res){
//         var path = '';
//         upload(req, res, function (err) {
//            if (err) {
//              // An error occurred when uploading
//              console.log(err);
//              return res.status(400).send({message:"an Error occured"})
//            }  
//           // No error occured.
//            path = req.file.path;
//            console.log(req.file.filename)
//            console.log(req.file.mimetype)
//            var mimetype=req.file.mimetype
//            //return res.send({message:"image uploaded"}); 
//            return res.send("uploaded"+path+"."+mimetype.substr(6,(mimetype.length-1)))
//      });     
//    })

//add feed to feedwall
router.route('/addfeed').post(isAuthenticated,feedwallModule.addFeed);
//app.post("/addfeed",isAuthenticated,feedwallModule.addFeed);
router.route('/showfeed/:data').get(isAuthenticated,feedwallModule.showFeed);
//app.get("/showfeed",isAuthenticated,feedwallModule.showFeed);
router.route('/addcomments/:id').post(isAuthenticated,feedwallModule.addComments);
//app.post("/addcomments/:id",isAuthenticated,feedwallModule.addComments);
router.route('/getcomments/:id').get(isAuthenticated,feedwallModule.getComments);
//app.get("/getcomments/:id",isAuthenticated,feedwallModule.getComments)
router.route('/addlike/:id').get(isAuthenticated,feedwallModule.addLikes);
//app.get("/addlike/:id",isAuthenticated,feedwallModule.addLikes);
router.route('/getlike/:id').get(isAuthenticated,feedwallModule.getLikes);
//app.get("/getlike/:id",isAuthenticated,feedwallModule.getLikes);


router.route('/addvehicle').post(isAuthenticated,vehicleModule.addVehicle);
//app.post("/addvehicle",isAuthenticated,vehicleModule.addVehicle);
router.route('/getallvehicles').get(isAuthenticated,vehicleModule.getAllVehicles)
//app.get("/getallvehicles",isAuthenticated,vehicleModule.getAllVehicles);
router.route('/getmyvehicles').get(isAuthenticated,vehicleModule.getMyVehicle)
//app.get("/getmyvehicles",isAuthenticated,vehicleModule.getMyVehicle);
router.route('/deletemyvehicle/:id').delete(isAuthenticated,vehicleModule.deleteMyVehicle)
//app.delete("/deletemyvehicle/:id",isAuthenticated,vehicleModule.deleteMyVehicle);
router.route('/editmyvehicle/:id').put(isAuthenticated,vehicleModule.editMyVehicle)
//app.put("/editmyvehicle/:id",isAuthenticated,vehicleModule.editMyVehicle);

function isAuthenticated(req,res,next){
    var token=req.headers.token;
    console.log(token);
    Member.findOne({logintoken:token},function(err,body)
    {
        if(err)
            {
                res.send({body:"authentication is required"})
            }
        else
            {
                
                req.body.userID=body._id
                console.log(body._id)
                next();
            }
    })   
}

function isAdmin(req,res,next){
    
    var token=req.headers.token;
    
    Member.findOne({logintoken:token},function(err,body){
        console.log(body)
        if((body.isAdmin == 0) || err)
            {
                res.send({body:"you are not an authorised user"})
            }
        else
            {
                next();
            }
    })
}

app.listen(port,function(){

    console.log("server started");
    //console.log(process.env.DB_URL)
 
})
