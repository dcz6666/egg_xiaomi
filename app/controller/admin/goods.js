'use strict';
const fs = require('fs');
const pump = require('mz-modules/pump')
var BaseController = require('./base');

class GoodsController extends BaseController {
    async index() {

        await this.ctx.render('admin/goods/index')
    }
    async add() {
        //获取所有的颜色值
        var colorResult = await this.ctx.model.GoodsColor.find({});
        //获取所有商品的类型
        var goodsType = await this.ctx.model.GoodsType.find({});
        console.log("goodsType", goodsType);
        await this.ctx.render('admin/goods/add', {
            colorResult: colorResult,
            goodsType: goodsType
        })
    }

    //获取商品类型的属性
    async goodsTypeAttribute() {
        var cate_id = this.ctx.request.query.cate_id;
        var goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ "cate_id": cate_id });
        this.ctx.body = {
            result: goodsTypeAttribute
        }
    }

    async doAdd() {
        console.log("this.ctx.request.body", this.ctx.request.body);
    }

    async goodsUploadImage() {
         //多个图片文件
         const parts = this.ctx.multipart({ autoFields: true });
         let files = {};
         let stream;
         while ((stream = await parts()) != null) {
             if (!stream.filename) {
                 break;
             }
             const fieldname = stream.fieldname;  //file表单的名字  face
             // 表示上传图片的目录
             var dir = await this.service.tools.getUploadFile(stream.filename);
             const target = dir.uploadDir;
             const writeStrem = fs.createWriteStream(target);
             await pump(stream, writeStrem) //写入并销毁当前流
             files = Object.assign(files, {
                 [fieldname]: dir.saveDir
             })
             console.log("======files===",files);
         }
         this.ctx.body={link: files.file};
    }
}

module.exports = GoodsController;
