<template>
    <view class="page">
        <view class="order-main">
            <view class="pay-success">支付成功！</view>
            <button class="view-order" @click="goMyOrder()">查看订单</button>
            <view class="msg">关注<text decode="true" class="official">&quot;好运买点餐公众号&quot;</text>获取商家通知和最新优惠信息。</view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,getCurrentInstance,computed} from 'vue';
    import {onLoad} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    export default defineComponent({
        name:'pay-success',
        setup(){
            let branch_shop_id:string;//分店的id
            let table_code:string;//桌号
            let cInstance:any=getCurrentInstance();//获取当前组件实例
            let utils:any=cInstance.proxy.$utils;//获取全局属性utils
            let store=useStore();
            let isLogin:any=computed(()=>store.state.user.isLogin);//是否登录会员
            onLoad((opts:any)=>{
                branch_shop_id=opts.branch_shop_id?opts.branch_shop_id:"";//分店的id
                table_code=opts.table_code?opts.table_code:"";//桌号
                //验证会员登录的token是否合法
                utils.safeUser(store,branch_shop_id,table_code)
            });
            //跳转到订单管理页面
            let goMyOrder:Function=()=>{
                if(isLogin.value){//如果已登录
                    //跳转到订单管理页面
                    pushPage('/pages/myorder/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code+'');
                }else{
                    //如果未登录跳转到会员登录页面
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id}&table_code=${table_code}`);
                }
            }
            //跳转页面
            let pushPage:Function=(url:string)=>{
                uni.navigateTo({
                    url:url
                })
            }
           return{
            goMyOrder
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color:#FFFFFF;overflow:hidden;}
    .order-main{width:100%;}
    .order-main .pay-success{width:auto;font-size:32rpx;color:#000000;text-align: center;margin-top:20rpx;font-weight: bold;}
    .order-main .view-order{width:200rpx;height:auto;font-size:28rpx;color:#FFFFFF;border-radius: 5px;background-color:#007aff;margin-top:20rpx;}
    .order-main .msg{font-size:28rpx;margin-top:20rpx;margin-left:20rpx;text-align: center;}
    .order-main .msg .official{color:#E30019;}
</style>