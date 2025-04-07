<template>
    <view class="mobile-mask" v-show="show">
        <button class="bind-mobile-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机</button>
    </view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import {useStore} from "vuex";
    export default defineComponent({
        name:'bind-mobile',
        props:{
            //是否显示组件
            show:{
                type:Boolean,
                default:false
            },
            //会话密钥
            sessionKey:{
                type:String,
                required:true
            }
        },
        setup(props:any,conText:any){
            let store:any=useStore();
            //定义一个异步(async)函数
            let getPhoneNumber:Function=async (e:any)=>{
                let encrypteddata:string=e.detail.encryptedData;//包括敏感数据在内的完整用户信息的加密数据
                let iv:string=e.detail.iv;//加密算法的初始向量
                //解密encryptedData
                let pnRes:any=await store.dispatch("user/getDewxbizdata",{encrypteddata,iv,session_key:props.sessionKey});
                if(pnRes.code==200){
                    let phoneNumber:string=pnRes.data.phoneNumber;//手机号
                    //保存手机号到数据库
                    let bpRes:any=await store.dispatch("user/bindWechatLoginBindPhoneNumber",{cellphone:phoneNumber});
                    if(bpRes.code==200){//如果绑定手机号成功
                        conText.emit("close");//隐藏组件
                        //返回上一页
                        uni.navigateBack({
                            delta: 1
                        });
                    }else{//绑定失败
                        uni.showToast({
                            title:bpRes.data,
                            icon:"none",
                            duration:2000
                        })
                    }
                }else{//解密encryptedData失败
                    uni.showToast({
                        title:pnRes.data,
                        icon:"none",
                        duration:2000
                    })
                }
            }
           return{
            getPhoneNumber
           }
        }
    })
</script>

<style scoped>
    .mobile-mask{width:100%;height:100%;position: fixed;z-index:99;left:0;top:0;background-color:rgba(0,0,0,0.8)}
    .bind-mobile-btn{width:70%;height:80rpx;position: absolute;left:50%;top:50%;transform: translate(-50%,-50%);background-color:#28A622;text-align: center;line-height:80rpx;font-size:32rpx;color:#FFFFFF;border-radius: 5px;}
</style>