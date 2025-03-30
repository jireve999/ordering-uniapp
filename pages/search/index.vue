<template>
    <view class="page">
        <view class="status_bar bg-color"></view>
        <view :class="{nav:true,wechat:true,ipx:isIpx}">
            <view class="back" @click="back()"></view>
            <view class="title">搜索</view>
        </view>
        <view :class="{header:true,ipx:isIpx}">
            <view :class="{'search-header':true}">
                <view class="search-wrap" @click="isShow=true">
                    <view class="icon"></view>
                    <view class="search">输入商家名或菜品</view>
                </view>
            </view>
        </view>
        <view :class="{main:true,ipx:isIpx}" v-if="searchGoods.length>0">
            <view class="goods-wrap" v-for="(item,index) in searchGoods" :key="index" @click="replacePage('/pages/goods/index?branch_shop_id='+item.branch_shop_id+'&gid='+item.gid+'')">
                <view class="shop">
                    <view class="shop-name">{{item.branch_shop_name}}</view>
                    <view class="distance">{{item.distance}}</view>
                </view>
                <view class="goods-list">
                    <view class="image"><image :src="item.image"></image></view>
                    <view class="goods-info">
                        <view class="goods-title">{{item.title}}</view>
                        <view class="sales">销量：{{item.sales}}</view>
                        <view class="price-wrap">
                            <view class="price">￥{{item.price}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="no-data" v-if="searchGoods.length<=0">没有相关菜品！</view>
        <Search :show="isShow" @close="isShow=false" :isLocal="true"></Search>
    </view>
</template>

<script lang="ts">
    import { defineComponent,computed,ref } from 'vue';
    import {onShow,onLoad,onReachBottom} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    import Search from "../../components/search";
    export default defineComponent({
        name:'search',
        //引入组件
        components:{
            Search
        },
        setup(){
            let store:any=useStore();//启用vuex
            let isIpx:any=computed(()=>store.state.system.isIpx);//获取Vuex是否在iPhoneX中
            let searchGoods:any=computed(()=>store.state.search.searchGoods);//菜品搜索的数据
            let isShow:any=ref(false);//是否显示搜索组件
            let kwords:string="";//获取搜索的关键词
            let maxPage:number=0;//总分页数
            let curPage:number=1;//当前页码
            let lng:number=0;//经度
            let lat:number=0;//纬度

            onLoad((opts:any)=>{
                kwords=opts.kwords?decodeURIComponent(opts.kwords):"";//如果url地址有kwords属性获取其值，否则为空
            })

            onShow(()=>{
                //获取地理位置的坐标
                uni.getLocation({
                    type: 'gcj02',
                    complete: (res:any)=> {
                        lng=res.longitude;//经度
                        lat=res.latitude;//纬度
                        //获取菜品搜索的数据
                        store.dispatch("search/getSearchGoods",{page:1,kwords:kwords,lng:lng?lng:0,lat:lat?lat:0,success:(pageNum:number)=>{
                                maxPage=pageNum;//获取总分页数
                            }})
                    }
                });
            })
            //上拉加载数据
            onReachBottom(()=>{
                //如果当前页面小于总页数
                if(curPage<=maxPage){
                    curPage++;//当前页码+1
                    //调用Vuex菜品搜索分页显示数据的方法
                    store.dispatch("search/getSearchGoodsPage",{page:curPage,kwords:kwords,lng:lng?lng:0,lat:lat?lat:0});
                }
            })
            //返回上一页
            let back:Function=()=>{
                uni.navigateBack({
                    detail:1
                })
            }
            //跳转页面
            let replacePage:Function=(url:string)=>{
                uni.redirectTo({
                    url:url
                })
            }
           return{
            isIpx,
            isShow,
            searchGoods,
            back,
            replacePage
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;background-color:#FFFFFF;overflow:hidden;}
    .status_bar.bg-color{background-color:#E30019;}
    .nav{width:100%;height:88rpx;background-color:rgb(227, 0, 25);position: fixed;z-index:91;left:0;top:0;display: flex;justify-content: space-between;align-items: center;}
    .nav .back{width:40rpx;height:40rpx;background-image:url("~@/static/images/common/back.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .nav .title{position: absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%);color:#FFFFFF;font-size:28rpx;}
    .header{width:100%;background-color:#eb1625;overflow:hidden;position: fixed;left:0;top:88rpx;z-index:90;}
    .search-header{width:100%;height:auto;display: flex;justify-content: center;align-items: flex-end;margin-top:88rpx;box-sizing: border-box;padding-bottom:20rpx;}
    .header .search-wrap{width:80%;height:52rpx;background-color:rgba(255,255,255,0.9);border-radius: 5px;display:flex;justify-content: start;align-items: center;}
    .header .search-wrap .icon{width:44rpx;height:44rpx;background-image:url("~@/static/images/main/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin:0 20rpx;}
    .header .search-wrap .search{font-size:28rpx;color:#999999;}

    .main{width:100%;margin:0 auto;margin-top:280rpx;overflow:hidden;}
    .goods-wrap{width:100%;overflow:hidden;margin-bottom:40rpx;border-bottom: 1px solid #EFEFEF;box-sizing: border-box;padding-left:50rpx;padding-right:50rpx;padding-bottom:50rpx;}
    .shop{width:100%;height:36rpx;display: flex;justify-content: space-between;align-items: center;overflow:hidden;}
    .shop .shop-name{font-size:36rpx;font-weight: bold;width:80%;height:54rpx;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;}
    .shop .distance{font-size:24rpx;color:#666666;}
    .goods-list{width:100%;height:auto;display:flex;justify-content: space-between;margin-top:20rpx;}
    .goods-list .image{width:180rpx;height:180rpx;border-radius: 6px;}
    .goods-list .image image{width:100%;height:100%;border-radius: 6px;}
    .goods-list .goods-info{width:62%;height:auto;margin-right:20rpx;}
    .goods-list .goods-title{width:100%;height:80rpx;overflow:hidden;font-size:28rpx;color:#333333;font-weight: bold;}
    .goods-list .sales{font-size:24rpx;color:#999999;margin-top:10rpx;}
    .goods-list .price{font-size:28rpx;color:#fb4e44;font-weight: bold;}
    .goods-list .price-wrap{width:100%;margin-top:10rpx;display:flex;justify-content: space-between;}

    /*#ifdef MP-WEIXIN*/
    .nav.wechat{padding-top:70rpx;}
    .nav.wechat.ipx{padding-top:90rpx;}
    .nav.wechat .title{top:65%}
    .nav.wechat.ipx .title{top:75%}
    .header.ipx{top:170rpx;}
    .main.ipx{margin-top:330rpx;}
    /*#endif*/
</style>