const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");

// Whenever we navigate to ANY page, make the "user" session object available to the
// Handlebars engine by adding it to res.locals.
router.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view, supplying the given "message" query parameter
// to the view engine, if any.
router.get("/login", function (req, res) {

    if (req.session.user) {
        res.redirect("/");
    }

    else {
        res.locals.message = req.query.message;
        res.render("login");
    }

});

// Add the new route handler here
router.get("/newAccount", function (req, res) {
    res.render("new-account");
})




// Route handler for POST request to /newAccount
router.post("/newAccount", async function (req, res) {
    try {
        // Read submitted name, username, and password from the form
        const user = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        }

        // Create a new user in the system
        await userDao.createUser(user);

        // Redirect to /login with a success message
        res.redirect("./login?message=Account created successfully!");
    } catch (error) {
        // Handle errors (e.g., username already exists)
        res.redirect("./newAccount?message=Error creating account!");
    }
});




// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, add that user to the session and redirect to "/".
// Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - add the user to the session, and redirect to the homepage.
        req.session.user = user;
        res.redirect("/");
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.redirect("./login?message=Authentication failed!");
    }
});

// Whenever we navigate to /logout, delete any user object from the session. Then,
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect("./login?message=Successfully logged out!");
});

module.exports = router;


router.get("/account_management", function (req, res) {
    res.render("account_management");
})


