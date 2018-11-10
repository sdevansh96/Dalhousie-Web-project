let express=require("express");
let router=express.Router();
let Place=require("../models/place");

//App.GET ROUTS
router.get("/",function(req,res){
    res.send("welcome");
});
// Home
router.get("/home",function(req,res){
    res.render("home.ejs");
});
//Explore
router.get("/explore",function(req,res){
    
    Place.find({ },function(err,callback){
     if(err){
         console.log("err in find");
        }else{
            res.render("explore.ejs",{place:callback});
            
        }        
        }); 
    });
// EXPLORE/ADDNEWPLACE
router.get("/explore/addnewplace",isLogIn,function(req,res){
    res.render("newplace.ejs")
});
//EXPLORE/:ID/TITLE
router.get("/explore/:id/info",function(req,res){
    Place.findOne({"_id":req.params.id}).populate("comments").exec(function(err,callback){
        if(err){
            console.log("err in getting the page");
        }else{
            
            res.render("info.ejs",{place:callback});
        }
   })
    
});
/*********************************************************************************** */

//APP.POST ROUTES
router.post("/explore/addnewplace/add",isLogIn,function isLogIn( req ,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/signin")
},function(req,res){
    let newPlace=req.body.place;
    Place.create(newPlace,function(err,callback){
        if(err){
            console.log("err in saving the place");
        }else{
            callback.author.id=req.user._id;
            callback.author.username=req.user.username;
            callback.save();
            console.log(callback);
           res.redirect("/explore");
        }
    })
});


//=================post edit route=====================
router.get("/explore/:id/info/edit-place",function(req,res){
    if( req.isAuthenticated()){
        Place.findOne({"_id":req.params.id},function(err,callback){
            if(err){
                console.log("place to edit not found");
            }else{
                if(callback.author.id.equals(req.user._id)){
                    res.render("edit-place.ejs",{place:callback});
                    console.log("match");
                }else{
                    console.log("not match")
                    res.send("you dont have premmsion");

                }
              
            }
        })
        
    }
    else{
        res.send("ligin")
    }
})
//=====Post route======
router.put("/explore/:id/editplace",function(req,res){
    Place.updateOne({"_id":req.params.id},req.body.place,function(err,callback){
        if(err){
            console.log("err in updating")
        }else{
            res.redirect("/explore/"+req.params.id+"/info");
        }
    })
    
})
function isLogIn( req ,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/signin")
}
router.get("*",function(req,res){
    res.redirect("/home")
})
module.exports=router;