<template>
    <view class="page" v-show="show">
        <view class="status_bar"></view>
        <view :class="{'search-title':true,wechat:true,ipx:isIpx}">
            <view class="search-close" @click="close()"></view>
            <view class="title">搜索</view>
        </view>
        <view class="search-header">
            <view class="search-wrap">
                <view class="search-input"><input type="text" confirm-type="search" placeholder="请输入商家或菜品名称"  :focus="isFocus" @input="setKwords($event)" @confirm="goSearch($event)" :value="kwords" /></view>
                <view class="search-btn" @click="goSearch($event)"></view>
            </view>
        </view>
        <view class="search-main">
            <view class="search-area" v-if="historyKwords.length>0">
                <view class="search-name-wrap">
                    <view class="search-name">最近搜索</view>
                    <view class="bin" @click="clearHistoryKeywords()"></view>
                </view>
                <view class="search-kwords">
                    <view class="kwords" v-for="(item,index) in historyKwords" :key="index" @click="goSearch($event,item)">{{item}}</view>
                </view>
            </view>
            <view class="search-area" v-if="hotKeywords.length>0">
                <view class="search-name-wrap">
                    <view class="search-name">热门搜索</view>
                </view>
                <view class="search-kwords">
                    <view class="kwords" v-for="(item,index) in hotKeywords" :key="index" @click="goSearch($event,item.title)">{{item.title}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,computed,ref,watch } from 'vue';
    import {useStore} from "vuex";
    export default defineComponent({
        name:'search',
        props:{
            //是否显示搜索组件
            show:{
                type:Boolean,
                default:false
            },
            //是否在菜品搜索页面进行搜索
            isLocal:{
                type:Boolean,
                default:false
            }
        },
        setup(props:any,conText:any){
            let store:any=useStore();//启用vuex
            let isIpx:any=computed(()=>store.state.system.isIpx);//获取Vuex是否在iPhoneX中
            let kwords:any=computed(()=>store.state.search.kwords);//获取Vuex中的搜索的关键词
            let historyKwords:any=computed(()=>store.state.search.historyKwords);//获取Vuex中的历史搜索词
            let isFocus:any=ref(false);//input是否自动获取焦点
            //隐藏搜索组件
            let close:Function=()=>{
                conText.emit("close");
            }
            //监听props内部show的变化
            watch(()=>props.show,(newVal:Boolean,oldVal:Boolean)=>{
                //延迟300ms，可以实现input组件获取焦点
                setTimeout(()=>{
                    isFocus.value=newVal;
                },300);
            })

            //设置关键词
            let setKwords:Function=(e:any)=>{
                //触发store/search/index.ts文件中mutations内部的SET_KWORDS方法
                store.commit("search/SET_KWORDS",{kwords:e.target.value});
            }

            //跳转到菜品搜索页面
            let goSearch:Function=(event:any,kwordsVal:string)=>{
                let keyWords=kwordsVal || kwords.value;//如果有热门或历史搜索词获取此搜索词，否则为input组件输入的搜索词
                if(keyWords){
                    close();//隐藏搜索组件
                    //触发store/search/index.ts文件中mutations内部的SET_HISTORY_KWRODS方法
                    store.commit("search/SET_HISTORY_KWRODS",{kwords:keyWords});//添加搜索的关键词到Vuex中
                    if(props.isLocal){//如果是在菜品搜索页面进行搜索
                        //重定向跳转
                        uni.redirectTo({
                            url:'/pages/search/index?kwords='+keyWords+''
                        });
                    }else {//如果在其他页面进行搜索，比如首页
                        // 打开新页面跳转
                        uni.navigateTo({
                            url: '/pages/search/index?kwords=' + keyWords + ''
                        });
                    }
                }else{
                    uni.showToast({
                        title:"请输入搜索词",
                        icon:"none",
                        duration:2000
                    })
                }
            }
            //清除历史搜索
            let clearHistoryKeywords:Function=()=>{
                uni.showModal({
                    title: '',
                    content: '确认要清除历史记录吗？',
                    success: (res:any)=> {
                        if (res.confirm) {
                            //触发store/search/index.ts文件中mutations内部的CLEAR_KWORDS方法
                            store.commit("search/CLEAR_KWORDS");
                        } else if (res.cancel) {

                        }
                    }
                });
            }

            //触发Vuex内部的getHotKeywords方法获取服务端热门搜索关键词数据
            store.dispatch("search/getHotKeywords");
            //获取Vuex内部的热门搜索关键词数据，目的是渲染到视图中
            let hotKeywords:any=computed(()=>store.state.search.hotKeywords);
           return{
            close,
            isIpx,
            isFocus,
            setKwords,
            kwords,
            goSearch,
            historyKwords,
            clearHistoryKeywords,
            hotKeywords
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100%;position: fixed;left:0;top:0;z-index:999;background-color:#FFFFFF;}
    .search-header{width:100%;height:100rpx;border-bottom: 1px solid #EFEFEF;display: flex;box-sizing: border-box;padding:0px 20rpx;}
    .search-title .search-close{width:50rpx;height:50rpx;background-image:url("~@/static/images/common/back2.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:20rpx;}
    .search-header .search-wrap{width:95%;height:68rpx;border:1px solid #b2b2b2;border-radius: 5px;display: flex;justify-content: space-between;align-items: center;margin:0 auto;}
    .search-header .search-wrap .search-input{width:85%;height:100%;border-right:1px solid #b2b2b2;}
    .search-header .search-wrap .search-input input{width:90%;height:100%;font-size:28rpx;padding-left:20rpx;}
    .search-header .search-wrap .search-btn{width:50rpx;height:50rpx;background-image:url("~@/static/images/main/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:20rpx;}
    .search-title{width:100%;height:100rpx;display:flex;position: relative;z-index:1;align-items: center;margin-top:0rpx;box-sizing: border-box;padding:0 20rpx;}
    /*#ifdef MP-WEIXIN*/
    .search-title.wechat{margin-top:40rpx;}
    .search-title.wechat.ipx{margin-top:80rpx;}
    /*#endif*/
    .search-title .title{width:auto;position: absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%);text-align: center;font-size:36rpx;}

    .search-main{width:100%;}
    .search-main .search-area{width:93%;margin:0 auto;}
    .search-main .search-area .search-name-wrap{width:100%;display:flex;justify-content: space-between;margin-top:20rpx;}
    .search-main .search-area .bin{width:40rpx;height:40rpx;background-image:url("~@/static/images/main/bin.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-main .search-area .search-name{font-size:28rpx;}
    .search-main .search-area .search-kwords{width:100%;display: flex;flex-wrap: wrap;margin-top:20rpx;}
    .search-main .search-area .search-kwords .kwords{width:170rpx;height:64rpx;background-color:#FFFFFF;border:1px solid #EFEFEF;border-radius: 20px;font-size:28rpx;color:#717376;text-align:center;line-height:64rpx;white-space: nowrap;overflow:hidden;text-overflow: ellipsis;padding:0 20rpx;margin:0 8rpx;margin-bottom:20rpx;}
</style>