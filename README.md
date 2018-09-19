# 积分商城项目开发文档

### 目录

- 功能概述
- 数据对照表
- 特殊设计思路说明
- 备注

---

**1\. 功能概述**

&emsp;&emsp;项目是一个虚拟积分商城，主要功能有签到，分享，点赞，商城基本功能等。

---
**2\. 数据对照表**

product表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| product_no | string| 课程编号|
| title| varchar(255)| 课程名称|
| description| varchar(255)| 课程课次|
| content | text| 预留 |
| mainImg | text|  课程主图 |
| bannerImg | text|  预留 |
| price| decimal(10,2)| 课程总价 |
| discount| int(11)| 预留 |
| type| int(11)| 商品种类 |
| category_id| int(11)| 关联label |
| sku_array| varchar(255)| 预留 |
| sku_item| varchar(255)| 预留 |
| spu_array| varchar(255)|关联label（科目和校区） |
| spu_item| varchar(255)| 关联label（科目和校区） |
| passage1| varchar(255)| |
| passage2| varchar(255)|是否专车接送 |
| passage3| varchar(255)|课程状态 |
| passage4| varchar(255)|是否住宿 |
| passage_array| string|预留 |
| view_count| int(11)|预留 |
| listorder| int(11)|自定义排序 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| bigint(13)|删除时间 |
| deadline| int(11)|上课时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|创建人user_no|
| onShelf | int(2)|1上架；-1下架 |
| status| tinyint(2) |1正常；2删除 |



flow_log表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(2)| 主键：排课ID|
| type | string| 2系统；6上课消耗 |
| count| decimal(10,2)| 平均课时费|
| price| decimal(10,2) | 总课时费|
| relation_id | int(11) | 预留 |
| trade_info| varchar(255) |  备注内容 |
| relation_table| varchar(255) |  预留 |
| order_no| varchar(255) | 预留 |
| trade_type| tinyint(2) | 1增加；2减少 |
| product_no| varchar(255) | 关联product_no |
| passage| varchar(255)| 预留|
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| bigint(13)|删除时间 |
| thirdapp_id| int(11) |关联thirdapp |
| user_no| varchar(255)|关联user_no|
| status| tinyint(2) |1正常；2删除 |
| user_type| varchar(2)|预留|



label表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| title| varchar(40) | 菜单名称|
| description| text  | 描述 预留|
| parentid| int(11) | 父级菜单ID |
| mainImg | text|  预留 |
| bannerImg | text|  预留 |
| type | tinyint(2) |  1,menu;2,menu_item;3,category;5,sku;6,sku_item;7spu;8spu_item |
| listorder| int(11)|自定义排序 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|创建人user_no|



user表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| login_no | varchar(50) | 用户名|
| password| varchar(255)| 密码MD5|
| mainImg | varchar(9999) |  预留 |
| primary_scope| int(255) | 权限级别：90平台管理员；60超级管理员；30管理员；10用户 |
| scope| varchar(255) | cms端权限，string记录不可操作的模块id，空为无限制 |
| user_type| itinyint(10) | 0,学员;1,教师,2,cms用户; |
| behavior| tinyint(10) | 预留 |
| openid| varchar(225) | 预留 |
| child_array| varchar(255)| 预留 |
| lostlogintime| int(11)|最后登录时间 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|用户编号|
| parent_no| varchar(255) |父级用户编号|



user_info表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：排课ID|
| name |  varchar(255) | 用户名|
| phone| varchar(255)| 用户手机|
| mainImg | varchar(9999) |  用户头像 |
| gender| tinyint(2) | 性别：0女；1男 |
| idCard|   varchar(255)| 身份证号 |
| email | varchar(255) | 学员原学校 |
| address |  varchar(500)| 地址 |
| city| varchar(255)| 预留 |
| level| varchar(30) | 预留 |
| qrImg| varchar(999) |二维码 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| int(11) |删除时间 |
| deadline | int(11)| 有效期 |
| passage_array | bigint(13)|预留 |
| thirdapp_id| int(11)|关联thirdapp |
| passage1| varchar(255)|校区|
| passage2| text |教师科目|
| sign_time| int(11)|签到时间 |
| status| tinyint(2) |1正常；2删除 |


message表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| passage1 | int(11)| 1.已发布；2已保存|
| content | varchar(255)| 发布内容|
| mainImg | varchar(999)| 发布图片|



log表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| type | int(11)| 3签到；4点赞|


---
**3\. 特殊设计思路说明**
- 利用message表log表，message表中的ID即为log点赞数据的result，来判断是否点赞。
``` javascript
  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:'59',
      passage1:1,
      user_type:0
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      userInfo:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['nickname','headImgUrl']
      },
      praiseCount:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
        },
        condition:'=',
        compute:{
          pCount:[
            'count',
            'any',
            {
              status:1,
            }
          ]
        },
      },
      isPraise:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'=',
        info:['id']
      }
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.messageGet(postData,callback);
  },


  updateLog(log_id,index,type){
    const self = this;
    const postData ={
      searchItem:{
        id:log_id
      },
      data:{
        status:type
      }
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      self.data.clickData = res;
      self.setData({
        web_clickData:self.data.clickData,
      });  
      wx.hideLoading();
      if(res.solely_code==100000){

        if(type==1){
          self.data.mainData[index].isPraise['id'] = log_id;
        }else{
          self.data.mainData[index].isPraise = {}
        };

        self.setData({
          web_mainData:self.data.mainData
        });
      }else{
        api.showToast('点赞失败','fail');
      };

    };
    api.logUpdate(postData,callback);
  },

```
**4\. 备注**
