const bcrypt = require("bcrypt");
const Admin = require("../model/Admin.js");
const User = require("../model/User.js");



//POST Admin creation
// async function adminCreation(req,res){
//     const {name,email,password} = req.body;
//     const hashedPassword = await bcrypt.hash(password,10);
//     const admin = new Admin({
//             name,
//             email,
//             password:hashedPassword
//         });
//     await admin.save();
//     res.sendStatus(200);
// }

//GET admin login
function getLoginAdmin (req,res){
    if (req.session.admin) {
        return res.redirect('/admin/dashboard');
    }

    res.render("admin/adminlogin",{ error: null });
}


//POST admin login
async function postLoginAdmin (req,res){
    const {email,password} = req.body;
    const admin = await Admin.findOne({email});
    if(admin && await bcrypt.compare(password,admin.password)){
        req.session.admin = admin;
        res.redirect("/admin/dashboard");
    }else{
        res.render("admin/adminlogin",{error:"Invalid credantials"});
    }
}

//GET admin dashboard
async function getAdminDashboard (req,res){
    if (!req.session.admin) {
        return res.redirect("/admin/adminlogin");
      }
    const users = await User.find();

      res.render("admin/admindashboard", { admin: req.session.admin, users});
}

//Admin logout
function adminLogout (req,res){
    req.session.destroy((err)=>{
        if(err){
            return res.redirect("admin/admindashboard");
        }

        res.redirect("/admin/adminlogin");
    })
}


//Delete user
async function deleteUser (req,res){
    const userId = req.params.id;

    try {
        await User.findByIdAndDelete(userId);
        res.redirect("/admin/dashboard"); // Redirect back to dashboard after deletion
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Failed to delete user");
    }
}


// GET Edit User Page
async function getEditUserPage(req, res) {
    const userId = req.params.id;

    if (!req.session.admin) {
        return res.redirect("/admin/adminlogin");
    }
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.render("admin/edit", { user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
}

// POST Edit User Data
async function postEditUser(req, res) {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        // Check if password is provided; if not, skip hashing
        let updateData = { username:name, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);  // Hash password if provided
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.redirect("/admin/dashboard"); // Redirect to dashboard after successful update
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
}

//Search functionality
async function searchUsers(req, res) {
    const query = req.query.q;
    if (!req.session.admin) {
        return res.redirect("/admin/adminlogin");
    }

    try {
        const users = await User.find({
            email: { $regex: query, $options: "i" } // case-insensitive
        });

        res.render("admin/admindashboard", {
            admin: req.session.admin,
            users,
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

// GET: Render Create User Page
function getCreateUserPage(req, res) {
    if (!req.session.admin) return res.redirect('/admin/adminlogin');
    res.render('admin/createUser'); // createUser.ejs
  }
  
  // POST: Create a new user
  async function postCreateUser(req, res) {
      const { username, email, password } = req.body;
    try{
        const userData = await User.findOne({email});
        if(userData){
            return res.render("admin/createUser",{error:"Email already in use"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.redirect('/admin/dashboard');
    }catch(error){
        console.error("Signup error:", error);
        res.render("admin/createUser", { error: "Something went wrong. Please try again." });
    }
  }



module.exports = {
    // adminCreation,
    getLoginAdmin,
    postLoginAdmin,
    getAdminDashboard,
    adminLogout,
    deleteUser,
    getEditUserPage,
    postEditUser,
    searchUsers,
    getCreateUserPage,
    postCreateUser

};