// pages/readstory/readstory.js

var tool = require('../../tools/tools.js')
var app = getApp()
var plugin = requirePlugin("WechatSI")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所讲的故事
    story:{},
    student:null,
    //音频的logo
    poster: null,
    //音频的文件来源
    srcone:null,
    srctwo: null,
    srcthree:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取正在做题的人是谁
    if(!this.data.student){
      this.setData({
        student: app.globalData.studentname
      })
    }

    

    //从数据库获取故事
    var that=this
    wx.cloud.callFunction({
      name: 'storyget',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          story: res.result.data
        })
        //检测故事正文的长度，为了保证合成成功（虽然指定长度是1000字节，但是实验证明越长越容易失败），将故事切割为200个字一段，分次合成
        var lengthofstory = res.result.data.body.length
        console.log(lengthofstory)
        if(lengthofstory<=300){
          //字数少直接将故事上传合成为语音
          plugin.textToSpeech({
            lang: "zh_CN",
            content: res.result.data.body,
            success: function (res) {
              console.log(res.filename)
              that.setData({
                srcone: res.filename
              })
            },
            fail: function (res) {
              console.log("fail tts", res)
            }
          })
        }
        //字数多分成两段
        else if(lengthofstory>300&&lengthofstory<600){
          var partone = res.result.data.body.substr(0,299)
      
          var parttwo = res.result.data.body.substr(300, 599)
          
          plugin.textToSpeech({
            lang: "zh_CN",
            content: partone,
            success: function (res) {
              console.log(res.filename)
              that.setData({
                srcone: res.filename
              })
            },
            fail: function (res) {
              console.log("fail tts", res)
            }
          })
          plugin.textToSpeech({
            lang: "zh_CN",
            content: parttwo,
            success: function (res) {
              console.log(res.filename)
              that.setData({
                srctwo: res.filename
              })
            },
            fail: function (res) {
              console.log("fail tts", res)
            }
          })
        }

        plugin.textToSpeech({
          lang: "zh_CN",
          content: res.result.data.answer,
          success: function (res) {
            console.log(res.filename)
            that.setData({
              srcthree: res.filename
            })
          },
          fail: function (res) {
            console.log("fail tts", res)
          }
        })
      },
      fail: console.error
    })
    //从数据库获取一个logo
    wx.cloud.callFunction({
      // 云函数名称
      name: 'imagefind',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          poster: res.result.data[1].welcomelogo,
        })
      },
      fail: console.error
    })

  },

  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtxtwo = wx.createAudioContext('youAudio')
    this.audioCtxthree = wx.createAudioContext('myAudiotwo')
    this.audioCtx.play()
  },

  bindFormSubmit(e){
    this.audioCtx.pause()
    this.audioCtxtwo.pause()
    this.audioCtxthree.pause()
    wx.navigateTo({
      url: '../index/index',
    })
  },
  
  readquestion(e){
    this.audioCtx.pause()
    this.audioCtxtwo.play()
  },
  readstory(e){
    this.audioCtx.play()
    this.audioCtxtwo.pause()
  },
  //判断是否有第二段故事，有的话继续第二段，否则继续读第一段
  endisstart:function(){
    console.log(this.data.srctwo)
    if(this.data.srctwo){
      this.audioCtxthree.play()
    } else if (!this.data.srctwo){
      this.audioCtx.play()
    }
  },
  //第二段结束后，继续开始第一段，形成loop
  endisstartwo:function(){
    this.audioCtx.play()
  }
})