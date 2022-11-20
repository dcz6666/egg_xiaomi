let url = require('url')

module.exports = options=>{
    return async function adminauth(ctx,next){
        /**
         * 1用户没有登录跳转到登录页面
         * 2、只有登录以后才可以访问后台管理系统
         */
        ctx.state.csrf = ctx.csrf;  //全局变量
        ctx.state.prevPage= ctx.request.headers['referer'] //上一页的地址
        let pathname =url.parse(ctx.request.url).pathname;

        if(ctx.session.userinfo){ //登录
            console.log("123465")
            ctx.state.userinfo=ctx.session.userinfo;  //全局变量  
            // console.log("ctx.session.userinfo",ctx.session.userinfo)
            let{role_id} = ctx.session.userinfo
            var hasAuth = await ctx.service.admin.checkAuth();
            console.log("hasAuth",hasAuth);
            if(hasAuth){
                //获取权限列表
                ctx.state.asideList = await ctx.service.admin.getAuthList(role_id);
                // console.log("ctx.state.asideList",JSON.stringify( ctx.state.asideList));
                await next()
            }else{
                ctx.body="你没有权限访问当前地址"
            }
        }else{
           
            //排除不需要做权限判断的页面 
            console.log("===pathname===",pathname)
            if(pathname=='/admin/login' || pathname=='/admin/doLogin' || pathname=='/admin/verify'){
                await next()
            }else{
                ctx.redirect('/admin/login')
            }
        }
    }
}