'use strict';


var BaseController = require('./base');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('admin/login')
  }

  async doLogin() {
    // var result=await this.ctx.model.Admin.find({"username":'zhangsan',"password":'123456'});
    // console.log("==result===", result)
    // await this.ctx.render('admin/manager')
    // this.ctx.body = "角色删除"
    // return;

    let { username, password, code } = this.ctx.request.body;
    // password = await this.service.tools.md5(password)
    console.log("this.ctx.request.body:", this.ctx.request.body)
    if (code.toUpperCase() === this.ctx.session.code.toUpperCase()) {
      console.log(username,password);
      var result=await this.ctx.model.Admin.find({"username":username,"password":password});
      console.log("==result===", result)
      if (result.length > 0) {
        // 保存用户信息
        this.ctx.session.userinfo = result[0];
        //跳转到用户中心
        this.ctx.redirect('/admin/manager')
      } else {
        await this.error('/admin/login', '用户名或密码不正确')
      }

    } else {
      await this.error('/admin/login', '验证码错误')
    }
  }

  async loginOut(){
    this.ctx.session.userinfo=null;
    this.ctx.redirect('/admin/login')
  }
}

module.exports = LoginController;
