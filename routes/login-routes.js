const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");

const articlesDao = require("../modules/articles-dao.js"); // improt article mode
const commentsDao = require("../modules/comments-dao.js"); // import comments
const hitsDao = require("../modules/hits-dao.js"); // import hits

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
router.get('/check-username', async (req, res) => {
    const { username } = req.query;
    const userExists = await userDao.userExistsWithUsername(username); //User.findOne({ where: { username } });
    res.json({
        isAvailable: !userExists });
});



// Add the new route handler here
router.get("/newAccount", function (req, res) {
    res.render("new-account");
})

// Route handler for POST request to /newAccount
router.post("/newAccount", async function (req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
        // Read submitted name, username, and password from the form
        const user = {
            name: req.body.name,
            username: req.body.username,
            // password: req.body.password,
            password: hashedPassword,
            birthday: req.body.birthday,
            description: req.body.description,
            avatar: req.body.avatar
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


//------------------------------------account management
router.get("/account_management", function (req, res) {
    const user = req.session.user;
    res.render("account_management", {user: user});
});

router.post("/changeUserProfile", async function (req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
        // Read submitted name, username, and password from the form
        const user = {
            id: req.body.userId,
            name: req.body.name,
            username: req.body.username,
            // password: req.body.password,
            password: hashedPassword,
            birthday: req.body.birthday,
            description: req.body.description,
            avatar: req.body.avatar
        }

        // Create a new user in the system
        await userDao.updateUser(user);

        // Redirect to /login with a success message
        res.redirect("./login?message=Account changed successfully!");
    } catch (error) {
        // Handle errors (e.g., username already exists)
        res.redirect("./newAccount?message=Error change account!");
    }
});






//--------------------------------




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
    res.redirect("/");//./login?message=Successfully logged out!
});

router.get("/deleteAccount", function (req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    const userId = req.query.userId;
    //先删除该用户的所有文章、点赞和评论数据
    hitsDao.deleteLike(userId);//删除用户的所有点赞

    const myArticles = articlesDao.getMyArticles(userId);
    myArticles.forEach(function(item){
      let articleId = item.ArticleId;
      deleteArticle(articleId);//删除文章以及该文章的所有点赞、评论
    });

    const myComments = commentsDao.getMyComments(userId);
        myComments.forEach(function(item){
          let replyNum = item.ReplyNum;
          let commentId = item.Id;
          let parentId = item.ParentId;
          if(parentId == -1){//顶级评论1
              commentsDao.deleteComment_1(commentId);
          }else if(parentId > 0 && replyNum > 0){//跟帖回复2
              commentsDao.deleteComment_2(parentId,commentId);
          }else{//跟帖回复3
              commentsDao.deleteComment_3(parentId,commentId);
          }
        });
    res.status(200).send("SUCCESS");
});

module.exports = router;













