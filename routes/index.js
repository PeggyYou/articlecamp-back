// 引用 Express 與 Express 路由器
const  { Router }  = require('express')

// 建立路由
const router = Router()

// API-v1
const v1 = require('./v1')
router.use('/v1', v1)

// API-v2
const v2 = require('./v2')
router.use('/v2', v2)


// 匯出 router
module.exports = router