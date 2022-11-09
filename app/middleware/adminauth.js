let url = require('url')
module.exports = options=>{
    return async function adminauth(ctx,next){
        console.log("==================adminauth")
        /**
         * 1用户没有登录跳转到登录页面
         * 2、只有登录以后才可以访问后台管理系统
         */
        ctx.state.csrf = ctx.csrf;  //全局变量

        let pathname =url.parse(ctx.request.url).pathname;
        if(ctx.session.userinfo){ //登录
            await next()
        }else{
            //排除不需要做权限判断的页面 
            if(pathname=='/admin/login' || pathname=='/admin/doLogin' || pathname=='/admin/verify'){
                await next()
            }else{
                ctx.redirect('/admin/login')
            }
        }
    }
}