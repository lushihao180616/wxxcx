var util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: null,

    color_array: ['#FFA042', '#FF9224', '#FF8000', '#EA7500', '#D26900', '#BB5E00', '#9F5000'],
    color_index: 0,

    address_array: [],
    address_index: 0,

    multiArray: [],
    allMultiArray: [],
    deadTime: null,

    ifUpdate: false,
  },

  /**
   * 首次加载
   */
  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'address_array',
      success: function (res) {
        that.setData({
          address_array: res.data
        })
        if (res.data.length == 0) {
          wx.showModal({
            content: '请您登录并至少填写一个收货地址',
            showCancel: false,
            confirmText: '登录',
            success: function (res) {
              wx.switchTab({
                url: '../../my/my',
              })
            }
          })
        } else {
          that.initTime(e)
        }
      },
      fail: function (res) {
        wx.showModal({
          content: '请您登录并至少填写一个收货地址',
          showCancel: false,
          confirmText: '登录',
          success: function (res) {
            wx.switchTab({
              url: '../../my/my',
            })
          }
        })
      }
    })
  },

  initTime: function (e) {
    var deadTime = new Date();
    deadTime.setMinutes(deadTime.getMinutes() + 30 - (deadTime.getMinutes() % 10));
    deadTime.setSeconds(0);

    deadTime = util.formatTimeMdHm(deadTime);

    var multiArray = util.getDeadTimeData(null);
    this.setData({
      multiArray: multiArray,
      allMultiArray: multiArray,
      deadTime: deadTime
    })

    // if (e.purchase) {
    //   var purchase = JSON.parse(e.purchase)
    //   for (var i = 0; i < this.data.type_array.length; i++) {
    //     if (this.data.type_array[i].id == purchase.type.id) {
    //       this.setData({
    //         type_index: i
    //       })
    //     }
    //   }
    //   for (var i = 0; i < this.data.address_array.length; i++) {
    //     if (this.data.address_array[i].id == purchase.address.id) {
    //       this.setData({
    //         address_index: i
    //       })
    //     }
    //   }
    //   for (var i = 0; i < purchase.purchaseItems.length; i++) {
    //     purchase.purchaseItems[i].name_num = purchase.purchaseItems[i].name + "/" + purchase.purchaseItems[i].num
    //   }
    //   this.setData({
    //     reward: purchase.reward,
    //     deadTime: purchase.deadTime.replace(/-/g, '/'),
    //     color_index: purchase.purchaseItems.length,
    //     ifUpdate: true,
    //     updatePurchaseId: purchase.id
    //   })
    // }
  },

  addItem: function (e) {
    if (this.data.color_index == 6) {
      wx.showModal({
        content: '最多只能添加六条哦',
        showCancel: false,
        confirmText: '好的吧',
        success: function (res) {}
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

  //地址修改
  addressChange: function (e) {
    this.setData({
      address_index: e.detail.value
    })
  },

  //赏金修改
  rewardChange: function (e) {
    this.setData({
      reward: e.detail.value
    })
  },

  /**
   * 修改限时
   */
  bindStartMultiPickerChange: function (e) {
    var thisPageData_time = this.data.multiArray;
    var year_month_day = thisPageData_time[0][e.detail.value[0]];
    var hours = thisPageData_time[1][e.detail.value[1]];
    var minute = thisPageData_time[2][e.detail.value[2]];
    var deadTime = year_month_day + " " + hours + ":" + minute + ":" + "00";

    this.setData({
      deadTime: deadTime
    })
  },

})