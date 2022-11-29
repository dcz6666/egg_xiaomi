'use strict';
const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump')

// const Controller = require('egg').Controller;
var BaseController = require('./base');
const { Stream } = require('stream');
class FocusController extends BaseController {
    async index() {
        var result=await this.ctx.model.Focus.find({})
        await this.ctx.render('admin/focus/index.html',{
            list:result
        })
    }

    async add(){
        await this.ctx.render('admin/focus/add');
    }
    async doAdd(){
          //多个图片文件
          const parts = this.ctx.multipart({autoFields:true});
          let files = {};
          let stream;
          while((stream =await parts())!=null){
              if(!stream.filename){
                  break;
              }
              const fieldname = stream.fieldname;  //file表单的名字  face
              // 表示上传图片的目录
              var dir = await this.service.tools.getUploadFile(stream.filename);
              const target = dir.uploadDir;
              const writeStrem = fs.createWriteStream(target);
              await pump(stream,writeStrem) //写入并销毁当前流
              files = Object.assign(files,{
                  [fieldname]:dir.saveDir
                })
          }
          
          console.log("===files,parts.fields===",files,parts.fields);
          let focus = new this.ctx.model.Focus(Object.assign(files,parts.field));
          var result= await focus.save()

          await this.success('/admin/focus','增加轮播图成功')
        
    }

    async edit(){
        var id = this.ctx.request.query.id;
        var result = await this.ctx.model.Focus.find({"_id":id});
        console.log("result",result);
        await this.ctx.render("admin/focus/edit",{
            list:result[0]
        })
    }

    async doEdit() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};               
        let stream;
        while ((stream = await parts()) != null) {
            if (!stream.filename) {          
              break;
            }       
            let fieldname = stream.fieldname;  //file表单的名字
  
            //上传图片的目录
            let dir=await this.service.tools.getUploadFile(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);
  
            await pump(stream, writeStream);  
  
            files=Object.assign(files,{
              [fieldname]:dir.saveDir    
            })
            
        }      
  
        //修改操作
  
        var id=parts.field.id;
  
        var updateResult=Object.assign(files,parts.field);
        
        let result =await this.ctx.model.Focus.updateOne({"_id":id},updateResult);
  
        await this.success('/admin/focus','修改轮播图成功');
  
  
    }
  


    async doSingleUpload() {
        //单文件上传
        const stream = await this.ctx.getFileStream(); //获取表单提交的数据
        console.log("stream",stream);
        var fields = stream.fields;  //表单的其他数据

        //上传的目录 注意目录要存在
        const target = 'app/public/admin/upload/'+path.basename(stream.filename);
        const writeStrem = fs.createWriteStream(target);
        // strem.pipe(writeStrem);  // 可以用 但不建议
        await pump(stream,writeStrem)
       this.ctx.body={
            url:target,
            fields:stream.fields
        }
    }


    async multi(){
        await this.ctx.render('admin/focus/multi.html')
    }

    async doMultiUpload(){
        //多个图片文件
        const parts = this.ctx.multipart({autoFields:true});
        const files = [];
        let stream;
        while((stream =await parts())!=null){
            if(!stream.filename){
                return;
            }
            const fieldname = stream.fieldname;  //file表单的名字  face
            const target = 'app/public/admin/upload/'+ path.basename(stream.filename);
            const writeStrem = fs.createWriteStream(target);
            await pump(stream,writeStrem) //写入并销毁当前流
            files.push({
                [fieldname]:target
            })
        }
        
        this.ctx.body={
            files:files,
            fields:parts.field  //所有表单字段都能通过 parts.field
        }
    }
  
}

module.exports = FocusController;
