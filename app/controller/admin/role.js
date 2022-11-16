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

    async auth() {
        var role_id=this.ctx.request.query.id;
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

        await this.ctx.render('admin/role/auth',{
            list:result,
            role_id:role_id
          });
    }

    async doAuth(){
        let { role_id,access_node} = this.ctx.request.body;
        //1、删除当角色下面的所有权限
        await this.ctx.model.RoleAccess.deleteMany({"role_id":role_id})

        //给role_access增加数据 把获取的权限和角色增加到数据库
        for(var i=0;i<access_node.length;i++){
            var roleAccessData= new this.ctx.model.RoleAccess({
                role_id:role_id,
                access_id:access_node[i]
            })
            roleAccessData.save()
        }
        await this.success('/admin/role/auth?id='+role_id,"授权成功")
    }

}

module.exports = RoleController;
