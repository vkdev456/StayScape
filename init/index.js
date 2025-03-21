const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../Models/listing.js");


async function main() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/Stayscape");
      console.log("Connected to DB");
    } catch (err) {
      console.error("DB connection error:", err);
    }
  }
  main();
  
  
const initDB = async () => {

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);//initdata came as object
    console.log("data was initialized");
    
}

initDB();

  
  


