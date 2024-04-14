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

// POST /articles (新增單篇文章)
router.post('/', (req, res) => {
  const BODY = req.body
  console.log(JSON.stringify(BODY))

  articleService
    .add(BODY)
    .then((article) => {
      console.log(`post article success:${article}`)
      res.json(article)
    })
    .catch((error) => {
      console.log(`post article error:${error}`)
      res.json(article)
    })
})

// GET /articles/:id (回傳單篇文章)
router.get('/:id', (req, res) => {
  const id = req.params.id
  console.log(`req.params.id:${id}`)
  res.json(articleService.getPage(id))
})

// 輸出 Router
module.exports = router
