// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 引用資料
const articleService = require('../services')
const { ReturnCode, ErrorCode } = require('../utils/codes')

// 建立路由
const router = Router()

// GET/ articles (取得文章列表)
router.get('/', (req, res) => {
  const keyword = req.query.keyword
  console.log(`req.params.query:${keyword}`)

  if (keyword === undefined) {
    res.json(articleService.getList())
  } else {
    if (keyword.trim() === ''){
      return res.status(ReturnCode.BadRequest).json({
        code: ErrorCode.InvalidParameters,
        msg: '關鍵字為空值，請重新輸入'
      })
    }
    articleService
      .search(keyword)
      .then((result) => {
        console.log(`路由回傳關鍵字搜尋結果成功：${JSON.stringify(result)}`)
        res.json(result)
      })
      .catch((error) => {
        console.log(`路由回傳關鍵字搜尋結果失敗：${error}`)
        res.status(ErrorCode.getReturnCode(error.code)).json(error)
      })
  }
})

// POST /articles (新增單篇文章)
router.post('/', (req, res) => {
  const BODY = req.body
  console.log(JSON.stringify(BODY))

  const author = BODY.author
  if (author === undefined || author === '') {
    return res.status(ReturnCode.BadRequest).json({
      code: ErrorCode.MissingParameters,
      msg: 'author 為必要參數'
    })
  }
  const title = BODY.title
  if (title === undefined || title === '') {
    return res.status(ReturnCode.BadRequest).json({
      code: ErrorCode.MissingParameters,
      msg: 'title 為必要參數'
    })
  }
  const content = BODY.content
  if (content === undefined || content === '') {
    return res.status(ReturnCode.BadRequest).json({
      code: ErrorCode.MissingParameters,
      msg: 'content 為必要參數'
    })
  }

  // 新增 HTTP response status codes
  articleService
    .add(BODY)
    .then((article) => {
      res.json(article)
    })
    .catch((error) => {
      res.status(ErrorCode.getReturnCode(error.code)).json(error)
    })
})

// GET /articles/:id (取得單篇文章)
router.get('/:id', (req, res) => {
  const id = req.params.id
  console.log(`req.params.id:${id}`)
  articleService
    .get(id)
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.status(ErrorCode.getReturnCode(error.code)).json(error)
    })
})

// PUT /articles/:id (修改單篇文章)
router.put('/:id', (req, res) => {
  const id = req.params.id
  const editArticle = req.body
  console.log(`req.params:${JSON.stringify(req.params)}`)
  console.log(`req.params.id:${id}`)
  console.log(`req.body:${JSON.stringify(editArticle)}`)

  articleService
    .update({ id, editArticle })
    .then((result) => {
      console.log(`修改單篇文章成功，路由回傳:${JSON.stringify(result)}`)
      res.json(result)
    })
    .catch((error) => {
      console.log(`修改單篇文章失敗，路由回傳:${JSON.stringify(error)}`)
      res.status(ErrorCode.getReturnCode(error.code)).json(error)
    })
})

// 輸出 Router
module.exports = router
