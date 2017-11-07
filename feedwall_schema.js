var mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL);

var feedwallSchema= new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'memberSchema'
    },
    post:String,
    image:String,
    date:{
        type:Number,
        default:Date.now()
    },
    comment:[{
        post:String,
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'memberSchema'
        }}],
    like:[{
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'memberSchema'
        }
    }]
})  

var FeedWall= mongoose.model("feedwallSchema",feedwallSchema);

module.exports=FeedWall;