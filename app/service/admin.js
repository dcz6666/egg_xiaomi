'use strict';

const Service = require('egg').Service;
var url = require('url')
class AdminService extends Service {
  async checkAuth() {
    /**
     * 1、获取当前用户的角色
     * 2、根据角色获取当前角色的权限列表
     * 3、获取当前访问的url 对应的权限
     * 4、判断当前访问的url 对应的权限id 是否在权限列表中的id中
     */

    //1、获取当前用户的角色
    console.log("this.ctx.session.userInfo",this.ctx.session.userinfo);
    var {role_id,is_super }= this.ctx.session.userinfo;
    console.log("===is_super==================",is_super);
    //忽略权限判断的地址 is_super表示超级管理员
    var isnoreUrl=['/admin/login','/admin/doLogin','/admin/verify','/admin/loginOut'];
      //3、获取当前访问的url 对应的权限
      var pathname = url.parse(this.ctx.request.url).pathname;   //获取当前用户访问的地址
      if(isnoreUrl.indexOf(pathname)!=-1 || is_super==1){
          return true //允许访问
      }

    //2、根据角色获取当前角色的权限列表
    var accessResult = await this.ctx.model.RoleAccess.find({"role_id":role_id});
    console.log("accessResult",accessResult);
    var accessArray =[]  //当前角色可以访问的权限列表
    accessResult.forEach((item)=>{
        accessArray.push(item.access_id.toString());
    })
  

    //4、判断当前访问的url 对应的权限id 是否在权限列表中的id中
    var accessUrlResult = await this.ctx.model.Access.find({"url":pathname});
    // console.log("=====pathname===",pathname);
    // console.log("==accessUrlResult==",accessUrlResult);
    // console.log("===accessArray==",accessArray)
    if(accessUrlResult.length>0){
        if(accessArray.indexOf(accessUrlResult[0]._id.toString())!=-1){
            return true;
        }
        return false
    }
    return false
  }

//   获取权限列表
  async getAuthList(role_id) {
    // var role_id=this.ctx.request.query.id;
    var result=await this.ctx.model.Access.aggregate([
        {
          $lookup:{
            from:'access',
            localField:'_id',
            foreignField:'module_id',
            as:'items'      
          }      
      },
      {
          $match:{
            "module_id":'0'
          }
      }
    ])

    //2、查询当前角色拥有的权限 （查询当前角色的权限id） 把查找的数据放在数据中
    var accessResult = await this.ctx.model.RoleAccess.find({"role_id":role_id});
    var roleAccessArray=[];
    accessResult.forEach(function(item){
        roleAccessArray.push(item.access_id.toString());
    })
    for(var i =0; i<result.length; i++){
        if(roleAccessArray.indexOf(result[i]._id.toString())!=-1){
            result[i].checked = true
        }
        for(var j=0;j<result[i].items.length;j++){
            if(roleAccessArray.indexOf(result[i].items[j]._id.toString())!=-1){
                result[i].items[j].checked= true;
            }
        }
    }
    return result;
}


}

module.exports = AdminService;
