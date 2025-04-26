module.exports.isLoggedin=(req,res,next)=>{
    
    if(!req.isAuthenticated()){//Verify login before creating listing
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to Create a listing!");
        res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
  