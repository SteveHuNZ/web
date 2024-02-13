// const express = require("express");
// const router = express.Router();
//
// const verifyAuthenticated = require("../modules/verify-auth.js");
// const messagesDao = require("../modules/messages-dao.js");
//
// // Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
// router.get("/", verifyAuthenticated, async function(req, res) {
//     try {
// // get current  ID of user uses ，here, we assume that the user's messages are stored in session
//         const userId = req.session.user.id;
//
// // get messages of user received
//         const receivedMessages = await messagesDao.getReceivedMessages(userId);
//         // render main page,put message into viewport
//         res.render("home", {messages: receivedMessages});
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });
//
// module.exports = router;

const express = require("express");
const router = express.Router();

const verifyAuthenticated = require("../modules/verify-auth.js");
const messagesDao = require("../modules/messages-dao.js"); // 导入消息模块
const articlesDao = require("../modules/articles-dao.js"); // 导入文章模块
const commentsDao = require("../modules/comments-dao.js"); // 导入评论模块
const hitsDao = require("../modules/hits-dao.js"); // 导入点赞模块
const userDao = require("../modules/users-dao");//


router.get("/clickLike", verifyAuthenticated, async function (req, res) {
                                   try {
                                       const like = {
                                           articleId: req.query.articleId,
                                           userId: req.session.user.id,
                                       }
                                       await hitsDao.createLike(like);
                                       res.status(200).send("SUCCESS");
                                   } catch (error) {
                                       console.error(error);
                                       res.status(500).send("Internal Server Error");
                                   }
                               });
router.get("/deleteComments_3", verifyAuthenticated, async function (req, res) {
                                   try {
                                       var parentId = req.query.parentId;
                                       var commentId = req.query.commentId;
                                       await commentsDao.deleteComment_3(parentId,commentId);
                                       res.status(200).send("SUCCESS");
                                   } catch (error) {
                                       console.error(error);
                                       res.status(500).send("Internal Server Error");
                                   }
                               });
router.get("/deleteComments_2", verifyAuthenticated, async function (req, res) {
                                   try {
                                       var parentId = req.query.parentId;
                                       var commentId = req.query.commentId;
                                       await commentsDao.deleteComment_2(parentId,commentId);
                                       res.status(200).send("SUCCESS");
                                   } catch (error) {
                                       console.error(error);
                                       res.status(500).send("Internal Server Error");
                                   }
                               });
router.get("/deleteComments_1", verifyAuthenticated, async function (req, res) {
                                   try {
                                       var commentId = req.query.commentId;
                                       await commentsDao.deleteComment_1(commentId);
                                       res.status(200).send("SUCCESS");
                                   } catch (error) {
                                       console.error(error);
                                       res.status(500).send("Internal Server Error");
                                   }
                               });
router.get("/deleteAllComments", verifyAuthenticated, async function (req, res) {
                                   try {
                                       var articleId = req.query.articleId;
                                       await commentsDao.deleteAllComments(articleId);
                                       res.status(200).send("SUCCESS");
                                   } catch (error) {
                                       console.error(error);
                                       res.status(500).send("Internal Server Error");
                                   }
                               });
