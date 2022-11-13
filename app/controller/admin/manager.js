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
        await this.ctx.render('admin/manager/edit') 
    }
}

module.exports = ManagerController;
