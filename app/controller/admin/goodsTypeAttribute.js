'use strict';
var BaseController = require('./base');

class GoodsTypeAttribute extends BaseController {
    async index() {
        var cate_id = this.ctx.query.id;
        let goodsTypes= await this.ctx.model.GoodsType.find({"_id":cate_id});
        var result=await this.ctx.model.GoodsTypeAttribute.aggregate([
            {
              $lookup:{
                from:'goods_type',
                localField:'cate_id',
                foreignField:'_id',
                as:'goods_type'      
              }      
           },
           {
              $match:{   //cate_id字符串
                "cate_id":this.app.mongoose.Types.ObjectId(cate_id)   //注意
              }
           }        
        ])
        await this.ctx.render('admin/goodsTypeAttribute/index',{
            list:result,
            cate_id:cate_id,
            goodsTypes:goodsTypes[0]
        })
    }

    async add() {
        // 获取类型数据
        var cate_id = this.ctx.query.id;
        var goodsTypes = await this.ctx.model.GoodsType.find({})
        await this.ctx.render('admin/goodsTypeAttribute/add',{
            cate_id:cate_id,
            goodsTypes:goodsTypes
        })
    }

    async doAdd(){
        let {cate_id}  = this.ctx.request.body
        var res=new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
            
        await res.save();   //注意

        await this.success('/admin/goodsTypeAttribute?id='+cate_id,'增加商品类型属性成功');
    }

    async edit(){
        var id = this.ctx.query.id;
        var result = await this.ctx.model.GoodsTypeAttribute.find({"_id":id});
        var goodsTypes = await this.ctx.model.GoodsType.find({})
        await this.ctx.render('admin/goodsTypeAttribute/edit',{
            list:result[0],
            goodsTypes:goodsTypes
        })
    }

    async doEdit(){
        let {_id,cate_id} = this.ctx.request.body
        console.log("_id",_id);
        var result = await this.ctx.model.GoodsTypeAttribute.updateOne({"_id":_id},this.ctx.request.body)
        if(result){
            await this.success('/admin/goodsTypeAttribute?id='+cate_id,'修改成功');
        }else{
            await this.success('/admin/goodsTypeAttribute?id='+cate_id,'修改失败');
        }
    }
}

module.exports = GoodsTypeAttribute;
