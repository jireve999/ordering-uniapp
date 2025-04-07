<template>
    <view class="page">
        <view class="main">
            <view class="goods-main" v-for="(item,index) in mealData" :key="index">
                <view class="nav">
                    <view class="icon"></view>
                    <view class="title">{{item.title}} (可选1份)</view>
                </view>
                <view class="goods-wrap">
                    <view class="goods-list" v-for="(item2,index2) in item.goods" :key="index2" @click="selectGoods(index,index2)">
                        <view class="image">
                            <image :src="item2.image" alt=""></image>
                        </view>
                        <view class="text">{{item2.title}}</view>
                        <view class="price" v-if="item2.offset_price!=0">
                            {{item2.offset_price>0?'+'+item2.offset_price:item2.offset_price}} 元
                        </view>
                        <view :class="{elc:true, active:item2.active}"></view>
                    </view>
                </view>
            </view>
        </view>
        <view style="width:100%;height:120rpx;"></view>
        <view class="cart-main">
            <view class="total">小计：￥{{total}}</view>
            <view class="line"></view>
            <view class="cart" @click="addCart()">
                <view class="cart-icon"></view>
                <view class="text">加入购物车 ></view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
    import { defineComponent,computed } from 'vue';
    import {onLoad} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    export default defineComponent({
        name:'meal',
        setup(){
            let gid:string;//套餐的id
            let branch_shop_id:string;//分店的id
            let table_code:string;//桌号
            let mealItems:any [];//套餐里的菜品明细
            let simpleMealItems:any [];//套餐里的菜品的gid，用于添加购物车时判断是否有相同的套餐
            let store=useStore();//启用Vuex
            let mealData:any=computed(()=>store.state.meal.mealData);//可替换菜品的数据
            let mealTitle:any=computed(()=>store.state.meal.title);//套餐名称
            let isSubmit:boolean=true;
            onLoad((opts:any)=>{
                gid=opts.gid;//套餐的id
                branch_shop_id=opts.branch_shop_id;
                table_code=opts.table_code;
                mealItems=[];
                simpleMealItems=[];
                //获取可替换菜品的数据
                store.dispatch("meal/getMeal",{gid:gid,branch_shop_id:branch_shop_id,success:()=>{
                    //设置套餐里菜品明细数据
                    setMealItems();
                }});
                //获取套餐详情
                store.dispatch("meal/getMealDetails",{gid:gid,branch_shop_id:branch_shop_id,success:()=>{
                    //设置导航栏标题名称
                    uni.setNavigationBarTitle({ title:mealTitle.value})
                }});
            })
            //重新组装mealItems套餐菜品明细字段数据
            let setMealItems:Function=()=>{
                let tmpMealItems:any []=[];
                if(mealData.value.length>0){
                    for(let i=0;i<mealData.value.length;i++){
                        for(let j=0;j<mealData.value[i].goods.length;j++){
                            //如果选择了菜品
                            if(mealData.value[i].goods[j].active){
                                //组装套餐菜品明细字段数据
                                /*
                                gid:菜品的gid
                                title:菜品标题
                                price:菜品价格
                                pack_price:包装费
                                dis_amount:初始化数量，购物车里不可更改的数量
                                 */
                                 tmpMealItems.push({gid:mealData.value[i].goods[j].gid,title:mealData.value[i].goods[j].title,price:mealData.value[i].goods[j].meal_price,amount:1,pack_price:mealData.value[i].goods[j].pack_price,dis_amount:1});
                            }
                        }
                    }
                    //计算数量
                    if(tmpMealItems.length>0){
                        let miObj:object={};
                        let newMealItems:any []=[];//套餐里菜品明细
                        let tmpSimpleMealItems:any []=[];//套餐里菜品的gid
                        for(let i=0;i<tmpMealItems.length;i++){
                            if(!miObj[tmpMealItems[i]["gid"]]){//如果没有重复的菜品
                                miObj[tmpMealItems[i]["gid"]]=true;
                                newMealItems.push({gid:tmpMealItems[i]["gid"],title:tmpMealItems[i]["title"],price:tmpMealItems[i]["price"],amount:tmpMealItems[i]["amount"],pack_price:tmpMealItems[i]['pack_price'],dis_amount:tmpMealItems[i]["dis_amount"]});
                                tmpSimpleMealItems.push({gid:tmpMealItems[i]["gid"]})
                            }else{//如果有重复的菜品
                                if(newMealItems.length>0){
                                    for(let j=0;j<newMealItems.length;j++){
                                        //如果套餐里的默认菜品与选择的菜品相同
                                        if(newMealItems[j]["gid"]==tmpMealItems[i]["gid"]){
                                            //数量加1
                                            newMealItems[j]["amount"]=++newMealItems[j]["amount"];
                                            //设置购物车里不可更改的数量
                                            newMealItems[j]["dis_amount"]=newMealItems[j]["amount"];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        mealItems=newMealItems;//将组装好的套餐菜品明细赋值给全局变量mealItems
                        simpleMealItems=tmpSimpleMealItems;//将组装好的菜品的gid赋值给全局变量simpleMealItems
                    }
                }
            }
            //计算选择菜品的金额
            let total:any=computed(()=>{
                let tmpTotal=0;
                if(mealData.value.length>0){
                    for(let i=0;i<mealData.value.length;i++){
                        for(let j=0;j<mealData.value[i].goods.length;j++){
                            if(mealData.value[i].goods[j].active){
                                tmpTotal+=parseFloat(mealData.value[i].goods[j].meal_price);
                            }
                        }
                    }
                    tmpTotal=parseFloat(tmpTotal.toFixed(2));
                }
                return tmpTotal;
            })
            //选择菜品
            let selectGoods:Function=(index:number,index2:number)=>{
                for(let i=0;i<mealData.value[index].goods.length;i++){
                    if(mealData.value[index].goods[i].active){
                        mealData.value[index].goods[i].active=false;
                        break;
                    }
                }
                mealData.value[index].goods[index2].active=true;
                setMealItems();
            }
            //加入购物车
            let addCart:Function=()=>{
                if(isSubmit){
                    isSubmit=false;
                    let cartData:any={
                        "title":mealTitle.value,//菜品标题
                        "branch_shop_id":branch_shop_id,//分店的id
                        "table_code":table_code,//桌号
                        "gid":gid,//菜品的唯一标识
                        "price":total.value,//套餐价格
                        "amount":1,//套餐数量
                        "is_meal":1,//是否套餐。1:是,0:否
                        "meal_type":1,//套餐类型。0:普通套餐，1:自定义套餐
                        "meal_items":mealItems,//套餐里菜品的明细
                        "new_meal_items":simpleMealItems,//套餐里菜品的gid明细
                        "isAmountInput":false,//是否显示数量input输入框
                        "isAmountInputFocus":false//数量input输入框获取焦点
                    };
                    //添加购物车
                    store.dispatch("cart/addCart",{cartData:cartData,success:()=>{
                        uni.showToast({
                            title: '加入购物车成功！',
                            icon:"success",
                            duration: 2000
                        });
                        setTimeout(()=>{
                            isSubmit=true;
                            uni.hideToast();//隐藏toast
                            uni.navigateBack({//返回上一页
                                delta: 1
                            });
                        },2000);
                    }});
                }
            }

           return{
            mealData,
            mealTitle,
            total,
            selectGoods,
            addCart
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;min-height:100%;margin:0 auto;background-color:#EFEFEF;}
    .page .main{width:95%;height:auto;background-color:#FFFFFF;margin:0 auto;margin-top:30rpx;border-radius: 6px;box-shadow: 3px 3px 5px #e7e7e7;overflow:hidden;}
    .page .goods-main{width:90%;margin:0 auto;margin-top:20rpx;margin-bottom:20rpx;}
    .page .main .nav{width:100%;height:70rpx;display: flex;align-items: center;box-sizing: border-box;border-bottom:1px solid #EFEFEF;margin:0 auto;}
    .page .main .nav .icon{width:20rpx;height:45rpx;background-color:#f6ab00;border-radius: 20px;margin-right:20rpx;}
    .page .main .nav .title{font-size:28rpx;color:#333333;font-weight: bold;}
    .page .main .goods-wrap{width:100%;display:flex;flex-wrap:wrap;}
    .page .main .goods-list{width:200rpx;height:317rpx;box-shadow: 0px 3px 5px #e7e7e7;border-radius: 6px;margin-top:30rpx;margin-left:1%;margin-right:1%;position: relative;}
    .page .main .goods-list .image{width:160rpx;height:160rpx;margin:0 auto;margin-top:20rpx;}
    .page .main .goods-list .image image{width:100%;height:100%;border-radius: 6px;}
    .page .main .goods-list .text{width:160rpx;font-size:24rpx;text-align: center;white-space: nowrap;color:#333333;overflow:hidden;text-overflow: ellipsis;margin:0 auto;margin-top:20rpx;}
    .page .main .goods-list .price{text-align:center;font-size:24rpx;color:#ff0000;margin-top:5rpx;}
    .page .main .goods-list .elc{width:50rpx;height:50rpx;border-radius: 100%;border:2px solid #EFEFEF;position: absolute;right:0px;top:0px;background-color:#FFFFFF;}
    .page .main .goods-list .elc.active{background-image:url("~@/static/images/goods/right.png");background-size:100%;background-repeat: no-repeat;background-position: center;}

    .cart-main{width:100%;height:100rpx;background-color:#f6ab00;position: fixed;z-index:90;left:0px;bottom:0px;display:flex;align-items: center;padding:0px 20rpx;box-sizing: border-box;}
    .cart-main .total{font-size:28rpx;color:#FFFFFF;width:408rpx;}
    .cart-main .line{width:2px;height:60rpx;background-color:rgba(255,255,255,0.4);margin-right:37rpx;}
    .cart-main .cart{width:auto;height:auto;display:flex;align-items: center;}
    .cart-main .cart .cart-icon{width:60rpx;height:60rpx;background-image:url("~@/static/images/goods/cart2.png");background-size:100%;background-position:center;background-repeat: no-repeat;margin-right:25rpx;}
    .cart-main .cart .text{font-size:28rpx;color:#FFFFFF;}
</style>