const Listing = require("../Models/listing.js");

module.exports.index=async (req,res)=>{

  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});

};

//new Route callback
module.exports.new=(req,res)=>{
    if(!req.isAuthenticated()){//Verify login before creating listing
      req.flash("error","you must be logged in to Create a listing!");
      return res.redirect("/listings");
    }
    res.render("listings/new.ejs");
}

//create Route callback
module.exports.create=async (req,res,next)=>{
    // in form name=title then below
    // let {title,description,price,image,country,location}=req.body;
    //in form name=listing[title] array then this
    // client didnot send valid request then
    const newlisting= new Listing(req.body.listing);
    //new account new listings to tract user related listings
    newlisting.owner=req.user._id;

    await newlisting.save()

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    
}

//show Route
module.exports.show=async(req,res)=>{

  let {id}=req.params;
  const listing=await Listing.findById(id).populate({path:"reviews",populate:{path: "author"}}).populate("owner");

  if(!listing){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");///if listing doesnot exist redirect to listings
    //after and flash the message on top.
  } 
  res.render("listings/show.ejs",{listing});

};


//edit Route Callback

module.exports.edit=async (req,res)=>{

  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});

};


//update route callback
module.exports.update=async (req, res) => {
  let { id } = req.params;
 
  if (!req.body.listing) {
      throw new ExpressError(400, "Invalid listing data!");
  }
 
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);

}


//delete Route callback
module.exports.delete=async (req,res) =>{
  
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");

};