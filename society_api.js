var app =require("express")();
var body=require("body-parser");
var Member=require("./members_schema.js");
var FeedWall=require("./feedwall_schema.js");
var Vehicle=require("./vehicle_schema.js");
var Comments=require("./comment_schema");
var Like=require("./like_schema.js")
var jwt=require("jsonwebtoken");
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
var multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');

var md5=require("md5")
console.log(md5("123"),md5("123"));
// var fileupload=require("express-fileupload");
// app.use(fileupload());

var iname=Date.now();
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,DELETE,PUT,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type,token,Accept, Authorization');
    next();
});

app.get("/test",function(req,res){
    // var text=123;
    // var encrypt=md5(text);
    // console.log(encrypt);
    // var decrypt=md5(encrypt);
    // console.log(decrypt);
    res.send("test")
});

app.post("/login",function(req,res){

    var email=req.body.email;
    var pwd=req.body.pwd
    var pwd=md5(pwd);
    //console.log(encrypt)
    Member.findOne({email},function(err,data){
        if(err || (data == null))
            {
                console.log(err);
                res.send({msg:"error"},400);
                return
            }
        else
            {
            if(data.email === email && data.pwd === pwd)
            {
                console.log("sucess")
                res.send({body:"success",data:data},200)
                
            }
            else
            {
                    console.log("failure");
                    res.send({body:"wrong values"},400);
                    return
            }
    }})

});

app.post("/signup",function(req,res){

    
    var path = '';
    upload(req, res, function (err) {

       if (err) {

         console.log(err);
         return res.status(400).send({message:"an Error occured"})
       }  
      // No error occured.
      else if(req.file){
        var mimetype=req.file.mimetype
        path = req.file.filename+"."+mimetype.substr(6,(mimetype.length-1));
      } 
      console.log(path) 
      var formdata=JSON.parse(req.body.formdata);
      console.log(formdata)
      
      var fname=formdata.fname;
       var lname=formdata.lname;
       var email=formdata.email;
       var pwd=formdata.pwd;
       var bday=formdata.bday;
       var date=formdata.date;
       var image=path;
       console.log(image)
       var block=formdata.block;
       var fnum=formdata.fnum;
       var phone=formdata.phone;
       var token=jwt.sign(email,"secret");
       
       var encryptPwd=md5(pwd);
       console.log(encryptPwd)
      
       var newdata={fname:fname,lname:lname,email:email,pwd:encryptPwd,bday:bday,date:date,
        img:"./uploads/"+image,block:block,fnum:fnum,phone:phone,logintoken:token,societymaintenance:[{
            month:6,
            hasPaid:true
        }]};

       console.log(newdata)
       Member.create(newdata,function(err,data){
           if(err)
            {
                console.log(err)
            }
            else
                {
                    console.log("data inserted",data);
                    res.send({"message":"data inserted successfully",data:data});
                }
       })
    })
});

app.get("/user-profile",isAuthenticated,function(req,res){

    Member.findOne({_id:req.body.userID},function(err,body){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log(body);
                res.status(200).send(body)
            }
})

    

})
app.post("/maintenance",isAdmin,function(req,res){
    var block=req.body.block;
    var month=req.body.month
    Member.find({block:block,'societymaintenance.month':month},function(err,data)
     {
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log(data);
                res.status(200).send({data:data})
            }
     })
})

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


app.post("/addfeed",isAuthenticated,function(req,res){

    var post=req.body.status;
    var image=req.body.img;
    //var uid=req.params.id;
    var uid=req.body.userID
    var feed={post:post,image:image,userID:uid};
    
    FeedWall.create(feed,function(err,data){
        if(err)
            {
                console.log(err);
            }
        else
            {
                console.log("feeds added",data);
                res.send({data:data})
            }
    })
});

app.get("/showfeed",isAuthenticated,function(req,res){

    // var uid=req.params.id;

    FeedWall.find({}).populate('comment, like.userID','fname lname').exec(function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("feedwall data",data)
                res.send(data);
            }
    })
});

