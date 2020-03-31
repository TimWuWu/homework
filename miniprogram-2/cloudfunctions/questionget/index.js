// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(event.selections)
  //判断调用方式，如果传来了update，说明是更新操作
  if(event.update){
    //如果数据存在
    if (event.selections){
      //获取选择题
      const selection=event.selections 
      //用来装下所有的promise
      const tasks=[]
      const answers=[]
      var correct=''
   
    
      //更新选择题的promise
      for (let i=0;i<selection.length;i++){
        if (Object.keys(selection[i]).length == 0){

        }else{
        //匹配得到的数据与数据库的数据
        answers.push(selection[i].idcardA,selection[i].idcardB,selection[i].idcardC,selection[i].idcardD)
        switch (selection[i].answer) {
          case 'A':
            correct = selection[i].idcardA;
            break;
          case 'B':
           correct = selection[i].idcardB;
            break;
          case 'C':
            correct = selection[i].idcardC;
            break;
          case 'D':
            correct = selection[i].idcardD;
          } 

        var updateselectionpromise=db.collection('selections').where({
          order:selection[i].title
          }).update({
            data:{
              asking: selection[i].question,
              answer:answers,
              correctanswer:correct
              }
             })
        //清空answers，已备下一轮循环使用
        answers.splice(0,4)
        //将所有的更新选择题的promise装入预定的数组
        tasks.push(updateselectionpromise)
        }
      }
        return (await Promise.all(tasks))
        
      }else{
        return
      }  
  }else{
     return await db.collection('selections').get() 
  } 
}
