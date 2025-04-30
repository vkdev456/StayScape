const express = require("express");
const router = express.Router();
const User=require("../models/user.js");  
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/user.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",wrapasync(userController.signup));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
 
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
    userController.login
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
});


module.exports=router;

