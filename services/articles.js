const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 取得文章列表
  read() {
    return articleModel.getList()
  }
}

const articleService = new ArticleService()

module.exports = articleService
