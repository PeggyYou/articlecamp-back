// 引用 Express 與 Express 路由器
const { Router } = require('express')

// 建立路由
const router = Router()

// GET request
router.get('/', (req, res) => {
  res.json({ "response": 'ok' })
})

// 輸出 Router
module.exports = router
