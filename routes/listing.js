const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../Models/listing.js");
const {isLoggedin}=require("../middleware.js");


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
router.get("/",wrapasync(async (req,res)=>{

  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});

}));

//New listing route form
router.get("/new",isLoggedin,(req,res)=>{
    if(!req.isAuthenticated()){//Verify login before creating listing
      req.flash("error","you must be logged in to Create a listing!");
      return res.redirect("/listings");
    }
    res.render("listings/new.ejs");
});//this shoudl be above show route code
//because if it overwise it thinks new as id


//create Route
router.post("/",validateListing,wrapasync(async (req,res,next)=>{
    // in form name=title then below
    // let {title,description,price,image,country,location}=req.body;
    //in form name=listing[title] array then this
    // client didnot send valid request then
    const newlisting= new Listing(req.body.listing);
    await newlisting.save()

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    
  })
);

//Show Route
router.get("/:id",wrapasync(async(req,res)=>{

  let {id}=req.params;
  const listing=await Listing.findById(id).populate("reviews");

  if(!listing){
    req.flash("success", "Listing you requested for does not exist");
    res.redirect("/listings");///if listing doesnot exist redirect to listings
    //after and flash the message on top.
  }

  res.render("listings/show.ejs",{listing});

}));

//edit Route
router.get("/:id/edit",isLoggedin,wrapasync(async (req,res)=>{

  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

}));

//update route
router.put("/:id", validateListing, wrapasync(async (req, res) => {
  let { id } = req.params;
  console.log("Received Update Request:", req.body); 

  if (!req.body.listing) {
      throw new ExpressError(400, "Invalid listing data!");
  }
 
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);

}));

//Delete
router.delete("/:id", isLoggedin,wrapasync(async (req,res) =>{
  
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");

}));

module.exports=router;













