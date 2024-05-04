class MessageModel {
  add({ articleId, message }) {
    let messageAdded = {}
    messageAdded.articleId = articleId
    messageAdded.content = message.content
    console.log(`messageAdded in messageModel:${JSON.stringify(messageAdded)}`)
    return messageAdded
  }
}

const messageModel = new MessageModel()
module.exports = messageModel
