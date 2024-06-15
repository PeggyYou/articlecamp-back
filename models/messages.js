const fs = require('fs')
const FILE_PATH = './public/data/messages.json'
const { ReturnCode, ErrorCode } = require('../utils/codes')
const { deepCopy } = require('../utils')

class MessageModel {
  constructor() {
    this.messages = []
    this.read()
      .then((data) => {
        this.messages.push(...data)
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
        resolve(dataParsed)
      })
    })
  }

  getList(articleId) {
    // 取得留言列表
    let messages = deepCopy(this.messages)

    // 比對符合文章 id 的留言
    let length = messages.length
    let messageSelected = []
    articleId = Number(articleId)
    for (let i = 0; i < length; i++) {
      let message = messages[i]
      if (articleId === message.articleId) {
        messageSelected.push(message)
      }
    }

    // 篩選後留言列表由最新排到最舊
    messageSelected.sort((a, b) => b.createAt - a.createAt)

    return messageSelected
  }

  async add({ articleId, user, content }) {
    try {
      // 取得留言列表
      // TODO: 直接使用 this.messages 還是存入變數?
      let messages = deepCopy(this.messages)

      // 新增至留言列表
      let newMessage = {
        id: this.maxId() + 1,
        articleId: Number(articleId),
        user:user,
        content: content,
        createAt: this.getTimeStamp()
      }
      messages.push(newMessage)

      // 寫入文章留言列表
      const writeResult = await this.write(messages)

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
