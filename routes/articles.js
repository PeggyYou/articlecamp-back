// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 引用資料
const articleService = require('../services')

// 建立路由
const router = Router()

// GET/ Articles
router.get('/', (req, res) => {
  res.json(articleService.read())
})

// 輸出 Router
module.exports = router
