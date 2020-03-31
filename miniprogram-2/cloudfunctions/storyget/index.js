// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(event.story)
  //获取接收的故事信息
  
  if(event.update){
    if(event.story){
    const story = event.story
     return await db.collection('storys').doc('78295de1-60e9-485f-9ae3-91d539f74294').update({
      data:{
        answer:story.answer,
        body:story.question,
        title:story.mark,
      }
     })
    }else{
      console.log('结果是一个空包')
      return
    }
  }else{
    return await db.collection('storys').doc('78295de1-60e9-485f-9ae3-91d539f74294').get()
  }
}