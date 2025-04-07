<template>
    <view class="page">
        <web-view :webview-styles="webviewStyles" src="https://mp.weixin.qq.com/s?__biz=MzI0NDcxNzM4MQ==&mid=2247483659&idx=1&sn=33532f3d353ff99e41e938637a937735&chksm=e958c321de2f4a3750e2c4c0082bc23db97ef72a935fd8724d525882393b737db2b6cab751a8&mpshare=1&scene=23&srcid&sharer_sharetime=1579340139968&sharer_shareid=01f30d86ddfab21e70c219e68b047155%23rd"></web-view>
    </view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    //定义变量webviewStyles数据类型接口
    interface IWebviewStyles{
        progress:{
            color:string
        }
    }
    export default defineComponent({
        name:'focus',
        setup(){
            let webviewStyles:IWebviewStyles= {
                    progress: {
                        color: "#43A243"
                    }
                }
           return{
            webviewStyles
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow:hidden;}
</style>