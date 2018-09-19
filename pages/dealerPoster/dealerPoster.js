//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp()


Page({


  data: {
  


  },
    

  onLoad(){
    const self = this;
    this.setData({
      fonts:app.globalData.font
    })
  },

  onShow(){
    const self = this;
    if(wx.getStorageSync('threeInfo')&&wx.getStorageSync('threeToken')){
      self.setData({
        web_show:true
      })
    }else{
      wx.redirectTo({
        url: '/pages/login/login'
      })
    };
  },



})
