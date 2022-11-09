'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl) {
    await this.ctx.render('admin/public/success', {
      redirectUrl: redirectUrl
    })
  }

  async error(redirectUrl) {
    await this.ctx.render('admin/public/error', {
      redirectUrl: redirectUrl
    })
  }

  async verify() {
    let {ctx} = this;
    var captcha = await this.service.tools.captcha()  //服务里面的方法
    ctx.response.type = 'image/svg+xml'; //指定返回的类型
    ctx.body = captcha.data;  //给页面返回一张图
  }
}

module.exports = BaseController;
