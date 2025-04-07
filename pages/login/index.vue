<template>
    <view class="page">
        <view class="other-login-text">
            <view class="line"></view>
            <view class="text">推荐以下方式登录</view>
            <view class="line"></view>
        </view>
        <view class="other-login">
            <!--#ifdef MP-WEIXIN-->
            <button class="wx-login" @click="wxLogin">微信授权登录</button>
            <!--#endif-->
        </view>
        <bind-mobile :show="isBindMobile" @close="isBindMobile=false" :sessionKey="sessionKey"></bind-mobile>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref } from 'vue';
    import {onLoad,onShow} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    import BindMobile from "../../components/bind_mobile";
    //定义userInfo数据接口类型
    interface IUserInfo{
        nickname:string,
        sex:number,
        province:string,
        city:string,
        headimgurl:string,
        openid?:string
    }
    //分店的id
    let branch_shop_id:any;
    //桌号
    let table_code:any;
    export default defineComponent({
        name:'login',
        components:{
            BindMobile
        },
        setup(){
            let store=useStore();
            let isBindMobile:any=ref(false);//是否显示绑定手机号组件
            let sessionKey:any=ref("");//会话密钥
            onLoad((opts:any)=>{
                branch_shop_id=ref(opts.branch_shop_id?opts.branch_shop_id:"");
                table_code=ref(opts.table_code?opts.table_code:"");
            })
            //微信授权登录
            let wxLogin:Function=()=>{
                //如果在微信小程序端
                // #ifdef MP-WEIXIN
                uni.getUserProfile({
                    desc: '用于注册会员资料',
                    lang:'zh_CN',
                    success: (infoRes:any)=> {
                        let userInfo:IUserInfo={"nickname":infoRes.userInfo['nickName'],"sex":infoRes.userInfo["gender"],"province":infoRes.userInfo["province"],"city":infoRes.userInfo["city"],"headimgurl":infoRes.userInfo["avatarUrl"]};

                        //授权登录
                         uni.login({
                            provider: 'weixin',
                            success: async (loginRes:any)=> {
                                let code:string=loginRes.code;
                                //获取微信小程序登录的openid
                                let openData:{code:number,data:{session_key:string,openid:string}}=await store.dispatch("user/getWeChatOpenId",{code:code});
                                if(openData.code==200){
                                    //会话密钥
                                    sessionKey.value=openData.data.session_key;
                                    userInfo.openid=openData.data.openid;
                                    //保存用户信息
                                    let userInfoRes:any=await store.dispatch("user/setWeChatUser",{userinfo:JSON.stringify(userInfo),branch_shop_id:branch_shop_id.value,table_code:table_code.value});

                                    if(userInfoRes.code==200){
                                        //设置会员登录信息
                                        store.commit("user/LOGIN",{uid:userInfoRes.data.uid,token:userInfoRes.data.token,openId:userInfoRes.data.open_id});
                                        //如果绑定手机
                                        if(userInfoRes.data.isbind==1){
                                            //返回上一页
                                            uni.navigateBack({
                                                delta: 1
                                            });
                                        }else{//没有绑定手机
                                            //显示绑定手机号组件
                                            isBindMobile.value=true;
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
                // #endif
            }
           return{
            wxLogin,
            isBindMobile,
            sessionKey
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100vh;overflow:hidden;background-color:#FFFFFF;}
    .other-login-text{width:100%;height:100rpx;display:flex;justify-content: space-between;align-items: center;}
    .other-login-text .line{width:30%;height:1px;background-color:#CCCCCC;}
    .other-login-text .text{font-size:28rpx;color:#333333}

    .other-login{width:100%;display:flex;justify-content: center;}
    .other-login .wx-login{width:80%;height:80rpx;background-color:#21B319;margin:0 auto;border-radius: 5px;color:#FFFFFF;font-size:32rpx;text-align:center;line-height:80rpx;}
</style>