import {getWeChatOpenIdData,setWeChatUserData,getDewxbizdataData,bindWechatLoginBindPhoneNumberData,safeUserData,getUserInfoData,outLoginData,updateUserData,bindCellphoneData,existCellphoneData} from '../../api/user';
//state数据类型接口
interface IState{
    uid:string,
    isLogin:boolean,
    token:string,
    openId:string,
    userInfo:object
}
export default {
    namespaced:true,
    state:{
        //会员的唯一标识
        uid:uni.getStorageSync("uid")?uni.getStorageSync("uid"):"",
        //会员是否登录，true:登录，false:未登录
        isLogin:uni.getStorageSync("isLogin")?Boolean(uni.getStorageSync("isLogin")):false,
        //会员验证的token值
        token:uni.getStorageSync("token")?uni.getStorageSync("token"):"",
        //微信用户的唯一标识
        openId:uni.getStorageSync("openId")?uni.getStorageSync("openId"):"",
        //会员信息
        userInfo:{}
    },
    mutations: {
        //设置会员登录信息
        ["LOGIN"](state:IState, payload:{uid:string,token:string,openId:string}) {
            state.uid=payload.uid;
            state.token=payload.token;
            state.openId=payload.openId;
            state.isLogin=true;
            uni.setStorageSync("uid",state.uid);
            uni.setStorageSync("token",state.token);
            uni.setStorageSync("isLogin",state.isLogin);
            uni.setStorageSync("openId",state.openId);
        },
        //安全退出
        ["OUT_LOGIN"](state:IState) {
            state.uid = "";
            state.isLogin = false;
            state.token="";
            state.openId="";
            uni.removeStorageSync("uid");
            uni.removeStorageSync("token");
            uni.removeStorageSync("isLogin");
            uni.removeStorageSync("openId");
        },
         //设置会员信息
         ["SET_USERINFO"](state:IState,payload:{userInfo:object}){
            state.userInfo=payload.userInfo;
        }
    },
    actions:{
        //获取微信小程序登录的openid和unionid
        getWeChatOpenId(conText:any,payload:{code:string}){
            return getWeChatOpenIdData(payload).then(res=>{
                return res;
            })
        },
        //微信小程序会员登录后保存到数据库
        setWeChatUser(conText:any,payload:{userinfo:string,branch_shop_id:string,table_code:string}){
            return setWeChatUserData(payload).then(res=>{
                return res;
            })
        },
        //微信小程序解密获取手机号和用户信息
        getDewxbizdata(conText:any,payload:{encrypteddata:string,session_key:string}){
            return getDewxbizdataData(payload).then(res=>{
                return res;
            })
        },
        //微信小程序登录后绑定手机号
        bindWechatLoginBindPhoneNumber(conText:any,payload:{cellphone:string}){
            /*
            bindWechatLoginBindPhoneNumberData参数说明：
            uid:会员的唯一标识
            token:会员的token
            platform:平台类型。值：1:微信小程序，2：微信公众号
            */
            return bindWechatLoginBindPhoneNumberData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then(res=>{
                return res;
            })
        },
        //检测会员登录获取的token是否合法
        safeUser(conText:any,payload:{branch_shop_id:string,success?:Function}){
            safeUserData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then(res=>{
                if(payload && payload.success){
                    payload.success(res);
                }
            })
        },
        //获取会员信息
        getUserInfo(conText:any,payload:any){
            getUserInfoData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_USERINFO",{userInfo:res.data});
                    if(payload.success){
                        payload.success(res.data)
                    }
                }else{
                    conText.commit("SET_USERINFO",{userInfo:{}});
                }
            })
        },
        //安全退出
        outLogin(conText:any,payload:any){
            outLoginData({uid:conText.rootState.user.uid,platform:conText.rootState.system.platform}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("OUT_LOGIN");
                }
            })
        },
         //修改用户信息
         updateUser(conText:any,payload:any){
            updateUserData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                 if(res.code==200){
                    if(payload.success){
                        payload.success(res);
                    }
}
            })
        },
        //绑定手机号
        bindCellphone(conText:any,payload:any){
            return bindCellphoneData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                return res;
            })
        },
        //是否存在手机号
        existCellphone(conText:any,payload:any){
            return existCellphoneData(payload).then((res:any)=>{
                return res;
            })
        },
    }
}