<template>
    <view class="page">
        <view class="tip-wrap">
            <view class="tip-icon"></view>
            <view class="text">新手机号验证后，即可绑定成功！</view>
        </view>
        <view class="input-wrap">
            <input type="text" placeholder="手机号" class="cellphone" v-model="cellphone" />
        </view>
        <view class="input-wrap">
            <view class="msg-code">
                <input type="text" placeholder="请输入短信验证码" v-model="msgCode"  />
            </view>
            <view :class="{'msg-code-btn':true, active:isSendCode}" @click="getMsgCode()">{{msgText}}</view>
        </view>
        <button type="button" class="submit-btn" @click="submit()">确认绑定</button>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,getCurrentInstance } from 'vue';
    import {onLoad,onUnload} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    export default defineComponent({
        name:'bind-cellphone',
        setup(){
            let cellphone=ref("");//手机号
            let msgCode=ref("");//短信验证码
            let msgText=ref("获取验证码");//短信验证码提示内容
            let isSendCode=ref(true);//是否可以发送短信验证码
            let store=useStore();
            let utils:any=getCurrentInstance().proxy.$utils;//获取全局属性utils
            let timer:any=null;
            let isSubmit:boolean=true;//防止网络延迟重复提交
            let branch_shop_id:string;//分店的id
            let table_code:string;//桌号
            onLoad((opts:any)=>{
                branch_shop_id=opts.branch_shop_id?opts.branch_shop_id:"";
                table_code=opts.table_code?opts.table_code:"";
                //验证会员是否合法登录
                utils.safeUser(store,branch_shop_id,table_code);
            })
            onUnload(()=>{
                //页面离开时清除定时器
                clearInterval(timer);
            })
            //发送短信验证码
            let getMsgCode:Function=async ()=> {
                if (isSendCode.value) {
                    if (cellphone.value.match(/^\s*$/)) {
                        uni.showToast({
                            title: '请输入手机号',
                            icon: "none",
                            duration: 2000
                        });
                        isSendCode.value = true;
                        return;
                    }
                    if (!cellphone.value.match(/^1[0-9][0-9]\d{8}$/)) {
                        uni.showToast({
                            title: '您输入的手机号格式不正确',
                            icon: "none",
                            duration: 2000
                        });
                        isSendCode.value = true;
                        return;
                    }
                    //校验手机号是否绑定过
                    let existCellphone=await store.dispatch("user/existCellphone",{cellphone:cellphone.value});
                    if(existCellphone.data.exist=='1'){
                        uni.showToast({
                            title: '手机号已存在，请更换',
                            icon:"none",
                            duration: 2000
                        });
                        isSendCode.value = true;
                        return;
                    }
                    //发送短信验证码
                    let smsCode = await store.dispatch("vcode/sendCode",{cellphone: cellphone.value});;
                    if (smsCode.code == 200) {
                        //smsCode.data.sms_code获取短信验证码
                        uni.showToast({
                            title: "" + smsCode.data.sms_code + "",
                            icon: "none",
                            duration: 2000
                        });
                            isSendCode.value = false;
                          let time:number = 60;
                          msgText.value = "重新获取(" + time + "s)";
                          timer = setInterval(() => {
                               if (time <= 0) {
                                  clearInterval(timer);
                                  isSendCode.value = true;
                                  msgText.value = "获取验证码";
                               } else {
                                  time--;
                                  msgText.value = "重新获取(" + time + "s)";
                               }
                            }, 1000);
                    }
                }
            }
            //确认绑定
           let submit:Function=async ()=> {
                if(isSubmit){
                    if (cellphone.value.match(/^\s*$/)) {
                        uni.showToast({
                            title: '请输入手机号',
                            icon: "none",
                            duration: 2000
                        });
                        return;
                    }
                    if (!cellphone.value.match(/^1[0-9][0-9]\d{8}$/)) {
                        uni.showToast({
                            title: '您输入的手机号格式不正确',
                            icon: "none",
                            duration: 2000
                        });
                        return;
                    }
                    //校验手机号是否绑定过
                    let existCellphone=await store.dispatch("user/existCellphone",{cellphone:cellphone.value});;
                    if(existCellphone.data.exist=='1'){
                        uni.showToast({
                            title: '手机号已存在，请更换',
                            icon:"none",
                            duration: 2000
                        });
                        return;
                    }
                    if (msgCode.value.match(/^\s*$/)) {
                        uni.showToast({
                            title: '请输入短信验证码',
                            icon: "none",
                            duration: 2000
                        });
                        return;
                    }
                    isSubmit=false;
                    //绑定手机号
                    let bcData=await store.dispatch("user/bindCellphone",{cellphone:cellphone.value,sms_code:msgCode.value});
                    if(bcData.code==200){
                        uni.showToast({
                            title: "绑定成功！",
                            icon: "none",
                            duration: 2000
                        });
                        setTimeout(()=>{
                            uni.navigateBack({
                                delta: 1
                            });
                        },2000);
                    }else{
                        isSubmit=true;
                        uni.showToast({
                            title: "" + bcData.data + "",
                            icon: "none",
                            duration: 2000
                        });
                        return;
                    }
                }
            }
           return{
            cellphone,
            msgCode,
            msgText,
            getMsgCode,
            isSendCode,
            submit
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100vh;overflow:hidden;background-color:#FFFFFF;}
    .tip-wrap{width:100%;height:100rpx;background-color:#f3f5c4;display:flex;box-sizing: border-box;align-items: center;padding-left:40rpx;margin-bottom:40rpx;}
    .tip-wrap .tip-icon{width:40rpx;height:40rpx;background-image:url("~@/static/images/user/tip.png");background-size:100%;background-position: center;background-repeat: no-repeat;margin-right:20rpx;}
    .tip-wrap .text{font-size:28rpx;color:#ac7700;}

    .input-wrap{width:90%;height:80rpx;background-color:#FFFFFF;border:1px solid #EFEFEF;margin:0 auto;display:flex;align-items: center;box-sizing: border-box;padding-left:20rpx;border-radius: 5px;margin-bottom:20rpx;}
    .input-wrap .cellphone{width:90%;height:80%;font-size:28rpx;}

    .input-wrap .msg-code{width:70%;height:100%;border-right: 1px solid #EFEFEF}
    .input-wrap .msg-code input{width:100%;height:100%;font-size:28rpx;}

    .input-wrap .msg-code-btn{width:29%;height:100%;text-align:center;line-height:80rpx;font-size:28rpx;color:#717376;}
    .input-wrap .msg-code-btn.active{color:#E30019}

    .input-wrap .msg-code-btn image{width:80%;height:80%;margin-top:9rpx;}

    .submit-btn{width:200rpx;height:60rpx;margin:0 auto;background-color:#E30019;color:#FFFFFF;font-size:28rpx;margin-top:40rpx;line-height:60rpx;border-radius: 4px;}
</style>