const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
//哈希密码
const bcrypt = require('bcrypt');
const saltRounds = 10;  // 或更高以增加安全性，但会消耗更多计算资源

//连接到mongoDB数据库
mongoose.connect('mongodb://localhost/webdata', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

//使用 mongoose 定义一个用户模型，这将用于存储用户注册信息：
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // 注意：实践中应加密存储密码
});

const User = mongoose.model('User', userSchema);

// 配置中间件
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

//连接到静态地址
app.use(express.static(path.join(__dirname, 'public')));

//显示初始页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//设置端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//注册逻辑，async异步生成
app.post('/register', async (req, res) => {
    try {
        // 生成密码的哈希 通过await达到异步效果
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        let newUser = new User({
            username: req.body.username,
            password: hashedPassword  // 存储哈希后的密码
        });

        await newUser.save();
        console.log('User registered:', newUser);
        res.redirect('./html/login.html');  // 注册成功，重定向到登录页面
    } catch (err) {
        console.error('Error registering user', err);
        res.status(500).send("Error registering user.");
    }
});


//登录逻辑
app.post('/login', async (req, res) => {
    try {
        // 查找用户
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user._id; // 验证通过，保存用户 session
            res.redirect('./html/about.html'); // 导航到仪表板
        } else {
            res.status(401).send("Username or password is incorrect");
        }
    } catch (err) {
        console.error('Error logging in', err);
        res.status(500).send("Error logging in.");
    }
});

