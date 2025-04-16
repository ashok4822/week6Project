const express = require("express");
const { getSignup, postSignup, getLogin, postLogin, home, logoutUser } = require("../controller/userController.js");
const userRouter = express.Router();


userRouter.get("/signup",getSignup);
userRouter.post("/signup",postSignup);

userRouter.get("/",getLogin );
userRouter.get("/login",getLogin );
userRouter.post("/login",postLogin );

userRouter.get("/home",home);

userRouter.get("/logout",logoutUser);



module.exports = userRouter;