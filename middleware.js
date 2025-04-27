const Listing=require("./Models/listing");
const Review=require("./Models/review");

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
  

module.exports.isOwner=async (req,res,next)=>{
  let { id } = req.params;
 
  let listing=await Listing.findById(id);

  if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","you are not the owner of this listing");
     return res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.isReviewAuthor=async (req,res,next)=>{
  let { reviewId ,id} = req.params;
 
  let review=await Review.findById(reviewId);

  if(!res.locals.currUser || !review.author.equals(res.locals.currUser._id)){
     req.flash("error","you did not author of this review");
     return res.redirect(`/listings/${id}`);
  }
  next();
}