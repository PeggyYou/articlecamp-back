const { articleModel, categoryModel, messageModel } = require('../models')
const { ReturnCode, ErrorCode } = require('../utils/codes')

class MessageService {
  constructor() {
    this.message = []
  }

  getList(articleId) {
    return new Promise(async (resolve, reject) => {
      try {
        // 確認 id 屬有效值
        // TODO: ID 值的初步判定，''是否為必要判定條件?
        if (isNaN(articleId) || articleId.trim() === '') {
          // TODO: 在 try 也可以提供失敗訊息?
          return reject({
            code: ErrorCode.InvalidParameters,
            msg: 'id 請提供數字'
          })
        }

        //確認單篇文章是否存在
        console.log('確認單篇文章是否存在...')
        let articles = await articleModel.get(articleId)
        console.log(`確認單篇文章存在：${JSON.stringify(articles)}`)

        // 取得留言列表
        console.log('單篇文章存在，開始取得留言...')
        let messages = await messageModel.getList(articleId)
        console.log(`取得文章留言列表:${JSON.stringify(messages)}`)

        return resolve(messages)
      } catch (error) {
        console.log(`確認單篇文章不存在：${JSON.stringify(error)}`)
        if (error.index === -1) {
          reject({
            code: ErrorCode.NotFound,
            msg: `沒有 id 為 ${articleId} 的文章`
          })
        }
      }
    })
  }

  add({ articleId, message }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (isNaN(articleId) || articleId.trim() === '') {
          // TODO: 在 try 也可以提供失敗訊息?
          return reject({
            code: ErrorCode.InvalidParameters,
            msg: 'id 請提供數字'
          })
        }

        console.log('確認單篇文章是否存在...')
        // TODO: 取得單篇文章，要使用 MODEL 還是 SERVICE?
        let article = await articleModel.get(articleId)
        console.log(`取得文章結果:${JSON.stringify(article)}`)

        console.log('單篇文章存在，開始新增留言...')
        let newMessage = await messageModel.add({ articleId, message })
        console.log(
          `newMessage in messageService:${JSON.stringify(newMessage)}`
        )
        resolve(newMessage)
      } catch (error) {
        console.log(`無法更新單篇文章, 錯誤訊息:${JSON.stringify(error)}`)
        if (error.index === -1) {
          reject({
            code: ErrorCode.NotFound,
            msg: `沒有 id 為 ${articleId} 的文章`
          })
        } else {
          // TODO: 哪邊在控制 reject回傳的內容? service ? model?
          reject({
            code: ErrorCode.WriteError,
            msg: `無法成功寫入文章留言`
          })
        }
      }
    })
  }
}

const messageService = new MessageService()
module.exports = messageService
