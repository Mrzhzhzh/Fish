//logs.js
import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({


  data: {
  
    mainData:[],
    searchItem:{
      parent_no:wx.getStorageSync('threeInfo').user_no,
      user_type:0,
      behavior:1 
    }
  },
    

  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order = {
      update_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300); 
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.userGet(postData,callback);
  },

  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    delete self.data.searchItem.update_time;
    self.setData({
      web_startTime:'',
      web_endTime:'',
    });
    self.getMainData(true);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  bindTimeChange: function(e) {
    const self = this;
    var label = api.getDataSet(e,'type');
    this.setData({
      ['web_'+label]: e.detail.value
    });
    self.data[label+'stap'] = new Date(self.data.date+' '+e.detail.value).getTime();
    if(self.data.endTimestap&&self.data.startTimestap){
      self.data.searchItem.update_time = ['between',[self.data.startTimestap,self.data.endTimestap]];
    }else if(self.data.startTimestap){
      self.data.searchItem.update_time = ['>',self.data.startTimestap];
    }else{
      self.data.searchItem.update_time = ['<',self.data.endTimestap];
    };
    self.getMainData(true);   
  },


})
