// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //获取用户的openID
  const openID = cloud.getWXContext().OPENID

  return await db.collection('students').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      openID: openID,
      name: event.name,
      age: event.age,
      registerTime:event.time, 
    }
  })
}