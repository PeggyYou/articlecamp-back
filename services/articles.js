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

    // 回傳文章資料前處理，移除時間戳
    const page = {
      id: articles[indexOfId].id,
      author: articles[indexOfId].author,
      title: articles[indexOfId].title,
      content: articles[indexOfId].content
    }
    console.log(`page with 4 items:${page}`)
    return page
  }

  // 新增文章
  add(article) {
    return articleModel.write(article)
  }
}

const articleService = new ArticleService()

module.exports = articleService
