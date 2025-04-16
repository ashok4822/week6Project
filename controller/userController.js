const bcrypt = require("bcrypt");
const User = require("../model/User.js");


//GET signup
function getSignup(req,res){
    if (req.session.user) {
        return res.redirect('/home');
    }
    res.render("signup");
}

//POST signup
 async function postSignup (req,res){
    const {username,email,password} = req.body;
    try{
        const userData = await User.findOne({email});
        if(userData){
            return res.render("signup",{error:"Email already in use"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
            username,
            email,
            password:hashedPassword
        });
        await user.save();
        res.redirect("/login");
    } catch(error){
        console.error("Signup error:", error);
        res.render("signup", { error: "Something went wrong. Please try again." });
    }
}

//GET login
function getLogin (req,res){
    if (req.session.user) {
        return res.redirect('/home');
    }

    res.render("login",{ error: null });
}

//POST login
async function postLogin (req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && await bcrypt.compare(password,user.password)){
        req.session.user = user;
        res.redirect("/home");
    }else{
        res.render("login",{error:"Invalid credantials"});
    }
}

//GET home
async function home (req,res) {
    
        if (!req.session.user) {
            return res.redirect("/");
          }
          res.render("home", { username: req.session.user.username, email:req.session.user.email });
}

//GET Logout User
function logoutUser (req,res){
    req.session.destroy((err)=>{
        if(err){
            return res.redirect("/home");
        }
        res.redirect("/");
    })
}


module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    home,
    logoutUser
};