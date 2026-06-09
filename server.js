const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据库
const db = {
  users: [
    // 示例用户，密码为 "password123"，使用bcrypt哈希
    {
      id: 1,
      email: "user@example.com",
      password: "$2a$10$8f0e3b7a6c1d9e2f5a4b3c2d1e0f9a8b$e8b7d5f3a1c9e7d3b5f7a9c1e3d5b7f9a1c3e5d7b9f1a3c5e7d9b1f3a5c7e9d1",
      nickname: "AdminUser"
    }
  ]
};

// 密码强度验证
function validatePasswordStrength(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    allValid: password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

// 注册端点
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 检查邮箱是否已存在
    const existingUser = db.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: '邮箱已被注册' });
    }

    // 验证密码强度
    const passwordStrength = validatePasswordStrength(password);
    if (!passwordStrength.allValid) {
      return res.status(400).json({ 
        error: '密码强度不足',
        details: passwordStrength
      });
    }

    // 使用bcryptjs哈希密码，设置12轮迭代
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = {
      id: db.users.length + 1,
      email,
      password: hashedPassword,
      nickname: nickname || email.split('@')[0]
    };

    // 保存用户到数据库
    db.users.push(newUser);

    // 返回成功响应
    res.status(201).json({ 
      message: '注册成功',
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 登录端点
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = db.users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 返回成功响应
    res.status(200).json({ 
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
app.get('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.users.find(user => user.id === parseInt(id));
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('API端点:');
  console.log('  POST /api/register - 注册新用户');
  console.log('  POST /api/login - 用户登录');
  console.log('  GET /api/user/:id - 获取用户信息');
  console.log('');
  console.log('示例请求:');
  console.log('  注册: curl -X POST -H "Content-Type: application/json" -d "{\"email\":\"newuser@example.com\",\"password\":\"SecurePass123!\",\"nickname\":\"NewUser\"}" http://localhost:3000/api/register');
  console.log('  登录: curl -X POST -H "Content-Type: application/json" -d "{\"email\":\"newuser@example.com\",\"password\":\"SecurePass123!\"}" http://localhost:3000/api/login');
  console.log('');
  console.log('注意: 这是一个示例服务器，用于演示密码安全存储机制，请勿用于生产环境。');
});