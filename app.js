

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

//////////////////////////////////////
const multer = require('multer');
// 配置上传目录
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) { // 在这里设定文件名
        cb(null, file.originalname); // file.originalname是将文件名设置为上传时的文件名，file中携带的
        // cb(null,url+ Date.now() + '-' + file.originalname) // 加上Date.now()可以避免命名重复
    }
})
const upload = multer({ storage: storage })
// 处理图片上传
app.post('/upload', upload.single('upload'), (req, res) => {
    // 确保文件存在
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    //非常重要。 返回数据实际格式应该是{"uploaded":1,"url":"/","fileName":name}
    const filePath = `/uploads/${req.file.filename}`;
    const data = {"uploaded":1,"url":filePath,"fileName":'${req.file.filename}'};
    res.status(200).send(data);
});
////////////////////////////////


// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Setup express-session
const session = require("express-session");
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "CS719"
}));

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup our routes
const loginRouter = require("./routes/login-routes.js");
app.use(loginRouter);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});
