const fs = require('fs')
const FILE_PATH = './public/data/articles.json'
const { deepCopy } = require('../utils')

class ArticleModel {
  constructor() {
    this.articles = []
    this.read()
      .then((articles) => {
        this.articles.push(...articles)
        this.articlesLength = this.articles.length
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 取得文章列表
  getList() {
    return deepCopy(this.articles)
  }

  // 讀取資料
  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(FILE_PATH, 'utf-8', (error, data) => {
        if (error) {
          return reject(error)
        }
        try {
          const articles = JSON.parse(data)
          resolve(articles)
        } catch (error) {
          reject(`JSON解析錯誤，error:${error}`)
        }
      })
    })
  }

  // 取得單篇文章
  getPage(id) {
    let articles = this.articles // 針對需要深度複製的文章複製即可；如果只要讀取，使用 this.articles 即可
    let length = articles.length // 存入變數，避免重複提取

    // 所有
    for (let i = 0; i < length; i++) {
      if (id === articles[i].id) {
        console.log(`返回單篇文章:${JSON.stringify(articles[i])}`)
        return articles[i]
      } else {
        console.log(`${id} is null`)
        return `${id} is null`
      }
    }
  }

  // 新增單篇文章
  add(article) {
    return new Promise((resolve, reject) => {
      article.id = this.maxId() + 1 // ID 不能重複，需考量有刪除文章的情況
      article.createAt = this.getTimeStamp()
      article.updateAt = this.getTimeStamp()

      this.articles.push(article)
      // 文章列表由最新排到最舊
      this.articles.sort((a, b) => b.updateAt - a.updateAt)

      this.write(this.articles)
        .then((data) => {
          console.log(
            `新增單篇文章結果:${data} ；回傳前端: ${JSON.stringify(article)}`
          )
          resolve(article)
        })
        .catch((error) => {
          console.log(`無法成功新增單篇文章, 錯誤訊息: ${error}`)
          if (this.articles.length !== this.articlesLength) {
            this.articles.pop(article) // 無法成功新增時，要把已經加入的資訊移除，避免後續資料錯誤
          }
          reject(error)
        })
    })
  }

  // 寫入資料
  write(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(FILE_PATH, JSON.stringify(data), function (error) {
        if (error) {
          reject(`error_write:${error}`)
        } else {
          resolve('成功寫入資料庫!')
        }
      })
    })
  }

  // 生成時間戳(秒)
  getTimeStamp() {
    return Math.floor(new Date().getTime() / 1000)
  }

  // 判斷文章列表 id 最大值
  maxId() {
    let maxId = 0
    let length = this.articlesLength
    for (let i = 0; i < length; i++) {
      let articleId = this.articles[i].id
      if (articleId > maxId) {
        maxId = articleId
      }
    }
    return maxId
  }
}

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
