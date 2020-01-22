//获取应用实例
const app = getApp()
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: null,

    color_array: ['#FFA042', '#FF9224', '#FF8000', '#EA7500', '#D26900', '#BB5E00', '#9F5000'],
    color_index: 0,

    type_array: [],
    type_index: 0,

    address_array: [],
    address_index: 0,

    purchaseItem_array: [],
    purchaseItem_index: -1,

    multiArray: [],
    allMultiArray: [],
    deadTime: null,

    nameValue: '',
    numValue: '1',
    remarksValue: '',
    reward: '1',

    ifUpdate: false,
    updatePurchaseId: null
  },

  /**
   * 首次加载
   */
  onLoad: function(e) {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        that.setData({
          openId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'address_array',
      success: function(res) {
        that.setData({
          address_array: res.data
        })
        if (res.data.length == 0) {
          wx.showModal({
            content: '请您登录并至少填写一个收货地址',
            showCancel: false,
            confirmText: '登录',
            success: function(res) {
              wx.switchTab({
                url: '../../my/my',
              })
            }
          })
        } else {
          that.initTime(e)
        }
      },
      fail: function(res) {
        wx.showModal({
          content: '请您登录并至少填写一个收货地址',
          showCancel: false,
          confirmText: '登录',
          success: function(res) {
            wx.switchTab({
              url: '../../my/my',
            })
          }
        })
      }
    })
  },

  initTime: function(e) {
    var deadTime = new Date();
    deadTime.setMinutes(deadTime.getMinutes() + 30 - (deadTime.getMinutes() % 10));
    deadTime.setSeconds(0);

    deadTime = util.formatTimeMdHm(deadTime);

    var multiArray = util.getDeadTimeData(null);
    this.setData({
      multiArray: multiArray,
      allMultiArray: multiArray,
      type_array: app.globalData.type_array,
      deadTime: deadTime
    })

    if (e.purchase) {
      var purchase = JSON.parse(e.purchase)
      for (var i = 0; i < this.data.type_array.length; i++) {
        if (this.data.type_array[i].id == purchase.type.id) {
          this.setData({
            type_index: i
          })
        }
      }
      for (var i = 0; i < this.data.address_array.length; i++) {
        if (this.data.address_array[i].id == purchase.address.id) {
          this.setData({
            address_index: i
          })
        }
      }
      for (var i = 0; i < purchase.purchaseItems.length; i++) {
        purchase.purchaseItems[i].name_num = purchase.purchaseItems[i].name + "/" + purchase.purchaseItems[i].num
      }
      this.setData({
        reward: purchase.reward,
        deadTime: purchase.deadTime.replace(/-/g, '/'),
        purchaseItem_array: purchase.purchaseItems,
        color_index: purchase.purchaseItems.length,
        ifUpdate: true,
        updatePurchaseId: purchase.id
      })
    }
  },

  addItem: function(e) {
    if (this.data.color_index == 6) {
      wx.showModal({
        content: '最多只能添加六条哦',
        showCancel: false,
        confirmText: '好的吧',
        success: function(res) {}
      })
      return
    }
    var purchaseItem = {}
    purchaseItem.name = e.detail.value.name
    purchaseItem.num = e.detail.value.num
    purchaseItem.remarks = e.detail.value.remarks
    purchaseItem.name_num = purchaseItem.name + "/" + purchaseItem.num
    this.setData({
      purchaseItem_array: this.data.purchaseItem_array.concat(purchaseItem),
      color_index: this.data.color_index + 1,

      nameValue: '',
      numValue: '1',
      remarksValue: ''
    })

    if (parseFloat(this.data.reward)) {
      this.setData({
        reward: (parseFloat(this.data.reward) + 0.5) + ''
      })
    }
  },

  purchaseItemChange: function(e) {
    this.setData({
      purchaseItem_index: e.detail.value
    })
  },

  removeItem: function(e) {
    var that = this
    if (that.data.purchaseItem_index == -1) {
      wx.showModal({
        content: '请先选择一个要删除的元素',
        showCancel: false,
        confirmText: '好的吧',
        success: function(res) {}
      })
      return
    }
    var item = that.data.purchaseItem_array[that.data.purchaseItem_index]
    wx.showModal({
      content: '您将删除元素“' + item.name_num + '”',
      showCancel: true,
      confirmText: '删除',
      cancelText: '取消',
      success: function(res) {
        if (res.confirm) {
          that.data.purchaseItem_array.splice(that.data.purchaseItem_index, 1);
          that.setData({
            purchaseItem_array: that.data.purchaseItem_array,
            purchaseItem_index: -1,
            color_index: that.data.color_index - 1,
          })

          if (parseFloat(that.data.reward) > 1) {
            that.setData({
              reward: (parseFloat(that.data.reward) - 0.5) + ''
            })
          }
        }
      }
    })
  },

  //类型修改
  typeChange: function(e) {
    this.setData({
      type_index: e.detail.value
    })
  },

  //地址修改
  addressChange: function(e) {
    this.setData({
      address_index: e.detail.value
    })
  },

  rewardChange: function(e) {
    this.setData({
      reward: e.detail.value
    })
  },

  /**
   * 修改限时
   */
  bindStartMultiPickerChange: function(e) {
    var thisPageData_time = this.data.multiArray;
    var year_month_day = thisPageData_time[0][e.detail.value[0]];
    var hours = thisPageData_time[1][e.detail.value[1]];
    var minute = thisPageData_time[2][e.detail.value[2]];
    var deadTime = year_month_day + " " + hours + ":" + minute + ":" + "00";

    this.setData({
      deadTime: deadTime
    })
  },

  //发送任务
  send: function(e) {
    console.log(this.data.updatePurchaseId)
    var thisPageData = this.data
    var id = 0
    if (this.data.updatePurchaseId) {
      id = this.data.updatePurchaseId
    }
    var typeId = thisPageData.type_array[thisPageData.type_index].id
    var addressId = thisPageData.address_array[thisPageData.address_index].id
    var buildingId = thisPageData.address_array[thisPageData.address_index].building_id
    var reward = thisPageData.reward
    var deadTime = thisPageData.deadTime
    var purchaseItems = thisPageData.purchaseItem_array
    var sendUserOpenId = this.data.openId
    var sendTime = util.formatTime(new Date())

    var checkResult = this.checkData(typeId, addressId, reward, deadTime, purchaseItems)
    if (!checkResult) {
      return
    }

    wx.request({
      url: getApp().globalData.host_port_project + "purchase/sendPurchase",
      data: {
        id: id,
        typeId: typeId,
        addressId: addressId,
        buildingId: buildingId,
        statusId: 1,
        reward: reward,
        deadTime: deadTime,
        sendTime: sendTime,
        sendUserOpenId: sendUserOpenId,
        purchaseItems: purchaseItems
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        var responseData = res.data
        if (responseData.ifSuccess) {
          wx.showToast({
            title: '发布成功',
            icon: 'succes',
            duration: 2000,
            mask: true
          })
        } else {
          var param = [];
          param.content = "发布失败，请稍后再试";
          param.confirmText = "好的";
          util.requestFile(param);
        }
      }
    })
  },

  checkData: function(typeId, addressId, reward, deadTime, purchaseItems) {
    var back = true
    var content = ""
    if (addressId == null) {
      content = "请选择地址"
    }
    if (typeId == null) {
      content = "请选择类型"
    }
    var reward = parseFloat(this.data.reward)
    if (isNaN(reward)) {
      content = "赏金只能输入数值"
    }
    if (purchaseItems.length <= 0) {
      content = "任务物品为空"
    }
    if (content != "") {
      back = false
      wx.showModal({
        content: content,
        showCancel: false,
        confirmText: "朕知道了",
        success: function(res) {}
      })

    }
    var flag = new Date();
    flag.setMinutes(flag.getMinutes() + 20)
    if (util.formatStringToDate(deadTime) < flag) {
      back = false
      wx.showModal({
        content: "限定时间过早啦",
        showCancel: false,
        confirmText: "朕知道了",
        success: function(res) {}
      })
    }
    return back
  }
})