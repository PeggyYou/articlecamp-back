const fs = require('fs')
const FILE_PATH = '../articlecamp-back/public/data/articles.json'

class Articles {
  constructor() {
    this.content = { response: 'HI' }
  }

  read(callback) {
    fs.readFile(FILE_PATH, 'utf-8', function (error, data) {
      if (error) {
        console.log('讀取檔案失敗')
        console.log(error)
        callback(error, null)
        return
      }
      console.log(`成抓取文件:${data}`)
      callback(null, data)
    })
  }
}

// 建立實例
const Article = new Articles()
module.exports = Article
