/*********************************************************** *************/
// APP.REQUIRE SECTION  
let express=require("express");
let mongoose=require("mongoose");
let bodyParser=require("body-parser");
let app=express();
let passport=require("passport");
let passportLocal=require("passport-local");
let expressSession=require("express-session");
let methodOverride=require("method-override");
// MODELS REQUIRE
let Place=require("./models/place");
let Comment=require("./models/comment");
let User=require("./models/User");
//====Routs========
let  placeRoute=require("./routs/place");
let commentRoute=require("./routs/comments");
let userRouts=require("./routs/auth");

/************************************************************************** */

//APP. USE SECTION
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("method"));
app.use(express.static("images/dalhousie"));
app.use(express.static("images/Carosol"))
app.use(express.static("style"))
//====================================

// EXPRESS SESSION
app.use(expressSession({
    secret:"tushkin is love",
    resave:false,
    saveUninitialized:false
}));
// PASSPORT 
app.use(passport.initialize());
app.use(passport.session());
passport.use( new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//ROUTS
app.use(function( req, res, next){
    res.locals.user=req.user;
    next();
})
app.use(placeRoute);
app.use(commentRoute);
app.use(userRouts);

/*************************************************************************** */
//Mongodb Connection
mongoose.connect("mongodb://localhost/Place",{useNewUrlParser:true});
/*************************************************************************** */

/********************************************************************************* */
//App.lesten 
app.listen(3000,function(){
    console.log("Server running at port 3000")
});

//Function of isLogIn

function isLogIn( req ,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/signin")
}