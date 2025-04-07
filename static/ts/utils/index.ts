//检测会员登录获取的token是否合法
function safeUser(pStore:any,branch_shop_id:string="",table_code:string="",callback?:Function){
    //调用store/user/index.js文件中actions内部的safeUser()方法
    pStore.dispatch("user/safeUser",{branch_shop_id:branch_shop_id,success:(res:any)=>{
            //如果token验证不成功
            if(res.code!==200){
                //退出登录
                pStore.commit("user/OUT_LOGIN");
                //跳转到登录页面
                uni.navigateTo({
                    url:"/pages/login/index?branch_shop_id=" + branch_shop_id + "&table_code=" + table_code
                })
            }
            //如果token验证成功
            if(res.code==200){
                if(callback){//如果回调函数存在
                    //执行回调函数
                    callback()
                }
            }
        }});
}

export default {
    safeUser
}