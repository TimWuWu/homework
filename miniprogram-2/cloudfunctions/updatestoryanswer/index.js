// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

var db = cloud.database()
const _ = db.command

/*
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {

  return await db.collection('answerOFstory').where({
    student: _.eq(event.studentID),
    标题: _.eq(event.storyname)
  }).update({
      data: {
        answer: event.myanswer
      }
    })
}