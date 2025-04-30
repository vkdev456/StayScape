const Review = require("../Models/review.js");  
const Listing = require("../Models/listing.js");


//Route to add a new review
module.exports.addReview=async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
        return next(new ExpressError(404, "Listing not found!"));
    }

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    
    res.redirect(`/listings/${listing._id}`);
};


//delete
module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
    
}