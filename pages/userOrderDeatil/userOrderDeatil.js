import {Api} from '../../utils/api.js';
const api = new Api();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {

 
    mainData:[]
    
  },


  onLoad(options){
    const self = this;
    self.data.id = options.id;
    if(options.id){
      self.getMainData();
    }   
  },


 getMainData(isNew){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      id:self.data.id,
      user_type:0
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData= res.info.data[0]
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.orderGet(postData,callback);
  },



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },



  

  

 
})
