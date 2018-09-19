//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
const api = new Api();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    sForm:{
      login_name:'',
      parent_no:'', 
      behavior:1,
      name:'',
      phone:'',
      address:' '
    },

    mainData:[],
    
  },


  onLoad(){
    const self = this;
    self.userInfoGet();
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      console.log(res)
      self.data.mainData = res;
      self.data.sForm.phone = res.info.data[0].info.phone;
      self.data.sForm.login_name = res.info.data[0].login_name;
      self.data.sForm.parent_no = res.info.data[0].parent_no;
      self.data.sForm.name = res.info.data[0].info.name;
      self.data.sForm.address = res.info.data[0].info.address;
      self.setData({
        web_sForm:self.data.sForm,
        web_mainData:self.data.mainData
      });
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userUpdate(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {
      login_name:self.data.sForm.login_name,
      parent_no:self.data.sForm.parent_no,
    };
    postData.searchItem ={
      status:1
    };
    postData.saveAfter =[
       {
        tableName:'user_info',
        FuncName:'update',
        searchItem:{
          user_no:wx.getStorageSync('info').user_no
        },
        data:{
          name:self.data.sForm.name,
          phone:self.data.sForm.phone,
          address:self.data.sForm.address,
          behavior:1
        }
      }
    ]
    const callback = (data)=>{
      wx.hideLoading();
      if(data.solely_code==100000){
        api.showToast('申请成功了','none')
        token.getUserInfo();
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },300); 
      }else{
        api.showToast('网络故障','none')
      };
    };
    api.userUpdate(postData,callback);
  },
  

  

  submit(){
    const self = this;
    const pass = api.checkComplete(self.data.sForm);
    console.log(self.data.sForm)
    if(pass){  
          wx.showLoading();
          const callback = (user,res) =>{
            self.userUpdate(); 
          };
          api.getAuthSetting(callback);      
      
    }else{
      api.showToast('请补全信息','none');
    };
  },
 
})
