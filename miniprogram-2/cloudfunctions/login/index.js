const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //获取登录用户的openID
  const openID= cloud.getWXContext().OPENID
  console.log(openID)
  //检测用户是否已经被存入用户数据库
  return await db.collection('students').where({
    openID: _.eq(openID)
  }).get()
  
}
