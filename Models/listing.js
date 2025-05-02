const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"  //review Model
    }
  ],
  owner: {
    type:Schema.Types.ObjectId,
    ref:"User",
  },

});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


// Ensure model name is "Listing"
const Listing = mongoose.model("Listing", listingSchema);//collection name

module.exports = Listing;
















