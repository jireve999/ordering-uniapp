<template>
     <view class="page">
        <map class="map" :latitude="lat" :longitude="lng" :markers="markes"></map>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,reactive,computed } from 'vue';
    import {onLoad} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    let lng:any;//商家的经度
    let lat:any;//商家的纬度
    let markes:any;
    export default defineComponent({
        name:'business-map',
        setup(){
            let store=useStore();
            let shopInfo:any=computed(()=>store.state.business.shopInfo);//商家信息
            lng=ref("");
            lat=ref("");
            markes=reactive([
                {
                    id:1,
                    latitude: 0,//图标的纬度
                    longitude: 0,//图标的经度
                    iconPath: '/static/images/business_map/map_pos.png',//显示的图标
                    width:30,//图标的宽
                    height:30,//图标的高
                    callout:{//自定义标记点上方的气泡窗口
                        fontSize:14,//字体大小
                        content:"",//文本内容
                        color:"#000000",//文本颜色
                        bgColor:"#FFFFFF",//背景色
                        padding:8,//文本边缘留白
                        borderWidth:1,//边框
                        borderColor:"#CCCCCC",//边框颜色
                        borderRadius:4,//callout边框圆角
                        display:"ALWAYS"//常显
                    }
                }
            ]);
            onLoad((opts:any)=>{
                lng.value=opts.lng?opts.lng:"";//商家的经度
                lat.value=opts.lat?opts.lat:"";//商家的纬度
                markes[0].latitude=lat.value;//将商家的纬度赋值给图标的纬度
                markes[0].longitude=lng.value;//将商家的经度赋值给图标的经度
                //callout的文本内容
                markes[0].callout.content=shopInfo.value.branch_shop_name+"\r\n"+shopInfo.value.address;
            })
           return{
            lng,
            lat,
            markes
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow:hidden;}
    .map{width:100%;height:100%;}
</style>