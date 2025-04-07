<template>
    <view class="mask" v-show="show">
        <view class="refund-win">
            <view class="title">菜品名称：{{title}}</view>
            <view class="amount-wrap">
                <view class="text">数量：</view>
                <view class="handle-amount">
                    <view class="dec" @click="refundAmount>1?--refundAmount:1"></view>
                    <text>{{refundAmount}}</text>
                    <view class="inc" @click="incAmount()"></view>
                </view>
            </view>
            <view class="refund-content"><textarea fixed="true" placeholder="请输入退款原因" v-model="refundContent"></textarea></view>
            <view class="handle-btn">
                <button class="cancel" @click="cancel()">取消</button>
                <button class="submit" @click="submitData()">提交</button>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,watch } from 'vue';
    import {useStore} from "vuex";
    export default defineComponent({
        name:'refund-order',
        props:{
            //是否显示组件
            show:{
                type:Boolean,
                default:false
            },
            //是否套餐
            isMeal:{
                type:String,
                default:""
            },
            //订单明细的id
            orderItemId:{
                type:String,
                default:""
            },
            //菜品名称
            title:{
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
            let refundAmount=ref(1);//退菜数量
            let refundContent=ref("");//退款原因
            let isSubmit:boolean=true;//防止网络延迟，出现重复申请退款订单
            let store=useStore();
            //提交申请退款
            let submitData:Function=()=>{
                if(isSubmit){
                    isSubmit=false;
                    //申请退款
                    store.dispatch("order/applyRefundOrder",{refund_amount:refundAmount.value,order_item_id:props.orderItemId,refund_content:refundContent.value,is_meal:props.isMeal,success:(res:any)=>{
                            if(res.code==200){
                                uni.showToast({
                                    title:"申请退款成功，我们会尽快处理！",
                                    icon:"none",
                                    duration:2000
                                });
                                setTimeout(()=>{
                                    isSubmit=true;
                                    cancel();//隐藏申请退款组件
                                },2000);
                            }else{
                                isSubmit=true;
                                uni.showToast({
                                    title:""+res.data+"",
                                    icon:"none",
                                    duration:2000
                                });
                            }
                        }});
                }
            }
            //隐藏组件
            let cancel:Function=()=>{
                refundAmount.value=1;
                refundContent.value="";
                conText.emit("cancel");
            }
            //增加菜品退款数量
            let incAmount:Function=()=>{
                if(refundAmount.value<props.amount){
                    refundAmount+=1;
                }else{
                    uni.showToast({
                        title:"退款数量不能大于购买数量",
                        icon:"none",
                        duration:2000
                    });
                }
            }
            //监听父组件菜品数量的变化
            watch(()=>props.amount,(newVal:number,oldVal:number)=>{
                refundAmount.value=newVal;
            })
           return{
            refundAmount,
            refundContent,
            submitData,
            incAmount
           }
        }
    })
</script>

<style scoped>
    .mask{width:100%;height:100%;position: fixed;left:0px;top:0px;z-index:90;background-color:rgba(0,0,0,0.6)}
    .refund-win{width:80%;height:600rpx;background-color:#FFFFFF;position: absolute;left:0px;top:0px;bottom:0px;right:0px;margin:auto;z-index:1;border-radius: 5px;box-sizing: border-box;padding:20rpx;font-size:28rpx;}

    .amount-wrap{width:100%;height:80rpx;display:flex;align-items: center;}
    .handle-amount{width:auto;height:60rpx;display:flex;align-items: center;justify-content:flex-end}
    .handle-amount .dec{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/dec.png");background-size:100%;background-position: center;background-repeat: no-repeat;margin-right:20rpx}
    .handle-amount .inc{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/inc.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .handle-amount text{font-size:28rpx;color:#333333;margin-right:20rpx;}

    .refund-content{width:100%;height:300rpx;border:1px solid #EFEFEF;border-radius: 4px;margin-top:10rpx;padding:20rpx;box-sizing: border-box;}
    .refund-content textarea{width:100%;height:100%;font-size:28rpx;}
    .handle-btn{width:350rpx;height:auto;margin:0 auto;margin-top:40rpx;display:flex;}
    .handle-btn .submit{width:160rpx;height:70rpx;background-color:#E30019;font-size:28rpx;color:#FFFFFF;}
    .handle-btn .cancel{width:160rpx;height:70rpx;background-color:#007aff;font-size:28rpx;color:#FFFFFF;}
</style>