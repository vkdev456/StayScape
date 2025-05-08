if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const {isLoggedin}=require("../middleware.js");
const {isOwner}=require("../middleware.js");

const multer=require('multer');//form data parse

const {storage}=require("../cloudConfig.js");
//temp we are saving in folder later we are give clound link
const upload=multer({ storage });//storing in cloudinary

  
const listingController=require("../controllers/listings.js");


//validation Listing
const validateListing = (req, res, next) => {
    if (!req.body || !req.body.listing) {
      throw new ExpressError(400, "Invalid listing data!");
    }
  
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }
    next();
};

//index route retrieve listings
router.get("/",wrapasync(listingController.index));

//New listing route form
router.get("/new",isLoggedin,listingController.new);//this shoudl be above show route code
//because if it overwise it thinks new as id

//Create Route
router.post("/",upload.single('listing[image]'),validateListing,  wrapasync(listingController.create));


 
//Show Route
router.get("/:id",wrapasync(listingController.show));

//edit Route
router.get("/:id/edit",isLoggedin,isOwner,wrapasync(listingController.edit));

//update route
router.put("/:id", isLoggedin,isOwner,upload.single('listing[image]'),validateListing, wrapasync(listingController.update));

//Delete
router.delete("/:id", isLoggedin,isOwner,wrapasync(listingController.delete));


module.exports=router;













