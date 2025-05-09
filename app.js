const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { parseArgs } = require("util");

const dburl=process.env.ATLASDB_URL;

async function main(){
  try {
    await mongoose.connect(dburl);
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

app.listen(5000, () => {
  console.log("Server is listening on port 8080");
});


const store=MongoStore.create({

  mongoUrl:dburl,
  crypto:{
    secret:"mysupersecretcode"
  },
  touchAfter: 24*3600 // session time no need to login back 

})


//sessions
const sessionOptions={
  store, //mongo store 
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000, //mille seconds
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
}


store.on("error",()=>{
  console.log("Error in MONGO SESSION STORE",err);
});



//session
app.use(session(sessionOptions));
app.use(flash());

//always after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// to authenticate users

//To Store and Remove User Data from session storage
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;//for Login logout in nav bar
  //current user session
  next();
});

// app.get("/demouser",async (req,res)=>{

//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student"
//   });

//   let registeredUser=await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);

// });

//routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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




























































 