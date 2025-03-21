const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:"https://unsplash.com/photos/a-lake-surrounded-by-mountains-and-trees-under-a-blue-sky-jV8916l2k0I",
    set: (v) => v === "" ? "https://unsplash.com/photos/a-lake-surrounded-by-mountains-and-trees-under-a-blue-sky-jV8916l2k0I": v,
  },
  price: Number,
  location: String,
  country: String,
});


// Ensure model name is "Listing"
const Listing = mongoose.model("Listing", listingSchema);//collection name

module.exports = Listing;
















