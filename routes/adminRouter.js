const express = require("express");
const { adminCreation, getLoginAdmin, postLoginAdmin, getAdminDashboard, adminLogout, deleteUser, getEditUserPage, postEditUser, searchUsers, getCreateUserPage, postCreateUser } = require("../controller/adminController");
const adminRouter = express.Router();

// adminRouter.post("/creation",adminCreation);

adminRouter.get("/adminlogin",getLoginAdmin);
adminRouter.post("/adminlogin",postLoginAdmin);

adminRouter.get("/dashboard",getAdminDashboard);

adminRouter.get("/adminlogout",adminLogout);

adminRouter.get("/delete/:id", deleteUser);

adminRouter.get("/edit/:id", getEditUserPage);
adminRouter.post("/edit/:id", postEditUser);

adminRouter.get("/search", searchUsers);

adminRouter.get('/create', getCreateUserPage);
adminRouter.post('/create', postCreateUser);


module.exports = adminRouter ;