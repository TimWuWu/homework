// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    score: 0,
    wronglist:[],
    student:null
  },

  onLoad: function (options) {
    
      this.setData({
        score: app.globalData.finalscore,
        wronglist: app.globalData.wronglist,
        student: app.globalData.studentname
      })
    
  },

  onfinished:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  }
})