//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
const api = new Api();

Page({


  data: {
    region: ['陕西省', '西安市', '雁塔区'],
    sForm:{
      name:'',
      province:'陕西省',
      city:'西安市',
      country:'雁塔区',
      phone:'',
      detail:'',
    },
    id:'',
  },

  onLoad: function (options) {
    const self=this;
    if(options.id){
      self.data.id = options.id
      self.getMainData(self.data.id); 
    }else{
      self.setData({
        web_region:self.data.region
      })
    };
  
  },

 intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
  submit(){
    const self = this;
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','fail')
      }else{
        if(self.data.id){
          wx.showLoading();     
          self.addressUpdate();
        }else{
          wx.showLoading();
          self.addressAdd();
        }
        setTimeout(function(){
          api.pathTo('/pages/userAddress/userAddress','redi')
        },1000);  
      }
    }else{
      api.showToast('请补全信息','fail');
    };
  },


})

