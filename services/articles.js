const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 回傳文章列表
  getList() {
    return articleModel.getList()
  }

  // 回傳單篇文章
  getPage(id) {
    return articleModel.getPage(id)
  }

  // 新增單篇文章
  add(article) {
    return new Promise((resolve, reject) => {
      articleModel
        .add(article)
        .then((article) => {
          console.log(`service_add_article, result:${JSON.stringify(article)}`)
          resolve(article)
        })
        .catch((error) => {
          console.log(`service_add_article, error:${error}`)
          reject(error)
        })
    })
  }
}

const articleService = new ArticleService()

module.exports = articleService
