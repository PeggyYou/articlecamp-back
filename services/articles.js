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
    return articleModel.getPage(id)
  }

  // 新增單篇文章
  add(article) {
    return articleModel.add(article)
  }
}

const articleService = new ArticleService()

module.exports = articleService
