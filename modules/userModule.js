var multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');
var md5=require("md5");
var jwt=require("jsonwebtoken");
var Member=require("../members_schema.js");
exports.login=function (req,res){
        
            var email=req.body.email;
            var pwd=req.body.pwd
            var pwd=md5(pwd);
            
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
        
        }
exports.signup=function(req,res){        
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
}

exports.userProfile=function(req,res){
    
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
    
}

exports.maintenance=function(req,res){
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
}