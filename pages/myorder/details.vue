<template>
    <view class="page">
        <view class="shop-title">{{orderDetails.branch_shop_name}}</view>
        <view class="order-main">
            <view class="order-list">
                <view class="order-info">
                    <view class="order-time">下单时间：{{orderDetails.order_time}}</view>
                    <view class="ordernum-status">
                        <view class="ordernum">订单编号：{{ordernum}}</view>
                        <view class="status">{{orderDetails.status=='0'?'待付款':orderDetails.status=='1'?'已付款':""}}</view>
                    </view>
                    <!--如果是堂内订单-->
                    <view class="area-table" v-if="orderDetails.table_code && orderDetails.is_pack=='0'">
                        <view class="area">区域：{{orderDetails.hotel_area_title}}</view>
                        <view class="table-code">桌号：{{orderDetails.table_code}}</view>
                    </view>
                    <view class="pick-code">取餐码：{{orderDetails.pick_code}}</view>
                    <view class="remarks">是否打包：{{orderDetails.is_pack=='1'?'是':'否'}}</view>
                    <view class="remarks" v-if="orderDetails.is_pack=='1'">配送方式：自提</view>
                    <view class="remarks">备注：{{orderDetails.remarks?orderDetails.remarks:"无"}}</view>
                </view>
                <view class="order-desc">
                    <!--订单明细-->
                    <view class="goods-list-main" v-for="(item2,index2) in orderDetails.order_desc" :key="index2">
                        <view class="goods-list">
                            <view class="image">
                                <image :src="item2.image"></image>
                            </view>
                            <view class="goods-info">
                                <view class="title">{{item2.title}}</view>
                                <view class="info-text">x{{item2.amount}}</view>
                                <view class="info-text">￥{{item2.price}}</view>
                                <view class="info-text" v-if="item2.pack_price>0">包装费：￥{{item2.pack_price}}</view>
                                <view class="is-meal">是否套餐：{{item2.is_meal=='1'?'是':'否'}}</view>
                                <view :class="{'refund-btn':true,success:item2.refund_state=='1',fail:item2.refund_state=='-2',handle:item2.refund_state=='-1'}" v-if="item2.is_meal=='0' && orderDetails.status=='1' && (orderDetails['true_total']>0 || orderDetails['balance_total']>0)" @click="applyRefund(item2.order_item_id,item2.refund_state,item2.is_meal,item2.title,item2.amount)">{{item2.refund_state=='1'?'退款成功':item2.refund_state=='-2'?'退款失败':item2.refund_state=='-1'?'处理中':'申请退款'}}</view>
                            </view>
                        </view>
                        <!--退款失败原因-->
                        <view class="refund-content" v-if="item2.refund_state=='-2'">
                            失败原因：{{item2.refund_failed}}
                        </view>
                        <!--套餐里菜品的明细-->
                        <view class="meal-items" v-if="item2.is_meal=='1'">
                            <block v-for="(item3,index3) in item2.omi_data" :key="index3">
                                <view class="item-list">
                                    <view class="item">
                                        <view>- {{item3.title}}</view>
                                        <view>x{{item3.amount}}</view>
                                        <view>￥{{item3.price}}</view>
                                    </view>
                                    <view v-if="orderDetails.status=='1' && (orderDetails['true_total']>0)" :class="{'refund-btn':true,success:item3.refund_state=='1',fail:item3.refund_state=='-2',handle:item3.refund_state=='-1'}" @click="applyRefund(item3.order_item_id,item3.refund_state,item2.is_meal,item3.title,item3.amount)">{{item3.refund_state=='1'?'退款成功':item3.refund_state=='-2'?'退款失败':item3.refund_state=='-1'?'处理中':'申请退款'}}</view>
                                </view>
                                <view class="pack-price" v-if="item3.pack_price>0">包装费：￥{{item3.pack_price}}</view>
                                <view class="refund-content" v-if="item3.refund_state=='-2'">
                                    失败原因：{{item3.refund_failed}}
                                </view>
                            </block>
                        </view>
                    </view>
                </view>
                <view class="price-status">
                    <view class="price">菜品金额：￥{{orderDetails['total']}}</view>
                    <view class="price active">包装费：￥{{orderDetails['pack_total']}}</view>
                    <view class="price active">实付金额：￥{{orderDetails['true_total']}}</view>
                </view>
            </view>
        </view>
        <view class="again-order" @click="replacePage('/pages/goods/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code)">再来一单</view>
        <!--申请退款组件-->
        <refund-order :show="showRefund" @cancel="cancelRefund()" :orderItemId="orderItemId" :isMeal="isMeal" :title="title" :amount="amount"></refund-order>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,getCurrentInstance,computed } from 'vue';
    import {onLoad,onPullDownRefresh} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    import RefundOrder from "../../components/refund_order";
    export default defineComponent({
        name:'order-details',
        components:{
            RefundOrder//申请退款组件
        },
        setup(){
            let branch_shop_id=ref("");//分店的id
            let ordernum=ref("");//订单编号
            let table_code=ref("");//桌号
            let showRefund=ref(false);//是否显示申请退款组件
            let orderItemId=ref("");//菜品订单明细的id
            let isMeal=ref("");//是否套餐
            let title=ref("");//菜品名称
            let amount=ref(1);//菜品数量
            let store=useStore();
            let utils=getCurrentInstance().proxy.$utils;//获取全局属性utils
            let orderDetails=computed(()=>store.state.order.orderDetails);//订单详情数据
            onLoad((opts:any)=>{
                branch_shop_id.value=opts.branch_shop_id?opts.branch_shop_id:"";
                table_code.value=opts.table_code?opts.table_code:"";
                ordernum.value=opts.ordernum?opts.ordernum:"";
                //验证会员是否合法登录
                utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                    //如果会员合法登录，从服务端获取订单详情
                    store.dispatch("order/getOrderDetails",{ordernum:ordernum.value});
                })
            })
            //下拉刷新
            onPullDownRefresh(()=>{
                //重新从服务端获取订单详情数据
                store.dispatch("order/getOrderDetails",{ordernum:ordernum.value,complete:()=>{
                    //停止当前页面下拉刷新
                    uni.stopPullDownRefresh();
                }});
            })
            //重定向跳转页面
            let replacePage:Function=(url:string)=>{
                uni.redirectTo({
                    url:url
                })
            }
            //申请退款
            let applyRefund:Function=(orderItemIdVal:string,refund_state:string,isMealVal:string,titleVal:string,amountVal:number)=>{
                //如果退款的订单状态不是申请状态，也不是申请失败状态，也不是退款成功状态
                //refund_state的值：-1表示申请状态，-2表示退款失败，1表示退款成功
                if(refund_state!="-1" && refund_state!='-2' && refund_state!='1'){
                    showRefund.value=true;//显示退款组件
                    orderItemId.value=orderItemIdVal;//菜品订单明细的id
                    isMeal.value=isMealVal;//是否套餐
                    title.value=titleVal;//菜品名称
                    amount.value=amountVal;//退菜数量
                }
            }
            //取消申请退款
            let cancelRefund:Function=()=>{
                showRefund.value=false;//隐藏申请退款组件
                amount.value=1;//数量设置为1
            }
           return{
            branch_shop_id,
            ordernum,
            table_code,
            showRefund,
            orderItemId,
            isMeal,
            title,
            amount,
            replacePage,
            applyRefund,
            cancelRefund,
            orderDetails
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color:#FFFFFF;overflow:hidden;}
    .shop-title{width:100%;height:80rpx;background-color:#FFFFFF;border-bottom: 1px solid #EFEFEF;font-size:28rpx;text-align:center;line-height:80rpx;}
    .order-main{width:100%;}
    .order-main .order-list{width:100%;border-bottom:1px solid #f17f1f;}
    .order-main .order-list .order-info{width:100%;border-bottom: 1px solid #EFEFEF;box-sizing: border-box;padding:20rpx;}
    .order-main .order-list .ordernum-status{width:100%;display:flex;font-size:28rpx;justify-content: space-between;margin-top:20rpx;}
    .order-main .order-list .area-table{width:100%;display:flex;font-size:28rpx;margin-top:20rpx;}
    .order-main .order-list .area-table .area{margin-right:40rpx;}
    .order-main .order-list .order-time{font-size:28rpx;}
    .order-main .order-list .pick-code{font-size:28rpx;color:#E30019;margin-top:20rpx;}
    .order-main .order-list .remarks{font-size:28rpx;margin-top:20rpx;}

    .order-main .order-desc{width:100%;}
    .order-main .goods-list-main{width:100%;box-sizing: border-box;padding:20rpx;border-bottom: 1px solid #EFEFEF;}
    .order-main .order-desc .goods-list{width:100%;display:flex;justify-content: space-between;align-items: center;margin-bottom:20rpx;}
    .order-main .order-desc .goods-list .image{width:120rpx;height:120rpx;}
    .order-main .order-desc .goods-list .image image{width:100%;height:100%;border-radius: 5px;}
    .order-main .order-desc .goods-list .goods-info{width:80%;height:auto;font-size:28rpx;overflow:hidden;position: relative;}
    .order-main .order-desc .goods-list .goods-info .title{width:100%;height:45rpx;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;}
    .order-main .order-desc .goods-list .goods-info .info-text{width:auto;height:auto;color:#909090;margin-bottom:10rpx;}
    .order-main .order-desc .goods-list .goods-info .is-meal{width:auto;height:auto;color:#909090;}
    .order-main .order-desc .goods-list .goods-info .refund-btn{width:auto;height:auto;position: absolute;right:0rpx;bottom:0rpx;padding:8rpx 15rpx;color:#FFFFFF;font-size:28rpx;background-color:#f17f1f;border-radius: 4px;}
    .order-main .order-desc .goods-list .goods-info .refund-btn.success{background-color:#007aff;}
    .order-main .order-desc .goods-list .goods-info .refund-btn.fail{background-color:#E30019;}
    .order-main .order-desc .goods-list .goods-info .refund-btn.handle{background-color:#CCCCCC;}
    .order-main .order-desc .meal-items{width:100%;margin-top:20rpx;}
    .order-main .order-desc .meal-items .item-list{width:100%;height:80rpx;display:flex;justify-content: space-between;align-items: center;font-size:28rpx;color:#909090}
    .order-main .order-desc .meal-items .item-list .item{display:flex;}
    .order-main .order-desc .meal-items .item-list .item view{margin-right:20rpx;}
    .order-main .order-desc .meal-items .item-list .refund-btn{width:auto;height:auto;padding:8rpx 15rpx;color:#FFFFFF;font-size:28rpx;background-color:#f17f1f;border-radius: 4px;}
    .order-main .order-desc .meal-items .item-list .refund-btn.success{background-color:#007aff;}
    .order-main .order-desc .meal-items .item-list .refund-btn.fail{background-color:#E30019;}
    .order-main .order-desc .meal-items .item-list .refund-btn.handle{background-color:#CCCCCC}
    .order-main .order-desc .goods-list-main .refund-content{width:100%;font-size:28rpx;color:#E30019;}
    .order-main .order-list .price-status{width:100%;height:auto;box-sizing: border-box;padding:20rpx;}
    .order-main .order-list .price-status .price{font-size:28rpx;color:#333333;margin-bottom:10rpx;}
    .order-main .order-list .price-status .price.active{color:#E30019;}

    .again-order{width:200rpx;height:60rpx;font-size:28rpx;color:#FFFFFF;background-color:#E30019;margin:0 auto;text-align:center;line-height:60rpx;border-radius: 4px;margin-top:30rpx;margin-bottom:30rpx;}

    .order-main .pack-price{font-size:28rpx;color:#909090;margin-left:24rpx;}
</style>