// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 引用資料
const Article = require('../models')

// 建立路由
const router = Router()

// GET request
router.get('/', (req, res) => {
  res.json(Article.read())
})

// 輸出 Router
module.exports = router
