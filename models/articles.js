const fs = require('fs')
const FILE_PATH = './public/data/articles.json'
const { deepCopy } = require('../utils')

class ArticleModel {
  constructor() {
    this.articles = []
    this.read()
      .then((articles) => {
        this.articles.push(...articles)
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
}

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
