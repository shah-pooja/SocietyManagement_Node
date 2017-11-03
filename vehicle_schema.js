var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/society");

var vehicleSchema= new mongoose.Schema({
    userID:String,
    vehicle:String,
    v_number:String,
    image:String,
    color:String,
})  

var Vehicle= mongoose.model("vehicleSchema",vehicleSchema);

module.exports=Vehicle;

//FeedWall.findAndUpdate({_id:req.params.id},{ $push: { comment: comment } },function(err,data){