const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js"); // ✅ Ensure correct import
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


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

//index route retrieve listings
app.get("/listings",async (req,res)=>{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});

});

//New listing route form
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});//this shoudl be above show route code
//because if it overwise it thinks new as id


//create Route
app.post("/listings",async(req,res)=>{
  // in form name=title then below
  // let {title,description,price,image,country,location}=req.body;
  //in form name=listing[title] array then this
  const newlisting= new Listing(req.body.listing);
  await newlisting.save()
  res.redirect("/listings");
})


//Show Route
app.get("/listings/:id",async(req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id);
      res.render("listings/show.ejs",{listing});
})

//edit Route
app.get("/listings/:id/edit",async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});

//update
app.put("/listings/:id", async (req,res) =>{
  
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
  
});

//Delete
app.delete("/listings/:id", async (req,res) =>{
  
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
   
});




























