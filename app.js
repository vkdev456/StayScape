const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js"); // ✅ Ensure correct import
const path=require("path");

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

//path
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});


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


//index route retrieve listings
app.get("/listings",async (req,res)=>{

  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});

});






























