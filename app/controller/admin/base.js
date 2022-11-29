'use strict';


const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    await this.ctx.render('admin/public/success', {
      redirectUrl: redirectUrl,
      message: message || '操作成功！'
    })
  }

  async error(redirectUrl, message) {
    await this.ctx.render('admin/public/error', {
      redirectUrl: redirectUrl,
      message: message || '操作失败！'
    })
  }

  async verify() {
    let { ctx } = this;
    var captcha = await this.service.tools.captcha()  //服务里面的方法
    ctx.response.type = 'image/svg+xml'; //指定返回的类型
    ctx.body = captcha.data;  //给页面返回一张图
  }

  async delete() {
    let { ctx } = this;
    let { model, id } = ctx.request.query;
    var result = await ctx.model[model].deleteOne({ "_id": id })
    console.log("result", result);
    ctx.redirect(this.ctx.state.prevPage);
  }


  //改变状态的方法
  async changStatus(){
    let {model,attr,id} = this.ctx.request.query;
    console.log("===this.ctx.request.query===改变状态的方法",this.ctx.request.query)
    var result = await this.ctx.model[model].find({"_id":id});
    if(result.length>0){
      if(result[0][attr]==1){
        var json={
          [attr]:0
        }
      }else{
        var json={
          [attr]:1
        }
      }
      //执行更新操作
      var updateResult = await this.ctx.model[model].updateOne({"_id":id},json)
      if(updateResult){
        this.ctx.body={"message":"更新成功","success":true}
      }else{
        this.ctx.body={"message":"更新成功","success":false}
      }

    }else{
      //接口
      this.ctx.body= {"message":"更新失败，参数错误","success":false}
    }
  }

   //改变数量的方法
   async editNum(){
    let {model,attr,id,num} = this.ctx.request.query;
    console.log("===this.ctx.request.query===改变状态的方法",this.ctx.request.query)
    var result = await this.ctx.model[model].find({"_id":id});
    if(result.length>0){
        var json={
          [attr]:num
      }
      //执行更新操作
      var updateResult = await this.ctx.model[model].updateOne({"_id":id},json)
      if(updateResult){
        this.ctx.body={"message":"更新成功","success":true}
      }else{
        this.ctx.body={"message":"更新成功","success":false}
      }

    }else{
      //接口
      this.ctx.body= {"message":"更新失败，参数错误","success":false}
    }
  }
}

module.exports = BaseController;
