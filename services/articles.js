const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 取得文章列表
  getList() {
    return articleModel.getList()
  }

  // 取得單篇文章
  getPage(id) {
    // 判斷 id 的值
    if (isNaN(id)){
      return '請提供數字'
    } else {
      return articleModel.getPage(Number(id))
    }
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
}

const articleService = new ArticleService()

module.exports = articleService
