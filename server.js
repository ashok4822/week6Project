const express = require("express");
const session = require("express-session");
const nocache = require("nocache");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute.js");
const adminRouter =require("./routes/adminRouter.js");
const sessionMiddleWare = require("./middlware/authMiddleWare.js");


const app =express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(nocache());


//session
// app.use(session({secret:"mysecret",resave:false,saveUninitialized:false,cookie: { secure: false },}));


//view engine
app.set("view engine","ejs");

//mongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/user")
    .then(()=>console.log("MongoDB connected"))
    .catch(err=>console.log(err));

// User session middleware
app.use("/", session({
    name: "user.sid",
    secret: "user_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set secure: true in production with HTTPS
  }));
  
  // Admin session middleware
  app.use("/admin", session({
    name: "admin.sid",
    secret: "admin_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

// app.use(sessionMiddleWare);

//Routes
app.use("/",userRouter);
app.use("/admin",adminRouter);


//start server
app.listen(3000,()=>console.log(`Server running on port: http://localhost:3000`));