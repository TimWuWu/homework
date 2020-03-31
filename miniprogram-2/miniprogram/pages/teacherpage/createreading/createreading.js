// miniprogram/pages/teacherpage/createreading/createreading.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{

    },

    rules: [{
      name: 'mark',
      rules: { required: true, message: '请填入标题' },
    }, {
      name: 'question',
      rules: [{ required: true, message: '请填入答案' }],
    },{
      name: 'answer',
      rules: { required: true, message: '请提供参考答案' },
    }],

    count:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formInputquestionChange(e) {
    console.log(e)
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value,
    })
    if (e.currentTarget.dataset.field=='question'){
      this.setData({
        count: e.detail.value.length
      })
    }
  },

  formInputChange(e) {
    this.setData({
      [`formData.mark`]: e.detail.value
    })
  },
  

  submitForm() {

    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        wx.showToast({
          title: '校验通过'
        })

        console.log(this.data.formData)
        
        
        //题目数组存入缓存
        try {
          wx.setStorageSync('reading', this.data.formData)
        } catch (e) { }

      
          wx.navigateTo({
            url: '../teacherpage',
          })
        
        }
      }
    )
  }


})