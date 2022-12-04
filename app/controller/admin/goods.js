'use strict';

var BaseController = require('./base');

class GoodsController extends BaseController {
  async index() {

    await this.ctx.render('admin/goods/index')
  }
  async add(){
      //获取所有的颜色值
      var colorResult = await this.ctx.model.GoodsColor.find({});
      //获取所有商品的类型
      var goodsType = await this.ctx.model.GoodsType.find({});
      console.log("goodsType",goodsType);
     await this.ctx.render('admin/goods/add',{
        colorResult:colorResult,
        goodsType:goodsType
     })
  }

  //获取商品类型的属性
  async goodsTypeAttribute(){
      var cate_id = this.ctx.request.query.cate_id;
      var goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});
      this.ctx.body={
          result:goodsTypeAttribute
      }
  }

  async doAdd(){
    console.log("this.ctx.request.body",this.ctx.request.body);
  }
}

module.exports = GoodsController;
