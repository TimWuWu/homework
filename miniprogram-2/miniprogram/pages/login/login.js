// pages/login/login.js
var tool = require('../../tools/tools.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    welcomelogo:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'imagefind',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          welcomelogo: res.result.data[1].welcomelogo
        })
      },
      fail: console.error
    })

  },

  formSubmit(e){
    console.log(e)

    //****检测输入
    //合适的年龄范围是1到9岁之间
    const rightage=/^[1-9]$/.test(e.detail.value.age)
    if(e.detail.value.name.length==0){
      wx.showModal({
        title: '注意',
        content: '小朋友，姓名要填噢，老师才能认识你！',
        success: function (res) {
          if (res.confirm) {
            /*这里是点击了确定以后*/
            return;
          }
        }
      })
      return;
    } 
    
     if (e.detail.value.name.length >6){
      wx.showModal({
        title: '注意',
        content: '小朋友，要认真填写自己的姓名噢！',
        success: function (res) {
          if (res.confirm) {
            /*这里是点击了确定以后*/
            return;
           }
         }
       })
       return;
    } 
    
     if (!rightage) {
      wx.showModal({
        title: '注意',
        content: '这个测试只适合1到9岁的小朋友噢，请填写1至9之间的数字~',
        success: function (res) {
          if (res.confirm) {
            /*这里是点击了确定以后*/
            return;
           }
         }
       })
       return;
    }
    //****检测输入截至

    /*将注册信息传给云函数存入数据库 */
    wx.cloud.callFunction({
      // 云函数名称
      name: 'submituser',
      // 传给云函数的参数
      data: {
        name: e.detail.value.name,
        age: e.detail.value.age,
        time: tool.dateFormat(new Date(), 'yyyy年MM月dd日hh时mm分ss秒')
      },
      success: function (res) {
        console.log('提交完成后我收到的是',res)
        wx.navigateTo({
          url: '../index/index',
        })
      },
      fail: console.error
    })
  },
  
})