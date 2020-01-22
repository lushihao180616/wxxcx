var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    type: "充值",
    backGroundColor_array: ["#ccc","#fff"],
    backGroundColor_index: 0
  },

  onLoad: function (e) {
    var flag = Boolean(parseInt(e.flag));
    if (flag){//in
      this.setData({
        type: "充值",
        backGroundColor_index: parseInt(e.flag)
      })
    }else{//out
      this.setData({
        type: "提现",
        backGroundColor_index: parseInt(e.flag)
      })
    }
  }
})