router.post("/addComment", verifyAuthenticated, async function (req, res) {
    try {
        var articleId = req.body.articleId;
        var commentId = req.body.commentId;
        //console.log('===>articleId='+articleId+"  commentId="+commentId);
        if(commentId == null || commentId == "")commentId = -1;
        const comment = {//articleId, parentId, userId, content
            articleId: articleId,
            parentId: commentId,
            content: req.body.content,
            userId: req.session.user.id,
            userName: req.session.user.username,
            replyNum: 0
        }
        await commentsDao.createComment(comment);
        res.status(200).send("SUCCESS");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/getReplies", verifyAuthenticated, async function (req, res) {
    try {
        const userId = req.session.user.id;
        let replies = await commentsDao.getReplies(req.query.parentId);
        // 增加新字段
            replies = replies.map(item => {
              if(item.UserId == req.session.user.id){
                item.isMine = true;
              }else{
                item.isMine = false;
              }
              return item;
            });
        res.status(200).send(replies);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/pageArticles", verifyAuthenticated, async function (req, res) {
    try {
        const userId = req.session.user.id;
        let allArticles = await articlesDao.getAllArticles();
        // 增加新字段
            allArticles = allArticles.map(item => {
              if(item.UserId == req.session.user.id){
                item.isMine = true;
              }else{
                item.isMine = false;
              }
              return item;
            });
        //res.render("home", {messages: receivedMessages, articles: allArticles, myUserId: userId});
        res.status(200).send(allArticles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/allArticles", verifyAuthenticated, async function (req, res) {
    try {
        const userId = req.session.user.id;
        const receivedMessages = await messagesDao.getReceivedMessages(userId);
        let allArticles = await articlesDao.getAllArticles();
        // 增加新字段
            allArticles = allArticles.map(item => {
              if(item.UserId == req.session.user.id){
                item.isMine = true;
              }else{
                item.isMine = false;
              }
              return item;
            });
        res.render("home", {messages: receivedMessages, articles: allArticles, myUserId: userId});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/myArticles", verifyAuthenticated, async function (req, res) {
    try {
        const userId = req.session.user.id;
        //const receivedMessages = await messagesDao.getReceivedMessages(userId);
        var myArticles = await articlesDao.getMyArticles(userId);
        // 增加新字段
            myArticles = myArticles.map(item => {
              item.isMine = false;
              return item;
            });
        res.render("home", {articles: myArticles, myUserId: userId});
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/", async function (req, res) {
    try {
        const user = req.session.user;
        if(user == null){
                let allArticles = await articlesDao.getAllArticles();
                res.render("home", {articles: allArticles});
        }else{
            const userId = req.session.user.id;
                    const userName = req.session.user.username;
                    //const receivedMessages = await messagesDao.getReceivedMessages(userId);
                    let allArticles = await articlesDao.getAllArticles();
                        allArticles = allArticles.map(item => {
                          if(item.UserId == req.session.user.id){
                            item.isMine = true;
                          }else{
                            item.isMine = false;
                          }
                          return item;
                        });
                    //res.render("home", {messages: receivedMessages, articles: allArticles, myUserId: userId, user: user});
                    res.render("home", {articles: allArticles, myUserId: userId, user: user});
        }



    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



router.post("/send-message", verifyAuthenticated, async function (req, res) {
    try {
        const senderId = req.session.user.id;
        const { receiverUsername, content } = req.body;

        // Retrieve the receiver's ID based on the username
        const receiverId = await messagesDao.getUserIdByUsername(receiverUsername);

        if (receiverId) {
            // If the receiver exists, create and send the message
            await messagesDao.createMessage(senderId, receiverId, content);
            res.redirect("/?message=Message sent successfully!");
        } else {
            // If the receiver doesn't exist, display an error message
            res.redirect("/?error=Receiver not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/changeUsername", verifyAuthenticated, async (req, res) => {
    let result = await userDao.updateUserName(req.session.user, req.body.newUsername);

    if (result) {
        res.redirect("/account_management?message=success");
    } else {
        res.redirect("/account_management?message=failure");
    }
});

router.get("/articleDetails", async (req, res) => {
    let user = req.session.user;
    let articleId = req.query.id;
    let theArticle = await articlesDao.getArticleById(articleId);
    // 增加新字段
    if(user){
        if(theArticle.UserId == req.session.user.id){
                    theArticle.isMine = true;
                  }else{
                    theArticle.isMine = false;
                  }
    }

    let allComments = await commentsDao.getAllComments(articleId);
    // 增加新字段
    if(user){
      allComments = allComments.map(item => {
            if(item.UserId == req.session.user.id){
              item.isMine = true;
            }else{
              item.isMine = false;
            }
            return item;
          });
    }
    res.render("articleDetails", {article: theArticle, comments: allComments, user: user});
});
router.get("/articleEdit", verifyAuthenticated, async (req, res) => {
    let theArticle = await articlesDao.getArticleById(req.query.id);
    res.render("editArticle", {article: theArticle});
});
router.post("/modifyArticle", async function (req, res) {
    try {
        const article = {
            id: req.body.articleId,
            title: req.body.title,
            content: req.body.content,
        }
        await articlesDao.modifyArticle(article);
        res.redirect("./");
    } catch (error) {
        console.log("ERROR,PLEASE MODIFY AGAIN.");
    }
});
router.get("/articleDelete", async function (req, res) {
    try {
        await articlesDao.deleteArticle(req.query.id);
        res.redirect("./");
    } catch (error) {
        console.log("ERROR,PLEASE DELETE AGAIN.");
    }
});
router.get("/newArticle", verifyAuthenticated, async (req, res) => {
    res.render("createArticle");
});

router.post("/createArticle", async function (req, res) {
    try {
        const article = {
            userId: req.session.user.id,
            userName: req.session.user.username,
            title: req.body.title,
            content: req.body.content,
        }
        await articlesDao.createArticle(article);
        res.redirect("./");
    } catch (error) {
        console.log("ERROR,PLEASE SUBMIT AGAIN.");
    }
});
module.exports = router;