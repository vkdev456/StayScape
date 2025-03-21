const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js"); // ✅ Ensure correct import

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Stayscape");
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}
main();

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





























