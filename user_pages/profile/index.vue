<template>
    <view class="page">
        <view class="head-wrap">
            <view class="text">头像</view>
            <view class="head" @click="handleHead"><image :src="showHead"></image></view>
        </view>
        <view class="list">
            <view class="text">昵称</view>
            <view class="input-wrap">
                <input type="text" class="input" v-model="nickname" placeholder="请输入昵称" />
            </view>
        </view>
        <view class="list">
            <view class="text">姓名</view>
            <view class="input-wrap">
                <input type="text" class="input" v-model="name" placeholder="请输入姓名" />
            </view>
        </view>
        <view class="list" @click="selectGender">
            <view class="text">性别</view>
            <view class="input-wrap">
                <view class="text-tip">{{gender=="1"?'男':gender=='2'?'女':'请选择'}}</view>
                <view class="arrow"></view>
            </view>
        </view>
        <button type="button" @click="submit()" class="submit-btn">保存</button>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,getCurrentInstance,computed } from 'vue';
    import {onLoad} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    export default defineComponent({
        name:'profile',
        setup(){
            let nickname=ref("");//昵称
            let gender=ref("");//性别，值：1:男，2:女
            let name=ref("");//姓名
            let showHead=ref("../../static/images/user/head.png");//在视图中显示的头像图片的地址
            let head=ref("");//保存到数据库的头像图片名称
            let branch_shop_id:string="";//分店的ID
            let table_code:string="";//桌号
            let isSubmit:boolean=false;//防止网络延迟重复修改资料
            let store=useStore();
            let utils:any=getCurrentInstance().proxy.$utils;//获取全局属性utils
            let uid=computed(()=>store.state.user.uid);//会员的编号
            let token=computed(()=>store.state.user.token)//会员登录时的token
            let platform=computed(()=>store.state.system.platform)//会员登录的平台类型，值：1:微信小程序，2：微信公众号
            onLoad((opts:any)=>{
                branch_shop_id=opts.branch_shop_id?opts.branch_shop_id:"";
                table_code=opts.table_code?opts.table_code:"";
                //验证会员是否合法登录
                utils.safeUser(store,branch_shop_id,table_code,()=>{
                    //如果合法，从服务端获取已付款订单数据
                    isSubmit=true;
                    //获取用户信息
                    store.dispatch("user/getUserInfo",{branch_shop_id:branch_shop_id,success:(data:any)=>{
                        nickname.value=data.nickname;//昵称
                        gender.value=data.gender;//性别
                        name.value=data.name;//姓名
                        showHead.value=data.head;//头像
                    }});
                });
            })
            //选择性别
            let selectGender:Function=()=>{
                uni.showActionSheet({
                    itemList: ['男', '女'],
                    success:  (res:any)=> {
                        gender.value=res.tapIndex+1;//性别，值：1:男，2:女
                    },
                    fail: (res:any)=> {
                        // console.log(res.errMsg);
                    }
                });
            }
            //头像操作
            let handleHead:Function=()=>{
                uni.showActionSheet({
                    itemList: ['拍照','从相册选择' ],
                    success:  (res:any)=> {
                        let sourceType=[];
                        let index=res.tapIndex;
                        if(index==0){//拍照
                            sourceType=["camera"];
                        }else if(index==1){//从相册选择
                            sourceType=["album"];
                        }
                        //选择图片
                        uni.chooseImage({
                            count: 1, //默认9
                            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
                            sourceType: sourceType, //从相册选择
                            success: (res:any)=> {
                                let tmpFilePath=res.tempFilePaths[0];
                                showHead.value=tmpFilePath;
                                //上传图片
                                uni.uploadFile({
                                    url: 'https://diancan.glbuys.com/api/v1/user/uploadhead', //上传图片接口地址
                                    filePath: tmpFilePath,//文件
                                    name: 'head',//服务端接口字段名称
                                    formData:{//数据参数
                                        uid:uid.value,
                                        token:token.value,
                                        platform:platform.value
                                    },
                                    //上传成功
                                    success: (uploadFileRes:any) => {
                                        let res=JSON.parse(uploadFileRes.data);
                                        //文件名称
                                        head.value=res.data.msbox;
                                    },
                                    fail:(uploadFileRes:any)=>{
                                       // console.log(uploadFileRes);
                                    }
                                });
                            }
                        });
                    },
                    fail: (res)=> {
                        // console.log(res.errMsg);
                    }
                });
            }
            //提交保存
            let submit:Function=()=>{
                if(isSubmit){
                    if(nickname.value.match(/^\s*$/)){
                        uni.showToast({
                            title: '请输入昵称',
                            icon:"none",
                            duration: 2000
                        });
                        return;
                    }
                    if(name.value.match(/^\s*$/)){
                        uni.showToast({
                            title: '请输入姓名',
                            icon:"none",
                            duration: 2000
                        });
                        return;
                    }
                    isSubmit=false;
                    //修改用户信息保存到数据库
                    store.dispatch("user/updateUser",{branch_shop_id:branch_shop_id,name:name.value,nickname:nickname.value,gender:gender.value,head:head.value,success:()=>{
                            uni.showToast({
                                title: '修改成功',
                                icon:"none",
                                duration: 2000
                            });
                            setTimeout(()=>{
                                uni.navigateBack({
                                    delta: 1
                                });
                            },2000)
                        }});
                }
            }

           return{
            nickname,
            gender,
            name,
            showHead,
            selectGender,
            handleHead,
            submit
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow:hidden;background-color:#FFFFFF;}
    .head-wrap{width:100%;height:120rpx;border-bottom: 1px solid #EFEFEF;display:flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding:0px 30rpx;}
    .head-wrap .text,.list .text{font-size:28rpx;color:#333333;}
    .head-wrap .head{width:100rpx;height:100rpx;}
    .head-wrap .head image{width:100%;height:100%;border-radius: 100%;}
    .list{width:100%;height:80rpx;border-bottom: 1px solid #EFEFEF;display:flex;justify-content: space-between;align-items: center;box-sizing: border-box;padding:0px 30rpx;}
    .list .input-wrap{width:auto;height:100%;display:flex;align-items: center;}
    .list .input-wrap .input{width:380rpx;height:66rpx;font-size:28rpx;text-align:right;}
    .list .arrow{width:40rpx;height:40rpx;background-image: url("~@/static/images/user/right_arrow.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-left:20rpx;}
    .list .text-tip{font-size:28rpx;color:#333333;}
    .submit-btn{width:200rpx;height:60rpx;margin:0 auto;background-color:#E30019;color:#FFFFFF;font-size:28rpx;margin-top:40rpx;line-height:60rpx;border-radius: 4px;}
</style>