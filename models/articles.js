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
          // 文章列表由最新排到最舊
          articles.sort((a, b) => b.createAt - a.createAt)
          resolve(articles)
        } catch (error) {
          reject(`JSON解析錯誤，error:${error}`)
        }
      })
    })
  }

  // 新增單篇文章
  add(article) {
    return new Promise((resolve, reject) => {
      article.id = this.articlesLength + 1
      article.createAt = this.getTimeStamp()
      article.updateAt = this.getTimeStamp()

      this.articles.push(article)

      this.write(this.articles)
        .then((data) => {
          console.log(
            `新增單篇文章結果:${data} ；回傳前端: ${JSON.stringify(article)}`
          )
          resolve(article)
        })
        .catch((error) => {
          console.log(`新增單篇文章, 錯誤訊息: ${error}`)
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
}

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
