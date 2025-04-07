const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");


const listings = require("./routes/listing.js");
const reviews=require("./routes/review.js");


async function main(){
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Stayscape");
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}
main();

const app = express();

//sessions
const sessionOptions={
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000, //mille seconds
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
}







//path
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);//include /partical in express ejs
app.use(express.static(path.join(__dirname,"/public")));

app.use(session(sessionOptions));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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

// ✅ Ensure this is correctly placed


//if Route other than above
// * is used take that Route 
app.all("*",(req,res,next)=>{
  next(new ExpressError(404, "Page not found!"));
});


app.use((err,req,res,next)=>{

  let {statusCode=500,message="Some thing went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{ message });
  // res.status(statusCode).send(message);
});




 