class Articles {
  constructor() {
    this.content = { response: 'ok' }
  }

  read() {
    return this.content
  }
}

// 建立實例
const Article = new Articles()
module.exports = Article
