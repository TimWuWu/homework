// miniprogram/pages/checking/checking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student: null,
    title: null,
    answerlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //从数据库获取故事
    var that = this
    wx.cloud.callFunction({
      name: 'storyget',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          title: res.result.data.title
        })
      },
      fail: console.error
    })

  },

  formSubmit: function(e) {
    console.log('接受到的是', e)
    //如果不是指定的题目，就是默认查询最新出的题
    var that=this
    if(e.detail.value.title.length==0){
      wx.cloud.callFunction({
        name: 'checkstoryanswer',
        // 传给云函数的参数
        data: {
          student: e.detail.value.name,
          title: this.data.title
        },
        success: function (res) {
          console.log(res)
          that.setData({
            answerlist:res.result.data
          })
        },
        fail: console.error,
      }) 
    }
    //否则就是查询输入的题目
    else{
      wx.cloud.callFunction({
        name: 'checkstoryanswer',
        // 传给云函数的参数
        data: {
          student: e.detail.value.name,
          title: e.detail.value.title
        },
        success: function (res) {
          console.log(res)
        },
        fail: console.error,
      }) 
    }
  }
})