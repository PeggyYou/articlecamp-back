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
    console.log('end of constructor')
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
          console.log(articles)
        } catch (error) {
          reject(`JSON解析錯誤，error:${error}`)
        }
      })
    })
  }

  // 回傳文章列表
  getList() {
    return deepCopy(this.articles)
  }

  // 新增單篇文章
  add(article) {
    console.log(`model articles write: ${JSON.stringify(article)}`)
    let result

    article.id = this.articlesLength + 1
    article.createAt = this.getTimeStamp()
    article.updateAt = this.getTimeStamp()

    console.log(
      `model articles write _ add element: ${JSON.stringify(article)}`
    )

    console.log(`this.articles: ${JSON.stringify(this.articles)}`)
    this.articles.push(article) // this.articles 就是陣列型態，可直接push
    console.log(`this.articles _push : ${JSON.stringify(this.articles)}`)

    this.write(this.articles)
      .then((data) => {
        console.log(`新增單篇文章, 成功訊息: ${data}`)
        result = data
      })
      .catch((error) => {
        console.log(`新增單篇文章, 錯誤訊息: ${error}`)
        result = error
      })

    return result
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
