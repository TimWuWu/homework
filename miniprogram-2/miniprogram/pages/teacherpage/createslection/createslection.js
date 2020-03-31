// miniprogram/pages/teacherpage/createslection/createslection.js
const app = getApp()

var test='正常流程'
const titlechecking = function (rule,value) {
  try {
    var updated = wx.getStorageSync('selects')
    if(updated.length==0){

    }
    else{
      var par= Object.getOwnPropertyNames(updated)
      for (var i = 0, max = par.length; i < max; i++) {
        var propName = par[i];
        if (updated[propName] == value) {
          test='更新流程'
          return test
        }
      }
    }
    } 
    catch (e) {
    console.log(e)
  }
}

Page({

 
  data: {

    rules: [{
      name: 'title',
      rules: [{ required: true, message: '题号不可以为空' }, { validator: titlechecking, message: '' }],
    }, {
      name: 'question',
        rules: [{ required: true, message: '问题不可以为空' }, { maxlength: 100, message: '请题目控制字数' }],
    },{
      name: 'idcardA',
      rules: { required: true, message: 'A选项不可以为空' },
    }, {
      name: 'idcardB',
      rules: { required: true, message: 'B选项不可以为空' },
    }, {
      name: 'idcardC',
      rules: { required: true, message: 'C选项不可以为空' },
    }, {
      name: 'idcardD',
      rules: { required: true, message: 'D选项不可以为空' },
    }, {
      name: 'answer',
      rules: { required: true, message: '正确选项不可以为空' },
    }],
  

     formData: {
       
    },

    accounts: ["A", "B", "C", "D"],
    accountIndex: null,

    titles: ["第一题", "第二题", "第三题"],
    titleIndex: 0,

    warehouse:[{},{},{}],
    count:0,
    option:null
  },

  onLoad: function (options) {
    //获取缓存里的数据
    try {
      var value = wx.getStorageSync('selects')
      //缓存已经填满,提醒只更新
      console.log(value)
     
      //缓存没有数据就初始化定位到第一题
      if (value.length == 0) { 
        this.setData({
          [`formData.title`]: this.data.titles[0]
        })
      }
      //缓存有数据就遍历缓存数组，定位到最前面的空项
      else if (value && this.isnotfull(value)) {
        this.setData({
          [`formData.title`]: this.data.titles[this.emptylocate(value)],
          titleIndex: this.emptylocate(value),
          count: 0,
          [`formData.question`]: null,
          [`formData.idcardA`]: null,
          [`formData.idcardB`]: null,
          [`formData.idcardC`]: null,
          [`formData.idcardD`]: null,
          [`formData.answer`]: null,
          warehouse:value
          })
       }
      else if (!this.isnotfull(value)) {
        wx.showModal({
          title: '注意',
          content: '题目已经出完，确定要更新么？',
          success: function (res) {
            if (res.confirm) {
              this.setData({
                warehouse: value
              })
              return;
            }
            if(res.cancel){
              wx.navigateTo({
                url: '../teacherpage',
              })
            }
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
    
  },

  //问题是否已经填满
  isnotfull(e){
    for(var i = 0; i< this.data.titles.length; i++) {
      if (!e[i].title){
      return true
      }
    }
  },

  //定位更新位置
  locate(){
    for(var i = 0; i< 3; i++) {
      if (this.data.formData.title == this.data.titles[i]) {
       return i
      }
    }       
  },    

  //定位缓存到最前面的空项
  emptylocate(e){
    for (var i = 0; i < this.data.titles.length; i++){
      if(!e[i].title){
        return i
      }
    }
  },

  bindtitleChange: function (e) {
    console.log(e)
    this.setData({
      titleIndex: e.detail.value,
      [`formData.title`]: this.data.titles[e.detail.value]
    })
  },

  formInputquestionChange(e) {
    console.log(e)
    this.setData({
      [`formData.question`]: e.detail.value,
      count: e.detail.value.length
    })
  },

  formInputChange(e) {
    console.log(e)
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  bindAccountChange: function (e) {
    console.log(e)

    this.setData({
      accountIndex: e.detail.value,
      [`formData.answer`]: this.data.accounts[e.detail.value]
    })
  },
  
  //返回管理中心
  managerpage: function(){
    wx.navigateTo({
      url: '../teacherpage',
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
        
        //更新页面数据
        console.log(this.locate())
        var temp = this.data.warehouse
        console.log(test)
        temp.splice(this.locate(), 1, this.data.formData)
        

        //将更新的页面数组存入缓存
        try {
          wx.setStorageSync('selects', this.data.warehouse)
          console.log('完成上传缓存')
        } catch (e) { }
        
        //检查缓存是否已经填写完成，完成则跳转，没完成则刷新页面
        try {
          var check= wx.getStorageSync('selects')
          console.log(this.isnotfull(check))
          if (this.isnotfull(check)) {
           this.onLoad()
          } else {
          wx.navigateTo({
              url: '../teacherpage',
            })
          }
        } catch (e) { }

      }
    }
    )
  }
 
  
})


