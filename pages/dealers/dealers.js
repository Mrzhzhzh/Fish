//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();

Page({
  data: {
    sForm:{
      name:'',
      phone:'',
      address:'',

      login_name:'',
      password:''  
    },
    mainData:[],
    submitData:{
      login_name:''
    }

  },


  onLoad(){
    const self = this;


  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    api.fillChange(e,self,'submitData');
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });    
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  

  register(){
    const self = this;
    const postData = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      login_name:self.data.sForm.login_name,
      password:self.data.sForm.password,
      name:self.data.sForm.name,
      address:self.data.sForm.address,
      phone:self.data.sForm.phone,  
    };
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        api.showToast('申请成功','none');
        setTimeout(function(){
          api.pathTo('/pages/dealers1/dealers1','redi');
        },800)   
      }else{
        api.dealRes(res);
      }     
    };
    api.register(postData,callback);
  },

  checkRegister(){
    const self = this;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      const postData = {
        login_name:self.data.sForm.login_name
      };
      const callback = (res)=>{
        wx.hideLoading();
        if(res.solely_code==100000){
          if(res.info.data&&res.info.data[0].status==1){
          setTimeout(function(){
            api.pathTo('/pages/dealers2/dealers2','redi');
          },800)
          }else if(res.info.data&&res.info.data[0].status==0){
            console.log(666)
            setTimeout(function(){
              api.pathTo('/pages/dealers1/dealers1','redi');
            },800)
          }else if(res.info.data&&res.info.data[0].status== -1){
            api.showToast('审核被拒绝','none')
          } 
        }else{
          api.showToast(res.msg,'none')
        }
    
      };
      api.checkRegister(postData,callback);
    }else{
      api.showToast('请填写用户名','none');
    }

  },






  submit(){
    const self = this;
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
        if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
          api.showToast('手机格式错误','none')
        }else{
          self.register();       
        }
    }else{
      api.showToast('请补全信息','none');
    };
  },
  
})