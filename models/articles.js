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

  // 回傳文章列表
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
          console.log(articles)
        } catch (error) {
          reject(`JSON解析錯誤，error:${error}`)
        }
      })
    })
  }

  // 寫入資料
  write(article) {
    console.log(`model articles write: ${JSON.stringify(article)}`)

    article.id = this.articlesLength + 1
    article.createAt = this.getTimeStamp()
    article.updateAt = this.getTimeStamp()

    console.log(
      `model articles write _ add element: ${JSON.stringify(article)}`
    )

    console.log(`this.articles: ${JSON.stringify(this.articles)}`)
    this.articles.push(article) // this.articles 就是陣列型態，可直接push
    console.log(`this.articles _push : ${JSON.stringify(this.articles)}`)

    // writeFile 寫入資料必須是字串型態，故採用 JSON.stringify 轉換型別
    fs.writeFile(FILE_PATH, JSON.stringify(this.articles), function (error) {
      if (error) {
        console.log(`writeFile error:${error}`)
      } else {
        console.log('新增文章成功寫入data!')
      }
    })

    return article
  }

  // 生成時間戳
  getTimeStamp() {
    return new Date().getTime()
  }
}

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
