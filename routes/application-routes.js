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

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", verifyAuthenticated, async function (req, res) {
    try {
// 获取当前用户的 ID，这里假设用户信息存储在 session 中
        const userId = req.session.user.id;

// 获取用户接收到的所有消息
        const receivedMessages = await messagesDao.getReceivedMessages(userId);

// 渲染主页视图，传递消息列表给视图
        res.render("home", {messages: receivedMessages});
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
module.exports = router;