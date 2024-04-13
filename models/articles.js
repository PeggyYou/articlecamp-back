const fs = require('fs')
const FILE_PATH = './public/data/articles.json'
const { deepCopy } = require('../utils')

class ArticleModel {
  constructor() {
    this.articles = []
    this.read()
      .then((articles) => {
        this.articles.push(...articles)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // 取得資料
  getList() {
    // 讀取文件後將資料存於變數中，為避免異動到變數內容，故另存至 deepCopy ，以供後續使用
    return deepCopy(this.articles) // 呼叫函式
  }

  // 讀取資料
  read() {
    // 使用 promise 解決非同步情況
    return new Promise((resolve, reject) => {
      fs.readFile(FILE_PATH, 'utf-8', (error, data) => {
        // 當出現多重錯誤資訊，採用 if(error1)...else if(error2)....；當設定 return 就會跳出
        if (error) {
          return reject(error) // 有無使用 return 皆可回傳錯誤訊息；對應到 this.read() => catch
        }
        try {
          const articles = JSON.parse(data) // data 型態為 string，故使用 JSON.parse 解析成 JSON 物件型態
          resolve(articles) // 對應到 this.read() => then
          console.log(articles)
        } catch (error) {
          reject(`JSON解析錯誤，error:${error}`)
        }
      })
    })
  }

  // 寫入資料
  write(article) {
    console.log(`model articles write: ${JSON.stringify(article)}`)
    article.id = 6
    article.createAt = 1705819929
    article.updateAt = 1705819929
    console.log(
      `model articles write _ add element: ${JSON.stringify(article)}`
    )
    return article
  }
}

// read() {
//   try {
//     const data = fs.readFileSync(FILE_PATH, 'utf-8') // 同步用法 ( web application 不太建議 )
//     console.log(`成功讀取文件: ${data}`)
//     return data
//   } catch (error) {
//     console.log('讀取檔案失敗')
//     console.log(error)
//     return null
//   }
// }
// }

// 建立實例
const articleModel = new ArticleModel()

module.exports = articleModel
