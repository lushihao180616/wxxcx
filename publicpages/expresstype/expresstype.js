Page({

  data: {
    type_array: [],

    nowExpress: null
  },

  onLoad: function (e) {
    var express = JSON.parse(e.express);
    var type_array = getApp().globalData.express_type_array
    var length = type_array.length
    for (var i = 0; i < length; i++) {
      type_array[i].num = 0
    }
    this.setData({
      type_array: type_array,
      nowExpress: express
    })
  },

  subNum: function (e) {
    var type_array = this.data.type_array
    var num = type_array[e.currentTarget.dataset.index].num
    if(num == 0){
      return
    }else{
      type_array[e.currentTarget.dataset.index].num = num - 1
    }

    this.setReward(type_array)
    this.setData({
      type_array: type_array
    })
  },

  addNum: function (e) {
    var type_array = this.data.type_array
    var num = type_array[e.currentTarget.dataset.index].num
    type_array[e.currentTarget.dataset.index].num = num + 1

    this.setReward(type_array)
    this.setData({
      type_array: type_array
    })
  },

  setReward: function(type_array) {
    var express = this.data.nowExpress
    var reward = 0
    for (var i = 0; i < type_array.length; i++) {
      reward += type_array[i].num * type_array[i].spend
    }
    express.reward = reward
    this.setData({
      nowExpress: express
    })
  },

  sendPayPoint: function() {
    var expressTypeAndNums = this.data.type_array
    var id = this.data.nowExpress.id
    var reward = this.data.nowExpress.reward
    for (var i = 0; i < expressTypeAndNums.length; i++) {
      expressTypeAndNums[i].typeCode = expressTypeAndNums[i].code
    }
    wx.request({
      url: getApp().globalData.host_port_project + "express/sendExpressReward",
      data: {
        id: id,
        reward: reward,
        expressTypeAndNums: expressTypeAndNums
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.ifSuccess) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})