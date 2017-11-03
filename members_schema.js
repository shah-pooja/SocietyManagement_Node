
var mongoose = require("mongoose");
 mongoose.connect("mongodb://localhost/society");

var memberSchema= new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    pwd:String,
    bday:Date,
    date:Date,
    img:String,
    block:String,
    fnum:Number,
    phone:Number,
    isAdmin:{
        type:Number,
        default:0
    },
    logintoken:
    {
        type:String
    },
    societymaintenance:[{

        month:Number,
        hasPaid:Boolean
    }]

});

var Member= mongoose.model("memberSchema",memberSchema);

module.exports=Member;