const express = require('express');
const router = express.Router();
const { Comment, User } = require('../models');

// 发表评论
router.post('/', async (req, res) => {
  const { user_id, product_id, content } = req.body;
  try {
    const comment = await Comment.create({ user_id, product_id, content });
    res.json({ message: '评论成功', comment });
  } catch (err) {
    res.status(500).json({ message: '评论失败', error: err.message });
  }
});

// 获取商品评论
router.get('/:productId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { product_id: req.params.productId },
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: '获取评论失败', error: err.message });
  }
});

module.exports = router; 