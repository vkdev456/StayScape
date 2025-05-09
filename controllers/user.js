const Review = require("../Models/review.js");  
const Listing = require("../Models/listing.js");
const User=require("../Models/user.js"); 


//post route callback for user
module.exports.signup=async(req,res)=>{
   try{
    let {username,email,password}=req.body;
    const newUser= new User({email,username});
    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    // After signup direct Login
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to StayScape");
        res.redirect("/listings");
    })
   }catch(e){
       req.flash("error",e.message);  
       res.redirect("/signup");   
   }
}

//login route callback
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to StayScape! You are Logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};