const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 讀取文章列表
  read() {
    return articleModel.getList()
  }
}

const articleService = new ArticleService()

module.exports = articleService
