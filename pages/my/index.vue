<template>
    <view class="page">
        <view class="status_bar bg-color"></view>
        <view :class="{header:true,ipx:isIpx}">
            <view class="back" @click="goBack()">
                <view class="back-icon"></view>
            </view>
            <view class="title">我的</view>
            <view :class="{'user-info':true,ipx:isIpx}">
                <view class="head"><image :src="userInfo.head?userInfo.head:'../../static/images/user/head.png'"></image></view>
                <view class="nickname">{{userInfo.nickname?userInfo.nickname:"昵称"}}</view>
                <view class="show-total">
                    <view class="text">积分：{{userInfo.points?userInfo.points:"0"}}</view>
                </view>
                <view class="show-balance">
                    <view class="text">余额：{{userInfo.balance?userInfo.balance:"0"}}</view>
                </view>
            </view>
        </view>
        <view class="pannel-main">
            <view class="list" @click="userPushPage('/pages/myorder/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code+'')">
                <view class="text">我的订单</view>
                <view class="arrow"></view>
            </view>
            <view class="list" @click="userPushPage('/user_pages/profile/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code)">
                <view class="text">个人资料</view>
                <view class="arrow"></view>
            </view>
            <view class="list" @click="userPushPage('/user_pages/bind_cellphone/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code)">
                <view class="text">绑定手机</view>
                <view class="arrow"></view>
            </view>
            <button type="button" class="out-btn" @click="safePage">{{isLogin?'安全退出':'登录'}}</button>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,computed } from 'vue';
    import {onLoad,onShow} from "@dcloudio/uni-app";
    import {useStore} from "vuex";
    export default defineComponent({
        name:'my',
        setup(){
            let branch_shop_id:any=ref("");//分店的id
            let table_code:any=ref("");//桌号
            let store:any=useStore();
            let isIpx:any=computed(()=>store.state.system.isIpx);//是否是iphoneX
            let isLogin:any=computed(()=>store.state.user.isLogin);//会员是否登录
            let userInfo:any=computed(()=>store.state.user.userInfo);//会员信息
            onLoad((opts:any)=>{
                branch_shop_id.value=opts.branch_shop_id?opts.branch_shop_id:"";
                table_code.value=opts.table_code?opts.table_code:"";
            })
            onShow(()=>{
                //获取会员信息
                store.dispatch("user/getUserInfo",{branch_shop_id:branch_shop_id.value});
            })
            //安全退出，在safePage方法里调用
            let outLogin:Function=()=>{
                uni.showModal({
                    title: '',
                    content: '确认要退出吗？',
                    success: (res:any)=> {
                        if (res.confirm) {
                            //Vuex中的安全退出
                            store.dispatch("user/outLogin");
                            userPushPage("/pages/login/index?branch_shop_id=" + branch_shop_id.value + "&table_code=" + table_code.value);
                        } else if (res.cancel) {

                        }
                    }
                });
            }
            //判断会员是否登录的跳转页面
            let userPushPage:Function=(url:string)=> {
                if(isLogin.value){//如果已登录
                    uni.navigateTo({
                        url:url
                    })
                }else{//如果未登录,跳转到登录页面
                    uni.navigateTo({
                        url:"/pages/login/index?branch_shop_id="+branch_shop_id.value+"&table_code="+table_code.value
                    })
                }
            }
            //安全退出与登录
            let safePage:Function=()=>{
                if(isLogin.value){//如果会员是已登录状态
                    outLogin()//安全退出
                }else {//如果未登录
                    //跳转到登录页面
                    userPushPage("/pages/login/index?branch_shop_id=" + branch_shop_id.value + "&table_code=" + table_code.value);
                }
            }
            //返回上一页
            let goBack:Function=()=>{
                uni.navigateBack({
                    delta: 1
                });
            }
           return{
            branch_shop_id,
            table_code,
            isIpx,
            userInfo,
            safePage,
            isLogin,
            goBack,
            userPushPage
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow:hidden;background-color:#EFEFEF;}
    .status_bar.bg-color{background-color:#E30019;}
    .header{width:100%;height:320rpx;background-color:#E30019;position: relative;z-index:1;overflow:hidden;}
    .header .back{width:80rpx;height:80rpx;position: absolute;z-index:1;left:20rpx;top:55rpx;}
    .header .back .back-icon{width:40rpx;height:40rpx;background-image: url("~@/static/images/common/back.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .header.ipx .back{top:100rpx;}
    .header.ipx{height:425rpx;}
    .header .title{width:100%;height:auto;text-align:center;font-size:32rpx;color:#FFFFFF;margin-top:60rpx;}
    .header.ipx .title{margin-top:105rpx;}
    .header .user-info{width:100%;height:180rpx;position: relative;z-index:1;margin-top:20rpx;}
    .header.ipx .user-info{margin-top:40rpx;}
    .header .head{width:125rpx;height:125rpx;position:absolute;z-index:1;left:30rpx;top:0rpx;}
    .header .head image{width:100%;height:100%;border-radius: 100%;}

    .header .nickname{width:auto;height:auto;position: absolute;z-index:1;left:200rpx;top:0rpx;font-size:28rpx;color:#FFFFFF}
    .header .show-total{width:auto;height:auto;position: absolute;z-index:1;left:200rpx;top:55rpx;display:flex;}
    .header .show-total .text{font-size:28rpx;color:#FFFFFF;margin-right:20rpx;}

    .header .show-balance{width:auto;height:auto;position: absolute;z-index:1;left:200rpx;top:105rpx;display:flex;}
    .header .show-balance .text{font-size:28rpx;color:#FFFFFF;margin-right:20rpx;}

    .pannel-main{width:100%;height:auto;background-color:#FFFFFF;margin-top:40rpx;background-color:#FFFFFF;padding-bottom:40rpx;}
    .pannel-main .list{width:100%;height:80rpx;border-bottom: 1px solid #EFEFEF;display:flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding-left:60rpx;padding-right:20rpx;}
    .pannel-main .list .text{font-size:28rpx;color:#333333}
    .pannel-main .list .arrow{width:40rpx;height:40rpx;background-image: url("~@/static/images/user/right_arrow.png");background-size:100%;background-repeat: no-repeat;background-position: center;}

    .out-btn{width:526rpx;height:80rpx;margin:0 auto;background-color:#E30019;color:#FFFFFF;font-size:32rpx;margin-top:40rpx;}
</style>