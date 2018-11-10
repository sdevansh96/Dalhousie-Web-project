let express=require("express");
let router=express.Router();
let User=require("../models/User");
let passport=require("passport");

router.get("/userlogin",function(req,res){
    res.render("user.ejs");
})
// User post Route
router.post("/userlogin",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log("err in resister the user");
            return res.render("/home");
        }
        passport.authenticate("local")(req ,res ,function(){
            res.redirect("/explore")
        })
    })
})


/********************************************************************************** */
//USER SIGN IN 
router.get("/user/signin",function(req,res){
    res.render("signin.ejs");
});

router.post("/user/signin", passport.authenticate("local",{successRedirect:"/explore",failureRedirect:"/userlogin"}),
function(req,res){
   
});

// User Logout
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/home");
})
//Function of isLogIn

function isLogIn( req ,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/signin")
}
module.exports=router;