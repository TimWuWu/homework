const app = getApp()

Page({
  data: {
  },

  onLoad: function (options) {
  
  },

  jumpinto(e){
    console.log(e)

    wx.navigateToMiniProgram({
      appId: 'wxd3ae9f954fda16cc',
      success(res) {
        console.log(res)
      }
    })
  }
})
