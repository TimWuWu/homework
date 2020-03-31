
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yoyo:null,
    amountofslects:3,
    slect:null,
    reading: null,
    //没有数据要上传的时候，上传按钮默认隐藏
    btn:true,
    key:true,
    type:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取yoyo照片
    this.setData({
      yoyo: app.globalData.imageofyoyo,
    })

    //获取缓存数据
    try {
      var value = wx.getStorageSync('selects')
      var story = wx.getStorageSync('reading')
      console.log(value)
      console.log(story)
      if(value&&story){
      //如果缓存中选择题填满且阅读题填满，上传按钮点亮
        if (!this.isnotfull(value)) {
         this.setData({
          reading:story,
          slect: value,
          btn:false
        })
      
        this.timer = setInterval(() => {
          this.setData({
            key: !this.data.key,
          })
          if (this.data.key) {
            this.setData({
              type: 'default'
            })
          } else {
            this.setData({
              type: 'warn'
            })
          }
        }, 1000)
        } else {
        console.log('未满',value)
        this.setData({
          slect:value,
          reading:story,
          btn:false
        })
      }
    }
    //如果缓存为空，上传按钮隐藏
    else if(!story&&!value){
        console.log('没有缓存数据')
        this.setData({
          btn: true
        })
      }
    //如果缓存有选择题无阅读题,引出上传按钮  
    else if(value&&!story){
      console.log('有选择题无故事')
        this.setData({
          slect: value,
          btn: false
        })
      }
     //如果缓存无选择题有阅读题,引出上传按钮
    else if (!value && story) {
        console.log('没有缓存选择题数据')
        this.setData({
          reading:story,
          btn: false
        })
      }
    } catch (e) {
      console.log(e)
    }

  },

  //问题是否已经填满
  isnotfull(e) {
    for (var i = 0; i < this.data.amountofslects; i++) {
      if (!e[i].title) {
        return true
      }
    }
  },

 
  //上传
  update(e){
      //将数据传给云函数
      wx.cloud.callFunction({
        name: 'questionget',
        data: {
          update: true,
          selections: this.data.slect,
        },
        success: function (res) {
          console.log(res)
        },
        fail: console.error
      })
      wx.cloud.callFunction({
        name: 'storyget',
        data: {
          update: true,
          story: this.data.reading,
        },
        success: function (res) {
          console.log(res)
        },
        fail: console.error
      })
     //传完以后清理缓存
     try {
      wx.clearStorageSync()
     } catch (e) {
      // Do something when catch error
     }
     
      //清理缓存后刷新页面
      this.onLoad()
    
  },

  createreading(e) {
    wx.navigateTo({
      url: 'createreading/createreading',
    })
  },

  createslection(e) {
    wx.navigateTo({
      url: 'createslection/createslection',
    })
  },
})