const Listing = require("../Models/listing.js");

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    return next(err);  // Pass the error to error-handling middleware
  }
};

// New Route callback
module.exports.new = (req, res) => {
  if (!req.isAuthenticated()) { // Verify login before creating listing
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/listings");
  }
  res.render("listings/new.ejs");
};

// Create Route callback
module.exports.create = async (req, res, next) => {
  try {
    // File upload
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");  // Return immediately after the redirect

  } catch (err) {
    return next(err);  // Handle any error (e.g., DB errors) and pass to error middleware
  }
};

// Show Route callback
module.exports.show = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings"); // If listing doesn't exist, redirect to listings page
    }

    res.render("listings/show.ejs", { listing });

  } catch (err) {
    return next(err); // Pass the error to the error-handling middleware
  }
};

// Edit Route callback
module.exports.edit = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
  } catch (err) {
    return next(err);  // Handle errors (DB, etc.)
  }
};

// Update Route callback
module.exports.update = async (req, res, next) => {
 
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!="undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image={url,filename};
       await listing.save();
  }

  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);


};

// Delete Route callback
module.exports.delete = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted");
    res.redirect("/listings");

  } catch (err) {
    return next(err);  // Handle any errors
  }
};
