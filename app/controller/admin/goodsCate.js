'use strict';
const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump')

var BaseController = require('./base');

class GoodsCateController extends BaseController {
    async index() {

        var result = await this.ctx.model.GoodsCate.aggregate([
            {
                $lookup: {
                    from: 'goods_cate',
                    localField: '_id',
                    foreignField: 'pid',
                    as: 'items'
                }
            },
            {
                $match: {   //cate_id字符串
                    "pid": "0"   //注意
                }
            }
        ])
        // console.log("==result==1",result);
        await this.ctx.render('admin/goodsCate/index', {
            list: result
        })
    }
    async add() {
        var result = await this.ctx.model.GoodsCate.find({ "pid": '0' });
        await this.ctx.render('admin/goodsCate/add', {
            cateList: result
        })
    }

    async doAdd() {
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

            await this.service.tools.jimpImg(target)
        }
        //  表示把字符串的分类id 转换成 objectId
        if (parts.field.pid != 0) {
            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);  //调用mongoose里面的方法把字符串转换成ObjectId
        }
        let goodsCate = new this.ctx.model.GoodsCate(Object.assign(files, parts.field));
        var result = await goodsCate.save()
        await this.success('/admin/goodsCate', '增加分类成功')
    }

    async edit() {
        let { id } = this.ctx.request.query;
        var result = await this.ctx.model.GoodsCate.find({ "_id": id })
        var cateList = await this.ctx.model.GoodsCate.find({ "pid": '0' });
        await this.ctx.render('admin/goodsCate/edit', {
            cateList: cateList,
            list:result[0]
        })
    }

    async doEdit() {
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
 
             await this.service.tools.jimpImg(target)
         }
        //  表示把字符串的分类id 转换成 objectId
        if (parts.field.pid != 0) {
            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);  //调用mongoose里面的方法把字符串转换成ObjectId
        }

        var id = parts.field.id;

        var updateResult = Object.assign(files,parts.field);
        await this.ctx.model.GoodsCate.updateOne({"_id":id},updateResult)
        await this.success('/admin/goodsCate', '编辑分类成功')
    }
}

module.exports = GoodsCateController;