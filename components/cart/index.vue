<template>
    <view>
        <view class="mask" v-show="show" @click="close"></view>
        <view :class="{'cart-main':true, show:show}">
            <view class="nav">
                <view class="nav-title">
                    <view class="icon"></view>
                    <view class="text">已选菜品</view>
                </view>
                <view class="clear-main" @click="clearCart()">
                    <view class="icon"></view>
                    <view class="text">清空</view>
                </view>
            </view>
            <scroll-view scroll-y="true" class="goods-main">
                <view class="scroll-wrap">
                    <view class="goods-list" v-for="(item,index) in cartData" :key="index">
                        <view class="title-area">
                            <view class="title">{{item.title}}</view>
                            <view class="price-amount">
                                <view class="price">￥{{item.price}}</view>
                                <view class="handle-amount">
                                    <!--如果数量大于0显示减号按钮-->
                                    <view class="dec" v-show="item.amount>0?true:false" @click="decAmount($event,item.gid,item.new_meal_items,item.meal_items)"></view>
                                    <!--如果数量大于0并且isAmountInput的值为false显示文本数量-->
                                    <view class="text" v-if="!item.isAmountInput && item.amount>0" @click="showAmountInput(index)">{{item.amount}}</view>
                                    <!--如果isAmountInput的值为true显示input输入框，这里可以修改数量-->
                                    <input v-if="item.isAmountInput" :focus="item.isAmountInputFocus" :value="item.amount" type="number" @blur="setAmount($event,item.gid,item.new_meal_items,item.meal_items,index)" />
                                    <!--添加购物车按钮-->
                                    <view class="inc" @click="incAmount($event,item.gid,item.new_meal_items,item.meal_items)"></view>
                                </view>
                            </view>
                        </view>
                        <!--如果非套餐并且包装费大于0，显示包装费-->
                        <view class="pack-price" v-if="!item.meal_items && item.pack_price>0">包装费：￥{{item.pack_price}}</view>
                        <!--如果是套餐，显示套餐里菜品的明细-->
                        <view class="goods-desc" v-if="item.meal_items && item.meal_items.length>0">
                            <view class="goods-desc-list" v-for="(item2,index2) in item.meal_items" :key="index2"><view class="goods-title">- {{item2.title}} x{{item2.amount}}</view><view v-if="item2.pack_price>0">&nbsp;&nbsp;包装费：￥{{item2.pack_price}}</view></view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import {useStore} from "vuex";
    export default defineComponent({
        name:'cart',
        props:{
            //是否显示购物车组件
            show:{
                type:Boolean,
                default: false
            },
            //购物车里菜品的数据
            cartData:{
                type:Array,
                default:()=>[]
            },
            //获取桌号和分店的id
            values:{
                type:Object,
                default:()=>{}
            }
        },
        setup(props:any,conText:any){
            let store=useStore();
            //隐藏购物车组件
            let close:Function=()=>{
                conText.emit("close");
            }
            //增加数量
            let incAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                //触发pages/goods/index.vue文件中的incAmount方法
                conText.emit("incAmount",e,gid,new_meal_items,meal_items);
            }
            //减少数量
            let decAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                //触发pages/goods/index.vue文件中的decAmount方法
                conText.emit("decAmount",e,gid,new_meal_items,meal_items);
            }
            //更改数量
            let setAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string,index:number)=>{
                //触发pages/goods/index.vue文件中的setAmount方法
                conText.emit("setAmount",e,gid,new_meal_items,meal_items);
                //隐藏数量input输入框
                store.commit("cart/HIDE_AMOUNT_INPUT",{index});
            }
            //显示数量输入框
            let showAmountInput:Function=(index:number)=>{
                store.commit("cart/SHOW_AMOUNT_INPUT",{index});
            }
            //清空购物车
            let clearCart:Function=()=>{
                if(props.cartData.length>0){
                    uni.showModal({
                        title: '',
                        content: '确认要清空购物车吗？',
                        success: (res:any)=> {
                            if (res.confirm) {
                                conText.emit("clearCart");
                            } else if (res.cancel) {

                            }
                        }
                    });
                }
            }
           return{
            close,
            incAmount,
            decAmount,
            setAmount,
            showAmountInput,
            clearCart
           }
        }
    })
</script>

<style scoped>
    .mask{width:100%;height:100%;position: fixed;z-index:88;bottom:0px;left:0px;background-color:rgba(0,0,0,0.6)}
    .cart-main{width:100%;height:994rpx;background-color:#FFFFFF;position:absolute;bottom:0px;left:0px;z-index:89;transform: translateY(100%);transition:transform 0.3s;}
    .cart-main .nav{width:100%;height:100rpx;border-bottom: 1px solid #EFEFEF;display: flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding:0px 20rpx;}
    .cart-main .nav-title{width:auto;height:auto;display:flex;}
    .cart-main .nav-title .icon{width:45rpx;height:45rpx;background-image:url("~@/static/images/goods/cart.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .cart-main .text{font-size:28rpx;color:#333333;}
    .cart-main .clear-main{width:auto;height:auto;display:flex;}
    .cart-main .clear-main .icon{width:36rpx;height:36rpx;background-image:url("~@/static/images/goods/clear.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .cart-main .goods-main{width:100%;height:730rpx;overflow:hidden;}
    .cart-main .goods-main .goods-list{width:94%;margin:0 auto;}
    .cart-main .goods-list .title-area{width:100%;height:90rpx;display:flex;justify-content: space-between;align-items: center;}
    .cart-main .goods-list .title-area .title{font-size:28rpx;color:#333333;}
    .cart-main .goods-list .goods-desc{width:94%;margin:0 auto;}
    .cart-main .goods-list .goods-desc-list{width:100%;height:auto;font-size:24rpx;color:#929292;display: flex;justify-content: space-between;margin-bottom:20rpx;}
    .cart-main .goods-list .pack-price{font-size:24rpx;color:#333333;}

    .price-amount{width:auto;height:100%;display:flex;justify-content: space-between;align-items: center;}
    .price-amount.points{font-size:28rpx;color:#333333;}
    .price-amount .price{width:auto;height:auto;font-size:28rpx;color:#333333;margin-right:20rpx;}
    .price-amount image{width:30rpx;height:30rpx;margin-right:10rpx;}
    .handle-amount{width:auto;height:60rpx;display:flex;align-items: center;justify-content:flex-end}
    .handle-amount .dec{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/dec.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
   .handle-amount .inc{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/inc.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .handle-amount .text{font-size:28rpx;color:#000000;margin-right:10rpx;margin-left:10rpx;width:50rpx;text-align:center;}
    .handle-amount .text.disabled{color:#9d9d9d}
    .handle-amount input{width:50rpx;height:100%;text-align: center;margin-right:10rpx;margin-left:10rpx;}
    .cart-main.show{transform: translateY(0%);}
    .goods-main .tip{width:100%;font-size:24rpx;color:#E30019;text-align:center;margin-top:30rpx;}
    .goods-main .scroll-wrap{
         width:100%;
         min-height:120%;
     }
</style>