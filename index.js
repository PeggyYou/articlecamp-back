// 引用 Express 及 Express 路由器
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000

// 使用 cors 中間件
app.use(cors())

// 引用路由器
const router = require('./routes')

// 將 request 導入路由器
app.use(router)

// 監聽伺服器
app.listen(PORT, () => {
  console.log(`Article server is running on http://localhost:${PORT}`)
})
