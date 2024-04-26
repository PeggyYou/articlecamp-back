const fs = require('fs')
const FILE_PATH = './public/data/articles.json'
const { deepCopy } = require('../utils')
const { resolve } = require('path')

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

  // 取得文章列表
  getList() {
    // 文章列表由最新排到最舊
    this.articles.sort((a, b) => b.updateAt - a.updateAt)
    return deepCopy(this.articles)
  }

  // 依 id 取得單篇文章
  get(id) {
    return new Promise((resolve, reject) => {
      let articles = this.articles
      let length = articles.length

      console.log(`get id article:${JSON.stringify(articles)}`)

      // 遍歷 id 比對文章
      for (let i = 0; i < length; i++) {
        console.log(`i:${i}`)
        // return 中斷 if 迴圈，並 resolve 回傳結果
        if (id === articles[i].id) {
          console.log(`返回單篇文章:${JSON.stringify(articles[i])}`)
          return resolve({ index: i, data: articles[i] })
        }
      }
      console.log(`${id} is null`)
      reject({ index: -1, data: null })
    })
  }

  // 新增單篇文章
  add(article) {
    return new Promise((resolve, reject) => {
      article.id = this.maxId() + 1
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

  // 修改單篇文章
  update({ id, newArticle }) {
    // TODO: 非同步函式 async & await
    return new Promise(async (resolve, reject) => {
      try {
        let article = await this.get(id)
        console.log(`取得單篇文章:${article}`)

        // 更新文章資料
        article.author = newArticle.author
        article.title = newArticle.title
        article.content = newArticle.content
        article.updateAt = this.getTimeStamp()
        console.log(`更新文章後的article:${JSON.stringify(article)}`)
        console.log(`更新文章後的articles:${JSON.stringify(this.articles)}`)
        // 文章列表由最新排到最舊
        this.articles.sort((a, b) => b.updateAt - a.updateAt)

        // 寫入成功後，回傳更新後單篇文章
        let articleWritten = await this.write(this.articles)
          .then((result) => {
            resolve(`articleService:${article}`)
          })
          .catch((error) => {
            reject(`fail to update article:${error}`)
          })
      } catch (error) {}
    })
  }

  // 寫入資料
  write(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(FILE_PATH, JSON.stringify(data), function (error) {
        if (error) {
          reject(`error_write:${error}`)
        } else {
          resolve(data)
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
