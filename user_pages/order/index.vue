<template>
    <view class="page">
        <view class="shop-title">{{shopInfo.branch_shop_name}}</view>
        <view class="order-main">
            <view class="order-list">
                <view class="order-info" v-if="table_code">
                    <view class="area-table">
                        <view class="area">区域：{{hotelArea}}</view>
                        <view class="table-code">桌号：{{table_code}}</view>
                    </view>
                </view>
                <view class="order-desc">
                    <view class="goods-list-main" v-for="(item,index) in cartData" :key="index">
                        <view class="goods-list">
                            <view class="image">
                                <image :src="item.image"></image>
                            </view>
                            <view class="goods-info">
                                <view class="title"><text selectable="true">{{item.title}}</text></view>
                                <view class="info-text">x{{item.amount}}</view>
                                <view class="info-text">￥{{item.price}}</view>
                                <template v-if="item.place_type=='1'">
                                    <view class="info-text" >积分赠送</view>
                                    <view class="info-text" >所需积分：{{item.need_points}}</view>
                                </template>
                                <template v-else>
                                    <view class="info-text" v-if="item.is_meal=='0' && item.pack_price>0">包装费：￥{{item.pack_price}}</view>
                                    <view class="is-meal">是否套餐：{{item.is_meal=='1'?'是':'否'}}</view>
                                </template>
                            </view>
                        </view>
                        <view class="meal-items" v-if="item.is_meal=='1'">
                            <view class="item-list" v-for="(item2,index2) in item.meal_items" :key="index2">
                                <view class="item">
                                    <view>- <text selectable="true">{{item2.title}}</text></view>
                                    <view>x{{item2.amount}}</view>
                                    <view>￥{{item2.price}}</view>
                                </view>
                                <view v-if="item2.pack_price>0">包装费：￥{{item2.pack_price}}</view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="order-row">
                    <view class="order-col-1">
                        <view>是否打包</view>
                    </view>
                    <view class="order-col-2">
                        <switch :disabled="isDisablePack" :checked="isPack" @change="changePack" color="#E30019" />
                    </view>
                </view>
                <view class="price-status">
                    <view class="price">包装费：￥{{packTotal}}，总价：￥{{true_total}}</view>
                </view>
                <view class="order-row" v-if="isDisablePack">
                    <view class="order-col-1">
                        <view>配送方式</view>
                    </view>
                    <view class="order-col-2 active">
                        <label><radio class="radio-style" value="2" color="#E30019" :checked="true" />自提</label>
                    </view>
                </view>
            </view>
            <view class="remarks">
                备注：<br/>
                <view class="content">
                    <textarea placeholder="比如：xxx不加辣" v-model="remarks" />
                </view>
            </view>
        </view>
        <view class="pay-wrap">
            <view class="price">￥{{true_total}}</view>
            <cover-view class="pay" @click="goPay()">去支付</cover-view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,getCurrentInstance,computed } from 'vue';
    import {onLoad} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    export default defineComponent({
        name:'order-index',
        setup(){
            let cInstance:any=getCurrentInstance();//获取当前组件实例 
            let branch_shop_id:any=ref("");//分店的id
            let table_code:any=ref("");//桌号
            let remarks:any=ref("");//备注
            let isDisablePack:any=ref(false);//是否打包
            let utils:any=cInstance.proxy.$utils;//获取全局属性utils
            let store=useStore();
            let isPay:boolean;//防止网络延迟，多次重复提交的问题
            let hotelArea:any=computed(()=>store.state.business.hotelArea);//饭店区域的数据
            let shopInfo:any=computed(()=>store.state.business.shopInfo);//商铺信息
            let cartData:any=computed(()=>store.state.cart.cartData);//购物车里的数据
            let total:any=computed(()=>store.getters["cart/total"]);//购物车里菜品的总价
            let packTotal:any=computed(()=>store.getters["cart/packTotal"]);//购物车里菜品的包装费总价
            let true_total:any=computed(()=>parseFloat(total.value.toFixed(2)));//实际付款金额
            let isPack:any=computed(()=>store.state.cart.isPack);//是否打包
            let openId:any=computed(()=>store.state.user.openId);//用户的唯一openId
            onLoad((opts:any)=>{
                branch_shop_id.value=opts.branch_shop_id?opts.branch_shop_id:"";//分店的id
                table_code.value=opts.table_code?opts.table_code:'';//桌号
                //如果会员合法登录
                utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                    isPay=true;//防止网络延迟，多次重复提交的问题
                    if(!table_code.value){//如果没有桌号代表自提点餐
                        isDisablePack.value=true;//如果是自提点餐，需要支付包装费
                    }
                    //获取饭店的区域
                    store.dispatch("business/getHotelArea",{branch_shop_id:branch_shop_id.value,table_code:table_code.value});
                    //获取商铺信息
                    store.dispatch("business/showShopInfo",{branch_shop_id:branch_shop_id.value});
                    //如果Vuex中购物车数据为空
                    if(!cartData.value || cartData.value.length<=0){
                        //重新获取购物车里的数据
                        store.dispatch("cart/showCartData",{branch_shop_id:branch_shop_id.value,table_code:table_code.value});
                    }
                    //设置是否打包
                    store.commit("cart/SET_PACK",{isPack:!table_code.value?true:false});
                })
            })
            //跳转页面
            let pushPage:Function=(url:string)=>{
                uni.navigateTo({
                    url:url
                })
            }
            //是否打包
            let changePack:Function=(e:any)=>{
                store.commit("cart/SET_PACK",{isPack:e.detail.value});
            }
            //去支付
            let goPay:Function=()=>{
                if(isPay) {
                    isPay = false;
                    let distribution_type:string;
                    //如果在堂内
                    if (!isDisablePack.value) {
                        distribution_type = "0";
                    } else {//如果不在堂内，设置为自提
                        distribution_type = "2";
                    }
                    //提交订单
                    store.dispatch("order/addOrder",{
                        branch_shop_id: branch_shop_id.value,
                        table_code: table_code.value,
                        remarks: remarks.value,
                        is_pack: isPack.value ? '1' : '0',//是否打包，1：是，0：否
                        distribution_type: distribution_type,//配送方式，0:堂内,2:自提
                        success: async (res:any) => {
                            let true_total:number = 0;//实际支付金额
                            let ordernum:string = "";//订单编号
                            if (res.code == 200) {
                                true_total = res.data.true_total;
                                ordernum = res.data.ordernum;
                                if (true_total <= 0) {//如果实际付款金额小于等于0，直接调用付款成功接口
                                    store.dispatch("order/payOrder",{
                                    ordernum: ordernum, pay_type: 1, success: () => {
                                            //跳转到支付成功页面
                                            pushPage('/user_pages/order/pay_success?branch_shop_id=' + branch_shop_id.value + '&table_code=' + table_code.value)
                                        }
                                    });
                                }else{
                                    //#ifdef MP-WEIXIN
                                    //微信支付成功的回调地址
                                    let notifyUrl ="https://diancan.glbuys.com/api/home/wxpay/wechat_notify";
                                    //微信支付统一下单接口
                                    let unifOrder:any =await store.dispatch("order/wechatUnifiedorder",{
                                        open_id: openId.value,//用户登录的openId
                                        notify_url: notifyUrl,//支付成功的回调地址
                                        ordernum: ordernum,//订单编号
                                        price: true_total,//支付金额
                                        body: "点餐"//商品描述
                                    });
                                    let timeStamp:string = unifOrder.data['timeStamp'];//时间戳
                                    let nonceStr:string = unifOrder.data['nonceStr'];//随机字符串
                                    let packages:string = unifOrder.data['package'];//统一下单接口返回的prepay_id参数值
                                    let sign:string = unifOrder.data['paySign'];//签名
                                    uni.requestPayment({
                                        provider: 'wxpay',
                                        timeStamp: timeStamp.toString(),
                                        nonceStr: nonceStr,
                                        package: packages,
                                        signType: 'MD5',
                                        paySign: sign,
                                        success: (res:any) => {
                                            //跳转到支付成功页面                        
                                            pushPage('/user_pages/order/pay_success?branch_shop_id=' + branch_shop_id.value + '&table_code=' + table_code.value)
                                        },
                                        fail: (err:any) => {
                                        }
                                    });
                                    //#endif
                                }
                            } else {
                                uni.showToast({
                                    title: '' + res.data + '',
                                    icon: "none",
                                    duration: 2000
                                })
                            }
                            isPay = true;
                        }
                    });
                }
            }
           return{
            branch_shop_id,
            table_code,
            remarks,
            isDisablePack,
            hotelArea,
            shopInfo,
            cartData,
            total,
            packTotal,
            true_total,
            pushPage,
            changePack,
            goPay
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color:#FFFFFF;overflow:hidden;margin-bottom:160rpx;}
    .shop-title{width:100%;height:80rpx;background-color:#FFFFFF;border-bottom: 1px solid #EFEFEF;font-size:28rpx;text-align:center;line-height:80rpx;}
    .order-main{width:100%;}
    .order-main .order-list{width:100%;border-bottom:1px solid #f17f1f;}
    .order-main .order-list .order-info{width:100%;border-bottom: 1px solid #EFEFEF;box-sizing: border-box;padding:20rpx;}
    .order-main .order-list .area-table{width:100%;display:flex;font-size:28rpx;margin-top:20rpx;}
    .order-main .order-list .area-table .area{margin-right:40rpx;}

    .order-main .order-desc{width:100%;}
    .order-main .goods-list-main{width:100%;box-sizing: border-box;padding:20rpx;border-bottom: 1px solid #EFEFEF;}
    .order-main .order-desc .goods-list{width:100%;display:flex;justify-content: space-between;align-items: center;}
    .order-main .order-desc .goods-list .image{width:120rpx;height:120rpx;}
    .order-main .order-desc .goods-list .image image{width:100%;height:100%;border-radius: 5px;}
    .order-main .order-desc .goods-list .goods-info{width:80%;height:auto;font-size:28rpx;overflow:hidden;}
    .order-main .order-desc .goods-list .goods-info .title{width:100%;height:45rpx;overflow:hidden;text-overflow: ellipsis;white-space: nowrap;}
    .order-main .order-desc .goods-list .goods-info .info-text{width:auto;height:auto;color:#909090;margin-bottom:10rpx;}
    .order-main .order-desc .goods-list .goods-info .is-meal{width:auto;height:auto;color:#909090;}
    .order-main .order-desc .meal-items{width:100%;margin-top:20rpx;}
    .order-main .order-desc .meal-items .item-list{width:100%;height:80rpx;display:flex;justify-content: space-between;align-items: center;font-size:28rpx;color:#909090}
    .order-main .order-desc .meal-items .item-list .item{display:flex;}
    .order-main .order-desc .meal-items .item-list .item view{margin-right:20rpx;}
    .order-main .order-desc .meal-items .item-list .refund-btn{width:auto;height:auto;padding:8rpx 15rpx;color:#FFFFFF;font-size:28rpx;background-color:#007aff;border-radius: 4px;}
    .order-main .order-list .price-status{width:100%;height:auto;box-sizing: border-box;padding:20rpx;display:flex;justify-content: flex-end;align-items: center;}
    .order-main .order-list .price-status .price{font-size:28rpx;color:#333333}

    .order-main .order-row{width:100%;height:auto;border-bottom: 1px solid #EFEFEF;justify-content: space-between;align-items: center;display:flex;box-sizing: border-box;padding:20rpx 20rpx;}
    .order-main .order-row .order-col-1{font-size:28rpx;display:flex;}
    .order-main .order-row .order-col-2{display:flex;font-size:28rpx;color:#909090;height:40rpx;align-items: center;}
    .order-main .order-row .order-col-2.active{color:#000000}
    .order-main .order-row .radio-style{transform:scale(.8)}
    .order-main .order-row .order-col-2 label{margin-left:30rpx;}

    .order-main .remarks{font-size:28rpx;width:100%;margin-top:20rpx;box-sizing: border-box;padding:0px 20rpx;}
    .order-main .remarks .content{width:100%;height:300rpx;overflow:hidden;margin-top:20rpx;border-radius: 5px;border:1px solid #EFEFEF;}
    .order-main .remarks .content textarea{width:100%;height:100%;padding:20rpx;}
    .order-main .remarks .address{width:100%;height:70rpx;overflow:hidden;margin-top:20rpx;border-radius: 5px;border:1px solid #EFEFEF;box-sizing: border-box;color:#717171;padding:13rpx;}

    .pay-wrap{width:90%;height:110rpx;background-color:#000000;position: fixed;bottom:10rpx;left:50%;transform: translateX(-50%);display:flex;z-index:10;}
    .pay-wrap .price{font-size:40rpx;color:#FFFFFF;width:auto;box-sizing: border-box;background-color:#000000;position: absolute;z-index:10;left:10%;top:25rpx;}
    .pay-wrap .pay{width:190rpx;height:100%;background-color:#f17f1f;text-align:center;line-height:110rpx;font-size:40rpx;color:#FFFFFF;position: fixed;z-index:10;right:0%;bottom:0rpx;}
</style>