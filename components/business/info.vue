<template>
    <scroll-view scroll-y="true" class="business-info-main" v-show="isShow">
        <view class="row-area" v-if="infoData.phone?true:false">
            <view class="col1 cellphone-icon"></view>
            <view class="col2"><text @click="makePhoneCall(''+infoData.phone+'')">{{infoData.phone}}</text></view>
        </view>
        <view class="row-area" v-if="infoData.address?true:false" @click="businessMap()">
            <view class="col1 address-icon"></view>
            <view class="col2"><text selectable="true">{{infoData.address}}</text></view>
        </view>
        <view class="row-area" v-if="infoData.full_notice?true:false">
            <view class="col1 notice-icon"></view>
            <view class="col2">
                <rich-text :nodes="infoData.full_notice"></rich-text>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name:'business-info',
        props:{
            //是否显示组件信息
            isShow:{
                type:Boolean,
                default:false
            },
            //商家信息数据
            infoData:{
                type:Object,
                default:()=>{}
            },
            //分店的id
            branchShopId:{
                type:String,
                default:""
            }
        },
        setup(props:any){
            //拨打电话
            let makePhoneCall:Function=(number:number)=>{
                //在h5平台拨打电话
                /* #ifdef H5 */
                window.location.href="tel://"+number+"";
                /* #endif */
                //在小程序中拨打电话
                /* #ifndef H5*/ 
                uni.makePhoneCall({
                    phoneNumber: number
                });
                /* #endif */
            }
            //跳转到商家位置页面
            let businessMap:Function=()=>{
                if(props.infoData.lng && props.infoData.lat){
                    pushPage('/pages/business_map/index?branch_shop_id='+props.branchShopId+'&lng='+props.infoData.lng+'&lat='+props.infoData.lat+'');
                }
            }
            //跳转页面
            let pushPage:Function=(url:string)=>{
                uni.navigateTo({
                    url:url
                })
            }
           return{
            makePhoneCall,
            businessMap
           }
        }
    })
</script>

<style scoped>
    .business-info-main{width:100%;height:55vh;font-size:28rpx;}
    .business-info-main .row-area{width:100%;height:auto;display:flex;box-sizing: border-box;padding:10rpx 22rpx;}
    .business-info-main .col1{width:35rpx;height:35rpx;}
    .business-info-main .col2{width:700rpx;overflow:hidden;}
    .business-info-main .col1.cellphone-icon{background-image:url("~@/static/images/goods/cellphone.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .business-info-main .col1.address-icon{background-image:url("~@/static/images/goods/address.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .business-info-main .col1.notice-icon{background-image:url("~@/static/images/goods/notice.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}

    .points-tip{width:75%;height:25px;position:fixed;z-index:1;left:23%;bottom:95rpx;background-color:#FFFFFF;text-align: center;line-height:25px;font-size:28rpx;color:#E30019;border-radius: 5px;border:1px solid #f6ab00;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;}
</style>