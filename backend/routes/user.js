const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// 用户注册
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const exist = await User.findOne({ where: { username } });
    if (exist) return res.status(400).json({ message: '用户名已存在' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, email });
    res.json({ message: '注册成功', user });
  } catch (err) {
    res.status(500).json({ message: '注册失败', error: err.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: '用户不存在' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: '密码错误' });
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '7d' });
    res.json({ message: '登录成功', token, user });
  } catch (err) {
    res.status(500).json({ message: '登录失败', error: err.message });
  }
});

// 获取用户信息
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: '用户不存在' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '获取失败', error: err.message });
  }
});

// 修改用户信息
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: '用户不存在' });
    await user.update(req.body);
    res.json({ message: '修改成功', user });
  } catch (err) {
    res.status(500).json({ message: '修改失败', error: err.message });
  }
});

module.exports = router; 