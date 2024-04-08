// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 引用資料
const Article = require('../models')

// 建立路由
const router = Router()

// GET request
router.get('/', (req, res) => {
  // res.json(Article.read())
  Article.read((error, data) => {
    if (error) {
      res.status(500).send('讀取檔案失敗')
      return
    }
    res.send(data)
  })
})

// 輸出 Router
module.exports = router
