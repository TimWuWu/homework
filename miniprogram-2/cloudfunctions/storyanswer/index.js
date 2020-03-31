// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

var db = cloud.database();

/*
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {
  
  return await db.collection('answerOFstory').add({
    data: {
      '标题': event.storyname,
      'student':event.studentID,
      '提交时间': event.finishdate,
      'answer':event.myanswer,
    }
  })
}