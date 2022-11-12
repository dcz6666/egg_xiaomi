'use strict';

var BaseController = require('./base');

class RoleController extends BaseController {
    async index() {
        var result = await this.ctx.model.Role.find({});
        await this.ctx.render('admin/role/index',{
            list:result
        }) 
    }
    async add() {
        await this.ctx.render('admin/role/add') 
    }

    async doAdd(){
        let {title,description} = this.ctx.request.body
        var role = new this.ctx.model.Role({
            title:title,
            description:description
        })
        var result = await role.save();
        await this.success('/admin/role',"增加角色成功")
    }


    async edit() {
        let {id} = this.ctx.query;
        var result = await this.ctx.model.Role.find({"_id":id});
        await this.ctx.render('admin/role/edit',{
            list:result[0]
        }) 
    }

    async doEdit(){
        let {_id,title,description} = this.ctx.request.body
        var result = await this.ctx.model.Role.updateOne({"_id":_id},{
            title,description
        })
        if(result){
            await this.success('/admin/role',"编辑角色成功")
        }else{
            await this.success('/admin/role',"编辑角色失败")
        }
       
    }

}

module.exports = RoleController;
