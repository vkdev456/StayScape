const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");  
const {isLoggedin}=require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");


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


const reviewController=require("../controllers/review.js");


//Route to add a new review
router.post("/", isLoggedin,validateReview, wrapasync(reviewController.addReview));


// Route to delete a review
router.delete("/:reviewId",isReviewAuthor, wrapasync(reviewController.deleteReview));


module.exports = router;
