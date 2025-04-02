const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");  

// Validate review data
const validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Invalid review data!");
    }

    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

//Route to add a new review
router.post("/", validateReview, wrapasync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    
    if (!listing) {
        return next(new ExpressError(404, "Listing not found!"));
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    
    res.redirect(`/listings/${listing._id}`);
}));

// Route to delete a review
router.delete("/:reviewId", wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
