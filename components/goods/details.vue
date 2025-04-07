<template>
    <view>
        <view class="mask" v-show="show" @click="close"></view>
        <view :class="{details:true, show:show}">
            <view class="goods">
                <view class="image">
                    <image :src="goodsDetails.image"></image>
                </view>
                <view class="text">{{goodsDetails.title}}</view>
            </view>
            <view class="goods-info">
                <view class="price-amount">
                    <view class="price">价格：￥{{goodsDetails.price}}</view>
                    <view class="handle-amount">
                        <view class="dec" v-show="amount>0?true:false" @click="decAmount"></view>
                        <view class="text" v-if="!isAmountInput && amount>0" @click="showAmountInput">{{amount}}</view>
                        <input v-if="isAmountInput" :focus="isAmountInputFocus" :value="amount" type="number" @blur="setAmount" />
                        <view class="inc" @click="incAmount($event,amount)"></view>
                    </view>
                </view>
                <scroll-view scroll-y="true" class="content"><rich-text :nodes="goodsDetails.content"></rich-text></scroll-view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,watch,computed } from 'vue';
    import {useStore} from "vuex";
    export default defineComponent({
        name:'goods-details',
        props:{
            //是否显示组件
            show:{
                type:Boolean,
                default: false
            },
            //菜品的id
            gid:{
                type: String,
                default: ""
            },
            //分店的id
            branchShopId:{
                type:String,
                default:""
            },
            //菜品数量
            amount:{
                type:Number,
                default:0
            }
        },
        setup(props:any,conText:any){
            let store:any=useStore();
            let isAmountInput:any=ref(false);//是否显示input数量输入框
            let isAmountInputFocus:any=ref(false);//input数量输入框获取焦点
            let goodsDetails:any=computed(()=>store.state.goods.goodsDetails);//菜品详情数据
            //监听props菜品id的变化
            watch(()=>props.gid,(newVal:string,oldVal:string)=>{
                //获取菜品详情数据
                store.dispatch("goods/getGoodsDetails",{branch_shop_id:props.branchShopId,gid:newVal});
            })
            //隐藏组件
            let close:Function=()=>{
                conText.emit("close");
            }
            //显示数量输入框
            let showAmountInput:Function=()=>{
                isAmountInput.value=true;
                isAmountInputFocus.value=true;
            }
            //修改数量
            let setAmount:Function=(e:any)=>{
                //执行components/goods/index.vue文件中的setAmount方法
                conText.emit("setAmount",e,props.gid,"","");
                hideAmountInput();
            }
            //隐藏数量输入框
            let hideAmountInput:Function=()=>{
                isAmountInput.value=false;
                isAmountInputFocus.value=false;
            }
            //增加菜品数量
            let incAmount:Function=(e:any)=>{
                //触发components/goods/index.vue文件中的incAmount方法
                conText.emit("incAmount",e,props.gid,"","")
            }
            //减少菜品数量
            let decAmount:Function=(e:any)=>{
                //触发components/goods/index.vue文件中的decAmount方法
                conText.emit("decAmount",e,props.gid,"","")
            }
           return{
            isAmountInput,
            isAmountInputFocus,
            goodsDetails,
            close,
            setAmount,
            showAmountInput,
            incAmount,
            decAmount
           }
        }
    })
</script>

<style scoped>
    .mask{width:100%;height:100%;position: fixed;z-index:88;bottom:0px;left:0px;background-color:rgba(0,0,0,0.6)}
    .details{width:100%;height:795rpx;background-color:#FFFFFF;position:fixed;bottom:0px;left:0px;z-index:89;transform: translateY(100%);transition:all 0.3s;}
    .details .goods{width:100%;height:330rpx;border-bottom:1px solid #EFEFEF}
    .details .image{width:260rpx;height:260rpx;margin:0 auto;margin-top:20rpx;}
    .details .image image{width:100%;height:100%;border-radius: 6px;}
    .details .goods .text{width:auto;height:auto;margin:0 auto;margin-top:20rpx;white-space: nowrap;font-size:28rpx;color:#333333;text-align:center;font-weight: bold;}

    .details .goods-info{width:85%;margin:0 auto;font-size:28rpx;color:#333333;font-weight: bold;}
    .details .goods-info .price-amount{width:100%;display:flex;justify-content: space-between;margin-top:20rpx;}
    .details .goods-info .handle-amount{width:auto;height:60rpx;display:flex;align-items: center;justify-content:flex-end}
    .details .goods-info .handle-amount .dec{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/dec.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .details .goods-info .handle-amount .inc{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/inc.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .details .goods-info .handle-amount input{width:50rpx;height:100%;text-align: center;margin-right:10rpx;margin-left:10rpx;}
    .details .goods-info .handle-amount .text{font-size:28rpx;color:#333333;margin-right:10rpx;margin-left:10rpx;width:50rpx;text-align:center;}
    .details .goods-info .content{width:100%;height:200rpx;margin-top:20rpx;overflow:hidden;}
    .details.show{transform: translateY(0%)}
</style>