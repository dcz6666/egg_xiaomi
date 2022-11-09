'use strict';

var svgCaptcha = require('svg-captcha');
const Service = require('egg').Service;

class ToolsService extends Service {
    async captcha() {
        const { ctx } = this
        const captcha = svgCaptcha.create(
            {
                size: 6,
                fontSize: 50,
                width: 100,
                height: 40,
                background: "#cc9966"
            });
        ctx.session.code = captcha.text;   //验证码上的文字
        return captcha
    }
}

module.exports = ToolsService;
