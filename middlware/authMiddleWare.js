const session = require('express-session');


const sessionMiddleWare = session({
    secret: 'yourSecretKey',
    saveUninitialized:true,
    cookie:{
        secure:false,
        maxAge:1000*60*60,
    }
})

module.exports = sessionMiddleWare;