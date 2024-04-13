// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 引用資料
const articleService = require('../services')

// 建立路由
const router = Router()

// GET /articles (回傳文章列表)
router.get('/', (req, res) => {
  res.json(articleService.getList())
})

// POST /articles (新增文章)
router.post('/', (req, res) => {
  const BODY = req.body
  console.log(JSON.stringify(BODY))
  res.json(articleService.add(BODY))
})

// 輸出 Router
module.exports = router
