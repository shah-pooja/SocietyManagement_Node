var Vehicle=require("../vehicle_schema.js");

exports.addVehicle=function(req,res){
    
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
 }

 exports.getAllVehicles=function(req,res){
    
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
}

exports.getMyVehicle=function(req,res){
    
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
}

exports.deleteMyVehicle=function(req,res){
        
        vehicleId=req.params.id;
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
}

exports.editMyVehicle=function(req,res){
    
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
}