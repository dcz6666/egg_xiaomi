'use strict';

var svgCaptcha = require('svg-captcha');
var md5 = require('md5')
var sd = require('silly-datetime')
var path = require('path')
var Jimp = require('jimp');

const mkdirp = require('mz-modules/mkdirp');

const Service = require('egg').Service;

class ToolsService extends Service {
    async captcha() {
        const { ctx } = this
        const captcha = svgCaptcha.create(
            {
                size: 4,
                fontSize: 50,
                width: 100,
                height: 40,
                background: "#cc9966"
            });
        ctx.session.code = captcha.text;   //验证码上的文字
        return captcha
    }
    async md5(str) {
        return md5(str)
    }
    async getTime() {
        var d = new Date();
        return d.getTime()
    }

    async getUploadFile(filename){
        //获取当前日期
        var day = sd.format(new Date(),'YYYMMDD');
        //创建图片保存的路径
        var dir = path.join(this.config.uploadDir,day);
        await mkdirp(dir)
        var d= await this.getTime()   /**毫秒数 */
        //返回图片保存的路径
        var uploadDir = path.join(dir,d+path.extname(filename));
        return {
            uploadDir:uploadDir,
            saveDir:uploadDir.slice(3).replace(/\\/g,'/')
        }
    }
    
    //    上传图片成功后生成缩略图
    async jimpImg(target){
         Jimp.read(target,(err,lenna)=>{
            if(err) throw err;
            lenna.resize(200,200) //resize
            .quality(60)   //set JPEG quality
            // .greyscale()  //set greyscale
            .write(target+'_200x200'+path.extname(target))
        })
    }
}

module.exports = ToolsService;
