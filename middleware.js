module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){//Verify login before creating listing
        req.flash("error","you must be logged in to Create a listing!");
        res.redirect("/login");
      }
      next();
}

