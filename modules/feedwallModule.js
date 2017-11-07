var FeedWall=require("../feedwall_schema.js");

exports.addFeed=function(req,res){
    
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
}

exports.showFeed=function(req,res){
    
    page=req.params.data;
    defaultpage=2;
    console.log(page);

    FeedWall.count().exec(function(err,records){
        skiprecord=defaultpage*page-defaultpage;
        hasnext=records>=defaultpage*page;

          
    if(hasnext)// var uid=req.params.id;
    {
        FeedWall.find({}).populate('comment, like.userID','fname lname').skip(skiprecord).limit(defaultpage).exec(function(err,data){
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
    }
    else
        {
            res.status(404).send({body:"no records further"});
        }
    })
    
        
}

exports.addComments=function(req,res){
    
    var feedId=req.params.id
    var commentdata={post:req.body.comment,userID:req.body.userID}
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
}

exports.getComments=function(req,res){
    
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
 }

 exports.addLikes=function(req,res){
    
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
    
}

exports.getLikes=function(req,res){
    
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
    
    
 }