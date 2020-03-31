//index.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
Page({
  data: {
    welcomeimgUrl: '',
    donelearning: false,
    score:0,
    studentname:'',
    checking:true
  },

  onLoad: function() {
    
    //检测是否为第一次登录,是的话安排注册，不是就读取学生名字
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: function (res) {
        console.log('我是读取的学生的数据库信息',res)
        if(res.result.data.length==0){
          wx.navigateTo({
            url: '../login/login',
          })
        }else{
          that.setData({
            studentname: res.result.data[0].name
          })
          app.globalData.studentname = res.result.data[0].name
          if (res.result.data[0].name == '伍天明') {
            that.setData({
              checking: false
            })
          }
        }
      },
      fail: console.error
    })

    //获取yoyo的照片
    wx.cloud.callFunction({
      name: 'imagefind',
      data: {
      },
      success: function (res) {
        console.log(res) 
        app.globalData.imageofyoyo=res.result.data[0].yoyo
        that.setData({
         welcomeimgUrl:res.result.data[0].yoyo,
        })
      },
      fail: console.error
    })

    //将总得分下载至本页面
    this.setData({
      score: app.globalData.finalscore
    })

    //判断得分是否达标，如果达标，解锁娱乐模块
    if (this.data.score>40){
      this.setData({
        onoroff:false
      })
    }
  },

  


  //进入测试的eventhanler,进入测试页面
  select:function(){
    wx.redirectTo({
      url: '../makechose/makechose',
    })
  },

  //视频链接的eventhanler,转入视频资料页面
  intovedio: function () {
    wx.redirectTo({
      url: '../vedioplay/vedioplay',
    })
  },

  //轻松一刻的eventhanler,转入游戏列表页面
  story: function () {
    wx.navigateTo({ url: "../readstory/readstory" })
  },

  //进入后台界面
  checking: function () {
    app.globalData.imageofyoyo =this.data.welcomeimgUrl
    wx.redirectTo({
      url: '../teacherpage/teacherpage',
    })
  },
})
