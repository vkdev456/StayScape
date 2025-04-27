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

  const ownerId = new mongoose.Types.ObjectId("680c5f02a9007ce7f2036ad5");

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: ownerId
  }));

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}

initDB();
