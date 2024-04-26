const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 取得文章列表
  getList() {
    return articleModel.getList()
  }

  // 依 id 取得單篇文章
  get(id) {
    // promise 內判定所有情境，包含判斷 id 的值
    return new Promise((resolve, reject) => {
      if (isNaN(id) || id.trim() === '') {
        reject('id 請提供數字')
      } else {
        articleModel
          .get(Number(id))
          .then((result) => {
            resolve(result)
          })
          .catch((error) => {
            reject(`沒有 id 為 ${id} 的文章`)
          })
      }
    })
  }

  // 新增單篇文章
  add(article) {
    return new Promise((resolve, reject) => {
      articleModel
        .add(article)
        .then((article) => {
          resolve(article)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 修改單篇文章
  update({ id, newArticle }) {
    return new Promise((resolve, reject) => {
      articleModel
        .update({ id, newArticle })
        .then((data) => {
          resolve(`articleService:${data}`)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

const articleService = new ArticleService()

module.exports = articleService
