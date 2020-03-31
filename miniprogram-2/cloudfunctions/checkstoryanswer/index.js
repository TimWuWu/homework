// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  console.log('接受的数据是',event)
  //查询特定学生的和查询全部学生的
  if (event.student.length==0){
    return await db.collection('answerOFstory').where({
      标题: _.eq(event.title)
    }).get({
      success: function (res) {
        return res
      }
    })
  }else{return await db.collection('answerOFstory').where({
    student: _.eq(event.student),
    标题: _.eq(event.title)
  }).get({
    success: function (res) {
      return res
    }
  })
  }
}