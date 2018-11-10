let express=require("express");
let router=express.Router();
let Comment=require("../models/comment")
let Place=require("../models/place");
// COMMENT ROUTE
router.get("/explore/:id/comment", isLogIn,function(req,res){
    Place.findOne({_id:req.params.id},function(err,callback){
        if(err){
            console.log("comment of id not found");
        }else{
             res.render("comment.ejs",{place:callback});
        }
    })
    
});
/********************************************************************************* */
//COMMENT .POST

router.post("/explore/:id/comment/post",isLogIn,function(req,res){
    let id=req.params.id;
    Place.findOne({_id:id},function(err,find){
        if(err){
            console.log("err in finding the comment id")
        }else{
           Comment.create(req.body.place,function(err,comment){
               if(err){
                   console.log("err in creating the comment")
               }else{
                comment.author.id=req.user._id;
                comment.author.username=req.user.username;
                comment.save();
               find.comments.push(comment);
               find.save(function(err,callback){
                   res.redirect("/explore/"+req.params.id+"/info");
               })
               }
           })
        }
    })
});
 

//=====Comment edit get Router======
router.get("/explore/:id/:comment/commentedit",function(req,res){
    if(req.isAuthenticated()){

        Place.findOne({"_id":req.params.id},function(err,place){
            if(err){
                console.log("err in place")
            }else{
                Comment.findOne({"_id":req.params.comment},function(err,comment){
                    if(err){
                        console.log("err in getting comment");
                    }else{
                        console.log(comment)
                        console.log(comment.author.id);
                        console.log(req.user._id)
                        if(comment.author.id.equals(req.user._id)){
                             res.render("edit-comment.ejs",{place:place,comment:comment});
                        }else{
                            res.send("asdasd")
                        }
                       
                    }
                })
            }
        });
    }else{
        res.redirect("/user/signin")
    }
  
  });
  //===========Comment POST router
  router.put("/comment/:id/:commentid/edit",function(req,res){
  Comment.updateOne({"_id":req.params.commentid},req.body.place,function(err,callback){
      if(err){
          console.log("err in updating the place");
      }else{
          res.redirect("/explore/"+req.params.id+"/info");
      }
  })
});
//Function of isLogIn

function isLogIn( req ,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/signin")
}
 module.exports=router;