// pages/makechose/makechose.js

var app = getApp()
var plugin = requirePlugin("WechatSI")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //全部的问题数组
    questions:{},
    //单个的问题
    question:{} ,
    //问题的中答案部分
    answers:[],
    //下一个问题
    nextasking:0,
    //得分
    score: 0,
    //错误的题的序号数组
    wronglist: [],
    //是否显示已选
    pick:false,
    //最大题量
    max:3,
    //题目的语言资源
    audiosrc:null,
    poster:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取题目
    var that = this
     wx.cloud.callFunction({
      name: 'questionget',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          questions: res.result.data,
          question: res.result.data[0],
          answers: res.result.data[0].answer
        })
        //将题目合成为语音
        plugin.textToSpeech({
          lang: "zh_CN",
          content: res.result.data[0].asking,
          success: function (res) {
            console.log(res.filename)
            that.setData({
              audiosrc: res.filename
            })
          },
          fail: function (res) {
            console.log("fail tts", res)
          }
        })
  
      },
      fail: console.error
    })

    //获取音频logo
    wx.cloud.callFunction({
      // 云函数名称
      name: 'imagefind',
      // 传给云函数的参数
      data: {
      },
      success: function (res) {
        console.log(res)
        that.setData({
          poster: res.result.data[1].welcomelogo
        })
      },
      fail: console.error
    })
  },
 
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },

  formsubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    /*先判断是否有选好答案，如果没有选好，返回题目重选*/
    if (e.detail.value.youranswer == '') {
      wx.showModal({
        title: '注意',
        content: '有且只有一个正确答案噢，小朋友请选择一个~',
        success: function (res) {
          if (res.confirm) {
            /*这里是点击了确定以后*/
            return;
          }}})
      return
    }

    //再判断答案是否正确，如果正确则计分，如果不正确则记录题号
    if (e.detail.value.youranswer==this.data.question.correctanswer){
      var score=this.data.score
      score=score+10
      console.log('你的得分现在是',score)
      this.setData({
        score:score,
      })
    }else{
      var wronglist=this.data.wronglist
      wronglist.push(this.data.question.order)
      console.log(wronglist)
      this.setData({
        wronglist:wronglist,
      })
    }

    //根据上题的题次安排下一题
    var nextasking=this.data.nextasking
    nextasking=nextasking+1
    console.log('现在要加载的题目是',nextasking)
    //正常进入下一题流程
    if (e.detail.value.youranswer!='' & nextasking<this.data.max){
      //先覆盖掉上一题选择的radio
      this.setData({
        pick: false
      })
      //导入数据刷新页面
      this.setData({
      question: this.data.questions[nextasking]
      })
      this.setData({
        answers: this.data.question.answer,
      })
      //将题次保存到页面
      this.setData({
        nextasking: nextasking
      })
      //请求合成语言
      var that=this
      plugin.textToSpeech({
        lang: "zh_CN",
        content: this.data.question.asking,
        success: function (res) {
          console.log(res.filename)
          that.setData({
            audiosrc: res.filename
          })
          that.audioCtx.play()
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
    }

    //当选择题已经做完，进入分数页面
    if (nextasking == this.data.max){
      //将得分和错题记录入app的全局变量
      app.globalData.finalscore=this.data.score
      app.globalData.wronglist = this.data.wronglist
      this.audioCtx.pause()
      wx.navigateTo({ url: "../scorepage/scorepage"});
    }
  },
})