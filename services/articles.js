const articleModel = require('../models')

class ArticleService {
  constructor() {
    this.article = []
  }

  // 讀取文章列表
  getList() {
    return articleModel.getList()
  }

  // 新增文章
  add(article) {
    return articleModel.write(article)
  }
}

const articleService = new ArticleService()

module.exports = articleService