app.post("/addvehicle",isAuthenticated,function(req,res){
 
    // vehicle:String,
    // v_number:String,
    // image:String,
    // color:String
    var userID=req.body.userID;
    var newdata={vehicle:req.body.vehicle,v_number:req.body.v_number,image:req.body.image,color:req.body.color,userID:userID};

    Vehicle.create(newdata,function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("vehicle added");
                res.send({data:data})
            }
    })
});

app.get("/getallvehicles",isAuthenticated,function(req,res){

    Vehicle.find({},function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("got list of all vehicles");
                res.send({data:data})
            }
    })
});

app.get("/getmyvehicles",isAuthenticated,function(req,res){
    
    var userID=req.body.userID;
    console.log(userID)
    Vehicle.find({userID:userID},function(err,data){
        console.log(data)
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("got list of my vehicles");
                res.send({data:data})
            }
    })
});

app.delete("/deletemyvehicle/:id",isAuthenticated,function(req,res){

    Vehicle.findByIdAndRemove({_id:vehicleId},function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("deleted my vehicle");
                res.send({data:data})
            }
    })
});

app.put("/editmyvehicle/:id",isAuthenticated,function(req,res){

    vehicleId=req.params.id;
    userID=req.body.userID;
    var newdata={vehicle:req.body.vehicle,v_number:req.body.v_number,image:req.body.image,color:req.body.color,userID:userID};
    
    Vehicle.findByIdAndUpdate({_id:vehicleId},newdata,function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log("updated my vehicle");
                res.send({data:data})
            }
    })
});

app.post("/addcomments/:id",isAuthenticated,function(req,res){
    // post:String,
    //var newdata={post:req.body.comment,userID:req.params.id}
    
    //console.log(newdata)
    var feedId=req.params.id
    var commentdata={post:req.body.comment,userID:req.body.userID}
    //console.log(comment)
    // FeedWall.find({_id:req.params.id},{comment:[comment]},function(err,data){
        FeedWall.findOneAndUpdate({_id:feedId},{ $push: { comment: commentdata } },function(err,data){
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("comment added");
            res.send({data:data})
        }
    })
})

app.get("/getcomments/:id",function(req,res){
   
    var id=req.params.id
    FeedWall.find({_id:id}).populate('comment').exec(function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log(data)
                res.send({data:data,body:"got comments"})
            }
    })
});

app.get("/addlike/:id",isAuthenticated,function(req,res){

    var uid=req.body.userID;
    console.log(uid)
    var feedid=req.params.id;
    console.log(feedid)
     var newdata={'userID':uid}
   FeedWall.findOne({_id:feedid,'like.userID':uid},function(err,body){
if(body === null)
   { FeedWall.findByIdAndUpdate({_id:feedid},{ $push: {like : newdata } },function(err,data){
        
                // console.log(data.userID,uid)
                // if(data.userID == uid){
                //     console.log("cant add likes");
                if(err)
                    {
                        console.log(err)
                        res.send({messgage:"error"})
                    }
                else{
                    console.log(data)
                    res.send({message:"like added",data:data})
                }
            
            })
   }
else
{
    res.send({body:"Liked already by you"})
} 

})

});

app.get("/getlike/:id",function(req,res){

    var id=req.params.id;
    FeedWall.find({_id:id}).populate('like.userID','fname lname').exec(function(err,data){
        if(err)
            {
                console.log(err)
            }
        else
            {
                console.log(data)
                res.send({data:data,body:"got likes"})
            }
    })


})

function login(req,res,next){
    req.body.userID="59f95187e490321888b187f6";
    next()
}

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
                //res.send({message:"move ahead"});
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
                
                // req.body.userID=body._id
                // console.log(body._id)
                next();
            }
    })
}

app.listen(3000,function(){

    console.log("server started")
 
})

// console.log(req.files.img)
    // var img=req.files.img;
    // var imgname=req.files.img.name;

    
    // if(!img)
    //     console.log("no files sorry")

    // img.mv('./uploads/'+iname+imgname,function(err){
    //     if(err)
    //         {
    //             console.log(err)
    //         }

    //     console.log("uploaded");
    // })
    // function generatetoken()
    // {
    //     var a=(Math.floor(Math.random*1000000));
    //     return a;
    // }