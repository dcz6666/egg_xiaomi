'use strict';
var BaseController = require('./base');

class GoodsTypeController extends BaseController {
    async index() {
        //查询商品类型表
        var result = await this.ctx.model.GoodsType.find({})
        console.log("==result==",result);
        await this.ctx.render('admin/goodsType/index',{
            list:result
        })
    }

    async add() {
        await this.ctx.render('admin/goodsType/add')
    }

    async doAdd(){
        let {title,description} = this.ctx.request.body
        var goods = new this.ctx.model.GoodsType({
            title:title,
            description:description
        })
        var result = await goods.save();
        await this.success('/admin/goodsType',"增加类型成功")
    }

    async edit(){
        var id = this.ctx.query.id;
        var result = await this.ctx.model.GoodsType.find({"_id":id});
        await this.ctx.render('admin/goodsType/edit',{
            list:result[0]
        })
    }

    async doEdit(){
        let {_id,title,description} = this.ctx.request.body
        var result = await this.ctx.model.GoodsType.updateOne({"_id":_id},{
            title,description
        })
        if(result){
            await this.success('/admin/goodsType',"编辑角色成功")
        }else{
            await this.success('/admin/goodsType',"编辑角色失败")
        }
    }
}

module.exports = GoodsTypeController;
