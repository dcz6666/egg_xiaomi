'use strict';

var BaseController = require('./base');

class ManagerController extends BaseController {
    async index() {
        //查询管理表并管理角色表

        var result = await this.ctx.model.Admin.aggregate([{
            $lookup:{
                from:'role',
                localField:"role_id",
                foreignField:"_id",
                as:'role'
            }
        }])
        // console.log("result===456",result)
        await this.ctx.render('admin/manager/index', {
            list:result
        }) 
      
    }
    async add() {
        let result= await this.ctx.model.Role.find();
        await this.ctx.render('admin/manager/add',{
            roleResult:result
        }) 
    }

    async doAdd(){
        let {ctx} = this;
        let addResult = ctx.request.body;
        addResult.password = await this.service.tools.md5(addResult.password);
        var adminResult =await this.ctx.model.Admin.find({"username":addResult.username});
        if(adminResult.length>0){
            await this.error('/admin/add','此管理员已经存在')
        }else{
            var admin = new this.ctx.model.Admin(addResult)
            admin.save()
            await this.success('/admin/manager','增加用户成功')
        }
    }

    async edit() {
        let {id} = this.ctx.request.query
        let adminResult = await this.ctx.model.Admin.find({"_id":id});
        let roleResult= await this.ctx.model.Role.find();
        await this.ctx.render('admin/manager/edit',{
            roleResult,
            adminResult:adminResult[0]
        }) 
    }

    async doEdit(){
        console.log("this.ctx.request.body",this.ctx.request.body);
        let {id,password,mobile,email,role_id} = this.ctx.request.body;
        if(password){
            //修改密码
            password = await this.service.tools.md5(password);
            await this.ctx.model.Admin.updateOne({"_id":id},{
                password:password,
                mobile:mobile,
                email:email,
                role_id:role_id
            })
        }else{
            //不修改密码
            await this.ctx.model.Admin.updateOne({"_id":id},{
                mobile:mobile,
                email:email,
                role_id:role_id
            })
        }
        await this.success('/admin/manager',"编辑用户信息成功")
    }
}

module.exports = ManagerController;
