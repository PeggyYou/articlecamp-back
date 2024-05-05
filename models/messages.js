const { ReturnCode, ErrorCode } = require('../utils/codes')
const fs = require('fs')
const FILE_PATH = './public/data/messages.json'

class MessageModel {
  constructor() {
    this.messages = []
    this.read()
      .then((data) => {
        this.messages.push(...data)
        console.log(`read this.messages:${JSON.stringify(this.messages)}`)
      })
      .catch()
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(FILE_PATH, 'utf-8', (error, data) => {
        if (error) {
          console.log(`讀取文章留言失敗:${error}`)
          reject(error)
        }

        let dataParsed = JSON.parse(data)
        console.log(`讀取文章留言成功:${JSON.stringify(dataParsed)}`)
        resolve(dataParsed)
      })
    })
  }

  getList(articleId) {
    console.log('開始取得所有留言...')
    // 取得留言列表
    let messages = this.messages
    console.log(`取得留言列表:${JSON.stringify(messages)}`)

    // 比對符合文章 id 的留言
    // TODO: id 傳入的型態，哪一階段要轉換?
    let length = messages.length
    let messageSelected = []
    articleId = Number(articleId)
    console.log(`typeof articleId:${typeof articleId}`)
    console.log(`留言列表筆數:${length}`)
    for (let i = 0; i < length; i++) {
      let message = messages[i]
      console.log(`當i為${i}，文章留言為:${JSON.stringify(message)}`)
      console.log(`文章 id :${articleId}`)
      console.log(`文章留言對應的文章 id :${message.articleId}`)
      if (articleId === message.articleId) {
        messageSelected.push(message)
        console.log(`符合文章id的留言:${JSON.stringify(messageSelected)}`)
      }
    }

    // 文章留言列表由最新排到最舊
    messageSelected.sort((a, b) => b.createAt - a.createAt)
    console.log(
      `符合文章id的留言，由新到舊排序:${JSON.stringify(messageSelected)}`
    )

    return messageSelected
  }

  async add({ articleId, message }) {
    try {
      // 取得所有留言
      // TODO: 直接使用 this.messages 還是存入變數?
      let messages = this.messages
      console.log(`在 add 取得留言:${JSON.stringify(messages)}`)

      console.log('在 messageModel 開始新增留言...')
      // 新增留言至所有留言
      console.log(`maxId:${this.maxId()}`)
      let newMessage = {
        id: this.maxId() + 1,
        articleId: Number(articleId),
        content: message.content,
        createAt: this.getTimeStamp()
      }
      console.log(`message in messageModel:${JSON.stringify(newMessage)}`)
      messages.push(newMessage)
      console.log(`messages in messageModel:${JSON.stringify(messages)}`)

      // 寫入文章留言列表
      const writeResult = await this.write(messages)
      console.log(`寫入文章留言列表成功 messageModel: ${writeResult}`)
      return newMessage
    } catch (error) {
      console.log(`寫入文章留言列表失敗 messageModel: ${error}`)
      // TODO: ErrorCode.WriteError 要放在哪顯示?
      return {
        code: ErrorCode.WriteError,
        msg: '寫入數據時發生錯誤'
      }
    }
  }

  write(data) {
    // TODO: 非同步的函式都需要加 promise 嗎?
    return new Promise((resolve, reject) => {
      fs.writeFile(FILE_PATH, JSON.stringify(data), (error, result) => {
        if (error) {
          // TODO: 如何抓取錯誤訊息? 例如path寫錯，沒有顯示錯誤
          console.log('err:', error)
          reject(error)
        } else {
          console.log('資料已成功寫入檔案')
          resolve('資料已成功寫入檔案')
        }
      })
    })
  }

  // 生成時間戳(秒)
  getTimeStamp() {
    return Math.floor(new Date().getTime() / 1000)
  }

  // 判斷留言列表 id 最大值
  maxId() {
    let maxId = 0
    let length = this.messages.length
    console.log(`this.messages in maxId:${JSON.stringify(this.messages)}`)
    console.log(`this.messages.length:${this.messages.length}`)
    for (let i = 0; i < length; i++) {
      let messageId = this.messages[i].id
      if (messageId > maxId) {
        maxId = messageId
      }
    }
    return maxId
  }
}

const messageModel = new MessageModel()
module.exports = messageModel
