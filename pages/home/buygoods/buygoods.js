//获取应用实例
const app = getApp()
Page({
  data: {
    building_image: "../../../utils/image/building.png",
    price_image: "../../../utils/image/price.png",
    type_image: "../../../utils/image/type.png",

    building_array: ['全部'],
    building_index: 0,

    type_array: ['全部'],
    type_index: 0,
  },

  onLoad: function () {
    this.setData({
      type_array: this.data.type_array.concat(app.globalData.type_array),
      building_array: this.data.type_array.concat(app.globalData.building_array)
    })
  },

  // 建筑物过滤条件
  buildingChange: function (e) {
    this.setData({
      building_index: e.detail.value
    })
    if (this.data.building_index != 0){
      this.setData({
        building_image: "../../../utils/image/building_select.png"
      })
    }else {
      this.setData({
        building_image: "../../../utils/image/building.png"
      })
    }
  },

  // 赏金过滤条件
  showNowPrice: function (e) {
    if (this.data.price_image == "../../../utils/image/price.png") {
      this.setData({
        price_image: "../../../utils/image/price_select.png"
      })
    } else {
      this.setData({
        price_image: "../../../utils/image/price.png"
      })
    }
  },
  
  // 类型过滤条件
  typeChange: function(e) {
    this.setData({
      type_index: e.detail.value
    })
    if (this.data.type_index != 0) {
      this.setData({
        type_image: "../../../utils/image/type_select.png"
      })
    } else {
      this.setData({
        type_image: "../../../utils/image/type.png"
      })
    }
  }
  

})