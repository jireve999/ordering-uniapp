<template>
	<view class="page">
		<view class="status_bar"></view>
		<view class="header">
			<view :class="{'search-header':true,ipx:true}">
				<view class="search-wrap">
					<view class="icon"></view>
					<view class="text">请输入商家名或菜品</view>
				</view>
			</view>
		</view>
		<view class="shop-main">
			<view class="shop-list">
				<view class="shop-wrap">
					<view class="image">
						<image src="https://diancan.lucklnk.com/businessfiles/logo/1600743948.jpg" />
					</view>
					<view class="shop-info">
						<view class="shop-name">麦当劳</view>
						<view class="distance">1.2km</view>
						<view class="address">广东省广州市天河区天河路</view>
						<view class="pack-btn">自提</view>
					</view>	
				</view>
			</view>
			<view class="shop-list">
				<view class="shop-wrap">
					<view class="image">
						<image src="https://diancan.lucklnk.com/businessfiles/logo/1600743948.jpg" />
					</view>
					<view class="shop-info">
						<view class="shop-name">麦当劳</view>
						<view class="distance">1.2km</view>
						<view class="address">广东省广州市天河区天河路</view>
						<view class="pack-btn">自提</view>
					</view>	
				</view>
			</view>
			<view class="shop-list">
				<view class="shop-wrap">
					<view class="image">
						<image src="https://diancan.lucklnk.com/businessfiles/logo/1600743948.jpg" />
					</view>
					<view class="shop-info">
						<view class="shop-name">麦当劳</view>
						<view class="distance">1.2km</view>
						<view class="address">广东省广州市天河区天河路</view>
						<view class="pack-btn">自提</view>
					</view>	
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {defineComponent} from "vue";
	export default defineComponent({
		setup() {
			return {}
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
