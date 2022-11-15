'use strict';

var BaseController = require('./base');

class AccessController extends BaseController {
    async index() {
        // var result = await this.ctx.model.Access.find({})
        // console.log("==result==",result);

        //1、在access表中找出 module_id=0 的数据 管理员 权限管理 角色管理（模块）
        //2、让access表和access表关联 条件：找出acces 表中 module_id等于_id的数据
        var result = await this.ctx.model.Access.aggregate([
            {
                $lookup: {
                    from: 'access',
                    localField: "_id",
                    foreignField: "module_id",
                    as: 'items'
                }
            },
            {
                $match:{
                    "module_id":'0'
                }
            }
        ])
        await this.ctx.render('admin/access/index',{
            list:result
        })
    }
    async add() {
        var result = await this.ctx.model.Access.find({ "module_id": "0" });
        await this.ctx.render('admin/access/add', {
            moduleList: result
        })
    }
    async edit() {
        let{id} =this.ctx.request.query
        //获取编辑的数据
        var accessResult = await this.ctx.model.Access.find({"_id":id});
        var result = await this.ctx.model.Access.find({ "module_id": "0" });
        await this.ctx.render('admin/access/edit',{
            moduleList: result,
            list:accessResult[0]
        })
    }

    async delete() {
        this.ctx.body = "角色删除"
    }

    async doAdd() {
        let { ctx } = this;
        var addResult = ctx.request.body;
        var module_id = addResult.module_id;
        //增加权限的功能
        if (module_id != 0) {
            addResult.module_id = this.app.mongoose.Types.ObjectId(module_id);  //调用mongoose里面的方法把字符串转换成ObjectId
        }
        var access = new this.ctx.model.Access(addResult);
        access.save();
        await this.success('/admin/access', '增加权限成功');
    }

    async doEdit(){
        let updateResult = this.ctx.request.body;
        let {id,module_id} = updateResult;
         //菜单 或者操作
         if (module_id != 0) {
            updateResult.module_id = this.app.mongoose.Types.ObjectId(module_id);  //调用mongoose里面的方法把字符串转换成ObjectId
        }
        var result = await this.ctx.model.Access.updateOne({"_id":id},updateResult)
        if(result){
            await this.success('/admin/access',"修改权限成功")
        }else{
            await this.success('/admin/access',"修改权限失败")
        }
    }

}

module.exports = AccessController;
