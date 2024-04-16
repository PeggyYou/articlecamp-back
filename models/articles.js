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

  // 取得單篇文章
  getPage(id) {
    let articles = this.getList()

    // 所有文章列表的 id 存為一個陣列
    let articles_id = []
    for (let i = 0; i < articles.length; i++) {
      articles_id.push(articles[i].id)
    }

    // 比對 id 存於 文章列表，有則返回該篇文章資料
    let indexOfId = articles_id.indexOf(Number(id))
    if (indexOfId === -1) {
      return `id(${id})的文章不存在`
    } else {
      console.log(`返回單篇文章:${JSON.stringify(articles[indexOfId])}`)
      return articles[indexOfId]
    }
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

  // 修改單篇文章
  update({ id, BODY }) {
    console.log(`id:${id}`)
    console.log(`body:${BODY}`)
    console.log(`body.author:${BODY.author}`)
    console.log(`body.title:${BODY.title}`)
    console.log(`body.content:${BODY.content}`)

    let articles = articleModel.getList()
    console.log(`articles in getPage: ${articles}`)

    // 所有文章列表的 id 存為一個陣列
    let articles_id = []
    for (let i = 0; i < articles.length; i++) {
      articles_id.push(articles[i].id)
    }
    console.log(`list of articles_id: ${articles_id}`)

    // 比對 單篇文章 id 是否存於 文章列表 id 陣列，如果有則返回該篇文章資料
    let indexOfId = articles_id.indexOf(Number(id))
    console.log(`index of articles_id requested by user : ${indexOfId}`)
    console.log(
      `articles index of id => article:${JSON.stringify(articles[indexOfId])}`
    )

    // 更新文章資料
    articles[indexOfId].author = BODY.author
    articles[indexOfId].title = BODY.title
    articles[indexOfId].content = BODY.content
    console.log(`更新文章後的article:${articles[indexOfId]}`)
    console.log(`更新文章後的article:${JSON.stringify(articles[indexOfId])}`)

    // 回傳文章資料前處理，移除時間戳
    const result = {
      id: articles[indexOfId].id,
      author: articles[indexOfId].author,
      title: articles[indexOfId].title,
      content: articles[indexOfId].content
    }
    console.log(`page with 4 items:${result}`)
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
