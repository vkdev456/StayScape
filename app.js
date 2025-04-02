const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./Models/review.js");
const listings = require("./routes/listing.js"); // Fixed path
const Listing = require("./Models/listing.js");
 
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Stayscape");
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

main();

const app = express();


//validate Review
const validateReview = (req, res, next) => {
  if (!req.body || !req.body.review) {
    throw new ExpressError(400, "Invalid listing data!");
  }

  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

app.use("/listings",listings);


//path
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);//include /partical in express ejs
app.use(express.static(path.join(__dirname,"/public")));


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});


app.get("/",(req,res)=>{
  res.send('Hi, I am Root');
})

app.get("/testListing", async (req, res) => {

  const sampleListing = new Listing({
      title: "My new Villa",
      description: "By the Beach",
      price: 1200,
      location: "Calangute, Goa",
      country: "India",
  });

  await sampleListing.save();
  console.log("Sample listing saved successfully");
  res.send("successful testing");

});

// Add Route for Reviews
app.post("/listings/:id/reviews", validateReview,async(req,res)=>{

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
 
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);

});

//Delete Route for Reviews
app.delete("/listings/:id/reviews/:reviewId", wrapasync(async (req, res) => {
  let { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review from the database
  await Review.findByIdAndDelete(reviewId);
  console.log("Deleting review:", reviewId, "from listing:", id);

  res.redirect(`/listings/${id}`); // Redirect to the specific listing
}));

//if Route other than above
// * is used take that Route 

app.all("*",(req,res,next)=>{

  next(new ExpressError(404, "Page not found!"));

});

app.use((err,req,res,next)=>{

  let {statusCode=500,message="Some thing went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{ message });
  // res.status(statusCode).send(message);

})




























