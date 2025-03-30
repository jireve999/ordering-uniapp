<template>
	<view class="page">
		<view class="status_bar"></view>
		<view class="header">
			<view :class="{'search-header':true,ipx:isIpx}" @click="isShow=true">
				<view class="search-wrap">
					<view class="icon"></view>
					<view class="text">请输入商家名或菜品</view>
				</view>
			</view>
		</view>
		<view class="shop-main">
			<view class="shop-list" v-for="item in shops" :key="item.branch_shop_id">
				<view class="shop-wrap">
					<view class="image">
						<image :src="item.logo" />
					</view>
					<view class="shop-info">
						<view class="shop-name">{{item.branch_shop_name}}</view>
						<view class="distance">{{ item.distance }}</view>
						<view class="address">{{ item.address }}</view>
						<view class="pack-btn">自提</view>
					</view>	
				</view>
			</view>
		</view>
		<Search :show="isShow" @close="isShow=false"></Search>
	</view>
</template>

<script lang="ts">
	import {defineComponent, computed,ref} from "vue";
	import {useStore} from "vuex";
	import {onShow, onPullDownRefresh, onReachBottom} from "@dcloudio/uni-app"; // 导入uni-app
	import Search from "../../components/search";
	export default defineComponent({
		// 支持分享小程序
		onShareAppMessage(res:any){
			// if (res.from === 'menu') {
				return {
					title: '点餐小程序',
					path: '/pages/main/main'
				}
			// }
		},
		components:{
			Search
		},
		setup() {
			let store:any = useStore();
			let isIpx:any = computed(()=>store.state.system.isIpx); // 获取vuex中isIpx的值
			let shops:any = computed(() => store.state.business.shops); // 获取vuex的商铺数据
			let lng:number=0; // 经度
			let lat:number=0; // 纬度
			let maxPage:number=0; //总页数
			let curPage:number=1; //当前页码
			let isShow:any=ref(false);//是否显示搜索组件
			onShow(() => {
				//#ifdef MP-WEIXIN || H5 && APP
				//如果用户关闭了地理位置功能
				//getSetting获取用户的当前设置
				uni.getSetting({
					success: (res:any) => {
						// console.log(res.authSetting, res.authSetting["scope.userLocation"]);
						// 如果用户没有开启获取位置
						if(!res.authSetting["scope.userLocation"]){ 
							uni.showModal({
								title: '开启获取地理位置',
								content: '请设置”位置信息“权限，找到附近的店铺',
								success: (res2:any) => {
									if (res2.confirm) {
										// 使用openSetting调器客户端小程序设置界面，返回用户设置的操作结果
										uni.openSetting({
											success(res3:any) {
												// console.log(res3.authSetting);
											}
										});
									} else if(res2.cancel) {
										// console.log('用户点击取消');
									}
								}

							})
						}
					}
				});
				//#endif
				//如果用户没有关闭地理位置功能，直接获取位置并获取商铺
				uni.getLocation({
					type: 'gcj02',
					complete: (res:any)=> {
							lng=res.longitude;//经度
							lat=res.latitude;//纬度
							//获取商铺信息
							//store/business/index.ts文件中actions内部的getShop方法
							store.dispatch("business/getShop",{page:1,lng:lng?lng:0,lat:lat?lat:0,success:(pageNum:number)=>{
									maxPage=pageNum;//总页码数
									console.log("maxPage",maxPage);
							}});
						}
				});
				// 下拉刷新
				onPullDownRefresh(()=>{
					curPage=1; // 将当前页码数设置为1
					store.dispatch("business/getShop",{page:curPage,lng:lng?lng:0,lat:lat?lat:0,success:(pageNum:number)=>{
							maxPage=pageNum;//总页码数
						},
						complete:()=>{
							// 服务端请求完成后，停止下拉刷新
							uni.stopPullDownRefresh();
						}
					});
				}) 
				// 上拉加载更多
				onReachBottom(()=>{
					if (curPage < maxPage) {
						curPage++;
						store.dispatch("business/getShopPage",{page:curPage,lng:lng?lng:0,lat:lat?lat:0});
						// console.log(curPage);
					}
				})
			});
			return {
				isIpx,
				shops,
				isShow
			};
		}
	})
</script>

<style scoped>
.page{width:100%;min-height:100vh;overflow:hidden;}
    .status_bar.bg-color{background-color:#E30019;}
    .header{width:100%;background-color:#eb1625;overflow:hidden;position: fixed;left:0;top:0;z-index:90;}
    .search-header{width:100%;height:170rpx;display: flex;justify-content: center;align-items: flex-end;margin-top:40rpx;box-sizing: border-box;padding-bottom:20rpx;}
    .search-header.ipx{height:210rpx;}
    .header .search-wrap{width:80%;height:52rpx;background-color:rgba(255,255,255,0.9);border-radius: 5px;display:flex;justify-content: start;align-items: center;}
    .header .search-wrap .icon{width:44rpx;height:44rpx;background-image:url("~@/static/images/main/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin:0 20rpx;}
    .header .search-wrap .search{font-size:28rpx;color:#999999;}
    .shop-main{width:100%;margin-top:220rpx;}
    .shop-main.ipx{margin-top:260rpx;}
    .shop-main .shop-list{width:100%;border-bottom: 1px solid #EFEFEF;box-sizing: border-box;padding:20rpx 0;}
    .shop-main .shop-list .shop-wrap{width:92%;height:auto;margin:0 auto;display:flex;justify-content: start;}
    .shop-main .shop-list .shop-wrap .image{width:160rpx;height:160rpx;margin-right:20rpx;}
    .shop-main .shop-list .shop-wrap .image image{width:100%;height:100%;border-radius: 5px;}
    .shop-main .shop-list .shop-info{width:72%;clear: both;}
    .shop-main .shop-list .shop-info .shop-name{font-size:32rpx;font-weight: bold;width:100%;height:45rpx;white-space: nowrap;overflow:hidden;text-overflow: ellipsis;}
    .shop-main .shop-list .shop-info .distance{font-size:28rpx;color:#666666;margin-top:10rpx;}
    .shop-main .shop-list .shop-info .address{font-size:28rpx;color:#666666;margin-top:10rpx;width:100%;height:45rpx;white-space: nowrap;overflow:hidden;text-overflow: ellipsis;}
    .shop-main .shop-list .shop-info .pack-btn{padding:10rpx 20rpx;font-size:28rpx;color:#FFFFFF;background-color:#eb1625;width:auto;height:auto;display:table;margin-top:10rpx;border-radius: 5px;float:right;}
    .shop-main .shop-list .shop-info .pack-btn.disable{color:#666666;background-color:#EFEFEF}
</style>
