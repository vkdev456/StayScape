const express = require('express');
const app=express();
const session=require("express-session");

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized: true
}

app.use(session(sessionOptions));


app.listen("5000",()=>{
    console.log("Serve is listening to 5000");
});


app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`);
});


app.get("/register",(req,res)=>{
    // /lets we get username from the requests new registration
    let {name="anonymous"}=req.query;
    req.session.name=name;
    console.log(req.session.name);
    res.send(name);
});


app.get("/hello",(req,res)=>{
    res.send(`hello, ${req.session.name}`);
})

