const { articleModel, categoryModel, messageModel } = require('../models')

class MessageService {
  constructor() {
    this.message = []
  }

  add({ articleId, message }) {
    return messageModel.add({ articleId, message })
  }
}

const messageService = new MessageService()
module.exports = messageService
