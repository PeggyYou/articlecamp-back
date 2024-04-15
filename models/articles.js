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

  // 取得文章列表
  getList() {
    return deepCopy(this.articles)
  }

  // 取得單篇文章
  getPage(id) {
    let articles = this.getList()
    console.log(`model_getPage_articles: ${JSON.stringify(articles)}`)

    // 所有文章列表的 id 存為一個陣列
    let articles_id = []
    for (let i = 0; i < articles.length; i++) {
      articles_id.push(articles[i].id)
    }
    console.log(`list of articles_id: ${articles_id}`)

    // 比對 單篇文章 id 是否存於 文章列表 id 陣列，如果有則返回該篇文章資料
    let indexOfId = articles_id.indexOf(Number(id))
    console.log(`index of articles_id requested by user : ${indexOfId}`)

    if (indexOfId === -1) {
      return `id(${id})的文章不存在`
    } else {
      console.log(`返回單篇文章:${JSON.stringify(articles[indexOfId])}`)
      return articles[indexOfId]
    }
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

  // 生成時間戳
  getTimeStamp() {
    return new Date().getTime()
  }
}

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
