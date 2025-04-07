<template>
    <view class="goods-area" v-show="isShow">
        <view class="goods-main">
            <!--菜品分类-->
            <scroll-view id="classify" scroll-with-animation="true" scroll-y="true" :scroll-top="classifyScrollTop" class="classify">
                <view :class="{item:true, active:item.active}" v-for="(item,index) in classifys" :key="item.cid" @click="clickClassify(index)">
                    <view>{{item.title}}</view>
                </view>
                <view style="height:170rpx;"></view>
            </scroll-view>
            <!--菜品展示-->
            <scroll-view scroll-y="true" id="goods-wrap" class="goods-wrap" scroll-with-animation="true" :scroll-top="goodsScrollTop" @scroll="eventGoodsScroll">
                <view class="goods-classify">
                    <block v-for="(item,index) in goods" :key="item.cid">
                        <view class="goods-classify-wrap">
                            <view class="classify-name" :style="{position:item.position,left:item.left+'px',top:item.top+'px',zIndex:10}">{{item.title}}</view>
                            <view class="goods-list-wrap">
                                <view class="goods-list" v-for="(item2,index2) in item.goods" :key="item2.gid" @click="showGoodsDetails(item2.gid,item2.is_meal,item2.amount,item2.sell_status,item2.stock)">
                                    <view class="image"><image :lazy-load="true" :src="item2.image"></image></view>
                                    <view class="goods-info">
                                        <view class="goods-title">{{item2.title}}</view>
                                        <view class="sales">销量：{{item2.sales}}</view>
                                        <!--如果是套餐-->
                                        <view class="meal" v-if="item2.is_meal=='1'">
                                            <view class="price">￥15</view>
                                            <view class="meal-buy">购买</view>
                                        </view>
                                        <!--如果非套餐-->
                                        <view class="price-wrap" v-else>
                                            <view class="price">￥{{item2.price}}</view>
                                            <view class="amount">
                                                <!--如果没有库存-->
                                                <template v-if="item2.stock<=0">
                                                    <view class="handle-amount">
                                                        <text>已售光</text>
                                                    </view>
                                                </template>
                                                <!--
                                                如果菜品售卖在全部时间段
                                                -->
                                                <template v-else-if="item2.sell_time_type=='0'">
                                                    <view class="handle-amount">
                                                        <!--如果数量大于0，显示减号-->
                                                        <view class="dec" v-if="item2.amount>0" @click.stop="decAmount($event,item2.gid,item2.new_meal_items,item2.meal_items)"></view>
                                                        <!--
                                                        为了防止scroll-view组件内使用input卡顿的问题，先使用view组件显示数量，单击该组件，显示input输入框，并隐藏view组件，输入完成后使用@blur事件，隐藏input组件，显示view组件
                                                        -->
                                                        <view class="text" v-if="!item2.isAmountInput && item2.amount>0" @click.stop="showAmountInput(index,index2)">{{item2.amount}}</view><input v-if="item2.isAmountInput" :value="item2.amount" :focus="item2.isAmountInputFocus" type="number" @click.stop="" @blur="setAmount($event,item2.gid,item2.new_meal_items,item2.meal_items,index,index2)" />
                                                        <view class="inc" @click.stop="incAmount($event,item2.gid,item2.new_meal_items,item2.meal_items)"></view>
                                                    </view>
                                                </template>
                                                <!--
                                                如果菜品售卖在自定义时间段
                                                -->
                                                <template v-else>
                                                    <!--在售卖期-->
                                                    <template v-if="item2.sell_status=='1'">
                                                        <view class="handle-amount">
                                                            <view class="dec" v-if="item2.amount>0" @click.stop="decAmount($event,item2.gid,item2.new_meal_items,item2.meal_items)"></view>
                                                            <view class="text" v-if="!item2.isAmountInput && item2.amount>0">{{item2.amount}}</view><input v-if="item2.isAmountInput" :focus="item2.isAmountInputFocus" :value="item2.amount" type="number" @click.stop="" @blur="setAmount($event,item2.gid,item2.new_meal_items,item2.meal_items,index,index2)" />
                                                            <view class="inc" @click.stop="incAmount($event,item2.gid,item2.new_meal_items,item2.meal_items)"></view>
                                                        </view>
                                                    </template>
                                                    <template v-else>
                                                        <text>非可售时间</text>
                                                    </template>
                                                </template>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </block>
                </view>
                <view style="width:100%;height:190rpx;"></view>
            </scroll-view>
        </view>
        <goods-details :show="isShowGoodsDetails" :branchShopId="branchShopId" :gid="gid" :amount="amount" @close="isShowGoodsDetails=false" @setAmount="setAmount" @decAmount="decAmount" @incAmount="incAmount"></goods-details>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,watch,getCurrentInstance } from 'vue';
    import {useStore} from "vuex";
    import GoodsDetails from './details';
    export default defineComponent({
        name:'goods-component',
        props:{
            //是否显示菜品组件
            isShow:{
                type:Boolean,
                default:true
            },
            //分店的id
            branchShopId:{
                type:String,
                default:""
            },
            //菜品分类数据
            classifysData:{
                type:Array,
                default: ()=>[]
            },
            //菜品展示
            goodsData:{
                type:Array,
                default:()=>[]
            },
            //菜品的gid
            gid:{
                type:String,
                default:""
            },
            //菜品数量
            amount:{
                type:Number,
                default:0
            },
            //是否有上架或下架的菜品
            shelfGoods:{
                type:Boolean,
                default:false
            }
        },
        components:{
            GoodsDetails
        },
        setup(props:any,conText:any){
            const instance=getCurrentInstance();//获取组件实例
            let store=useStore();//启用Vuex
            let goodsScrollTop:any=ref(0);//视图中id值为"goods-wrap"的scroll-view组件属性scroll-top的值
            let classifyScrollTop:any=ref(0);//视图中id值为"classify"的scroll-view组件属性scroll-top的值
            let isShowGoodsDetails:any=ref(false);//是否显示商品详情
            let classifys:any=ref([]);//左侧分类数据
            let goods:any=ref([]);//菜品数据
            let goodsWrapTop:number=0;//视图中id值为"goods-wrap"的scroll-view组件的top值
            let goodsWrapLeft:number=0;//视图中id值为"goods-wrap"的scroll-view组件的left值
            let goodsWrapHeight:number=0;//视图中id值为"goods-wrap"的scroll-view组件的高
            let tempGoodsScrollTop:number=0;//记录滚动的位置，解决点击分类之后向上滑动，再次点击不滚动的bug
            let goodsObj:object={};//存放菜品的id属性和值
            let firstWatchGoods:boolean=true;//第一次监听watch的goodsData发生变化
            //如果父组件的goodsData有菜品直接赋值给goods
            if(props.goodsData && props.goodsData.length>0){
                goods.value=props.goodsData;
            }
            //如果父组件的classifysData有菜品分类直接赋值给classifys
            if(props.classifysData && props.classifysData.length>0){
                classifys.value=props.classifysData;
            }
            //监听props菜品分类数据变化
            watch(()=>props.classifysData,(newVal:any [],oldVal:any [])=>{
                classifys.value=newVal;//将菜品分类数据赋值给data方法内部的classifys属性 
            })
            //监听props菜品数据变化
            watch(()=>props.goodsData,(newVal:any [],oldVal:any [])=>{
                goods.value=newVal;//将菜品的数据赋值给data方法内部的goods属性 
            })
            //监听上架或下架的菜品
            watch(()=>props.shelfGoods,(newVal:boolean,oldVal:boolean)=>{
                if(newVal==true){//如果有上架或下架的菜品
                    //将this.goodsScrollTop和this.classifyScrollTop的值设置为0可以解决，更新上架或下架菜品数据后，从微信的发现栏进入小程序，scroll-view无法滚动到顶部的问题
                    goodsScrollTop.value=0;
                    classifyScrollTop.value=0;
                }
            })
            //监听ref菜品数据的变化
            watch(goods,(newVal:any [],oldVal:any [])=>{
                if(firstWatchGoods){
                    firstWatchGoods=false;//只允许第一次监听goodsData数据发生变化定位菜品的位置，比如后面加入购物车时更改菜品的数量，不再执行菜品定位this.getGoodsPosition()方法，避免造成定位错误
                    getGoodsPosition();//获取菜品的位置
                } 
            })
            //监听ref菜品分类数据的变化
            watch(classifys,(newVal:any [],oldVal:any [])=>{
                //获取菜品分类的位置
                getClassifyPosition();
            })
            //获取菜品分类的位置
            let getClassifyPosition:Function=()=>{
                let classify:any=uni.createSelectorQuery().in(instance).select("#classify");
                classify.boundingClientRect((data:any)=>{
                    let classifyTop=data.top;//获取视图中id为"classify"的组件top值
                    let classifysInst:any=uni.createSelectorQuery().in(instance).selectAll("#classify .item");
                    classifysInst.boundingClientRect((data:any)=>{
                        if(data.length>0){
                            for(let i=0;i<data.length;i++){
                                //计算视图中class为"item"的组件top
                                classifys.value[i].top=data[i].top-classifyTop;
                            }
                        }
                    }).exec();
                }).exec();
            }
            //获取菜品的位置
            let getGoodsPosition:Function=()=>{
                //获取商品最外面的元素高
                let goodsWrap=uni.createSelectorQuery().in(instance).select("#goods-wrap");
                goodsWrap.boundingClientRect((data:any)=>{
                    goodsWrapTop=data.top-1;//视图中id为"goods-wrap"组件的top值
                    goodsWrapLeft=data.left;//视图中id为"goods-wrap"组件的left值
                    goodsWrapHeight=data.height;//视图中id为"goods-wrap"组件的高
                    let classifyName = uni.createSelectorQuery().in(instance).selectAll(".goods-classify-wrap");
                    classifyName.boundingClientRect((data:any)=>{
                        let goodsTop=0;
                        if(data.length>0){
                            for(let i=0;i<data.length;i++){
                                //计算class为goods-classify-wrap的组件距id为goods-wrap的组件top值
                                goodsTop=data[i].top-goodsWrapTop;
                                goods.value[i].top=goodsTop;
                                classifys.value[i].goodsTop=goodsTop;//视图中class为"goods-classify-wrap"组件的top值
                                classifys.value[i].goodsHeight=data[i].height;//视图中class为"goods-classify-wrap"组件的高
                            }
                        }

                        let goodsItems=uni.createSelectorQuery().in(instance).selectAll(".goods-list");
                        goodsItems.boundingClientRect((data:any)=>{
                            if(data.length>0){
                                let itemIndex=0;
                                for(let i=0;i<goods.value.length;i++){
                                    for(let j=0;j<goods.value[i].goods.length;j++){
                                        //视图中class为"goods-list"组件的top值
                                        goods.value[i].goods[j].itemTop=data[itemIndex].top;
                                        itemIndex++;
                                        let gid=goods.value[i].goods[j].gid;
                                        //将菜品的gid和值存放到this.goodsObj中，目的为了从菜品搜索页面进入点餐页面的菜品定位
                                        goodsObj[gid]=goods.value[i].goods[j];
                                    }
                                }
                                //定位某个菜品的位置
                                setItemPosition();
                            }
                        }).exec();
                    }).exec();
                }).exec();
            }
            //定位某个菜品的位置
            let setItemPosition:Function=()=>{
                //如果路由参数中存在gid，比如从菜品搜索页面进入
                if(props.gid && goods.value.length>0){
                    let itemTop=goodsObj[props.gid].itemTop;//获取视图中class为"goods-list"组件的top值
                    //延迟可以解决scroll-view有时出现不滚动的bug
                    setTimeout(()=>{
                       goodsScrollTop.value=itemTop-goodsWrapTop*1.2;
                    },600)
                }
            }
            //监听视图中id值为"goods-wrap"的scroll-view组件scroll事件
            let eventGoodsScroll:Function=(e:any)=>{
                if(classifys.value.length>0){
                    //记录滚动的位置，解决点击分类之后向上滑动，再次点击不滚动的bug
                    tempGoodsScrollTop=e.detail.scrollTop;
                    for(let i=0;i<classifys.value.length;i++){
                        //判断是否滚动到相应的菜品分类
                        if(e.detail.scrollTop>=classifys.value[i].goodsTop-90 && e.detail.scrollTop<=classifys.value[i].goodsTop+classifys.value[i].goodsHeight){
                            //视图中的class的值为"item"的组件，如果存在active类样式删除"active"
                            for(let key in classifys.value){
                                if(classifys.value[key].active){
                                    classifys.value[key].active=false;
                                    break;
                                }
                            }
                            //如果滚动到底部
                            //由于parseInt第一个参数必须是string类型，所以在ts中必须用toString将number类型转成string数据类型
                            let offsetScroll:number=parseInt((e.detail.scrollTop/e.detail.scrollHeight*100).toString());
                            if(offsetScroll>=88){
                                //视图中的class的值为"item"的组件，添加active类样式
                                classifys.value[classifys.value.length-1].active=true;
                            }else {//如果没有到底部
                                //视图中的class的值为"item"的组件，添加active类样式
                                classifys.value[i].active = true;
                            }
                            //菜品分类滚动到相应的菜品位置
                            classifyScrollTop.value=classifys.value[i].top;

                            if(goods.value && goods.value.length>0){
                                for(let key in goods.value){
                                    //如果菜品的标题是固定定位，更改成静态定位
                                    if(goods.value[key].position=='fixed'){
                                        goods.value[key].position="static";
                                        goods.value[key].top=0;
                                        goods.value[key].left=0
                                        //将更改的属性值同步到Vuex中，解决加入购物车时定位错误问题
                                        store.commit("goods/SET_GOODS_POISTION",{index:key,position:"static",top:0,left:0});
                                            break;
                                    }
                                }
                                //将菜品的标题设置成为固定定位
                                goods.value[i].position="fixed";
                                goods.value[i].top=goodsWrapTop;
                                goods.value[i].left=goodsWrapLeft;
                                //将更改的属性值同步到Vuex中，解决加入购物车时定位错误问题
                                store.commit("goods/SET_GOODS_POISTION",{index:i,position:"fixed",top:goodsWrapTop,left:goodsWrapLeft});
                            }
                        }
                    }

                    //如果到顶部清除所有固定定位
                    if(e.detail.scrollTop<=100){
                        if(goods.value && goods.value.length>0) {
                            for (let key in goods.value) {
                                //如果菜品的标题是固定定位，更改成静态定位
                                if (goods.value[key].position == 'fixed') {
                                    goods.value[key].position = "static";
                                    goods.value[key].top = 0;
                                    goods.value[key].left = 0;
                                    //将更改的属性值同步到Vuex中，解决加入购物车时定位错误问题
                                     store.commit("goods/SET_GOODS_POISTION",{index:key,position:"static",top:0,left:0});
                                    break;
                                }
                            }
                        }
                    }
                };
            }
            //点击左侧分类
            let clickClassify:Function=(index:number)=>{
                if(classifys.value.length>0){
                    for(let i=0;i<classifys.value.length;i++){
                        //视图中的class的值为"item"的组件，如果存在active类样式删除"active"
                        if(classifys.value[i].active){
                            classifys.value[i].active=false;
                            break;
                        }
                    }
                    //视图中的class的值为"item"的组件，添加active类样式
                    classifys.value[index].active=true;
                    if(index==0){
                        goodsScrollTop=0;
                    }else {
                        //解决点击分类之后向上滑动，再次点击不滚动的bug
                        goodsScrollTop.value=tempGoodsScrollTop;
                        //使用延迟，解决视图中id为"goods-wrap"，有时不滚动的bug
                        setTimeout(()=>{
                            goodsScrollTop.value=classifys.value[index].goodsTop-40;
                        },50);
                    }
                }
            }
            //显示数量输入框
            let showAmountInput:Function=(index:number,index2:number)=>{
               //执行pages/goods/index.vue文件中的showAmountInput方法
                conText.emit("showAmountInput",index,index2);
            }
            //修改数量
            //gid:菜品的id
            //new_meal_items:套餐规格，用于判断购物车是否有相同的菜品
            //meal_items:完整套餐规格，用于显示套餐里面的菜品明细
            let setAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string,index:number,index2:number)=>{
            //执行pages/goods/index.vue文件中的setAmount方法
                conText.emit("setAmount",e,gid,new_meal_items,meal_items,index,index2);
            }
            //显示商品详情
            //gid:菜品的id
            //isMeal:是否套餐
            //amount:菜品数量
            //sell_status:售卖状态,1：售卖期，0：非售卖时间
            //stock:库存
            let showGoodsDetails:Function=(gid:string,isMeal:string,amount:number,sell_status:string,stock:number)=>{
//如果在售卖期并且有库存
                if(sell_status=='1' && stock>0){
                    if(isMeal!='1'){//如果不是套餐
                        isShowGoodsDetails.value=true;//显示菜品详情组件
                    }
                    //执行pages/goods/index.vue文件中的showGoodsDetails方法
                    conText.emit("showGoodsDetails",gid,isMeal,amount,sell_status,stock);
                }
            }

            //添加菜品数量
            let incAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                //触发pages/goods/index.vue文件中的incAmount方法
                conText.emit("incAmount",e,gid,new_meal_items,meal_items)
            }
            //减少菜品数量
            let decAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                //触发pages/goods/index.vue文件中的decAmount方法
                conText.emit("decAmount",e,gid,new_meal_items,meal_items)
            }
           return{
            goodsScrollTop,
            classifyScrollTop,
            isShowGoodsDetails,
            classifys,
            goods,
            eventGoodsScroll,
            clickClassify,
            showAmountInput,
            setAmount,
            showGoodsDetails,
            incAmount,
            decAmount
           }
        }
    })
</script>

<style scoped>
    .goods-area{width:100%;}
    .goods-main{width:100%;height:70vh;overflow:hidden;display:flex;justify-content: space-between;}
    .goods-main .classify{height:90%;width:156rpx;background-color:#fafafa;}
    .goods-main .classify .item{width:100%;height:72rpx;overflow:hidden;margin-bottom:40rpx;position: relative;z-index:1;}
    .goods-main .classify .item view{width:80%;font-size:28rpx;color:#999999;position:absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%)}
    .goods-main .classify .item.active{background-color:#FFFFFF;}
    .goods-main .classify .item.active view{color:#333333}

    .goods-main .goods-wrap{width:76%;height:90%;}
    .goods-main .goods-classify{width:100%;}
    .goods-main .goods-classify .classify-name{width:100%;height:auto;font-size:28rpx;color:#333333;font-weight: bold;background-color:#FFFFFF;}
    .goods-main .goods-list-wrap{width:100%;height:auto;margin-bottom:20rpx;}
    .goods-main .goods-list-wrap .goods-list{width:100%;height:auto;display:flex;justify-content: space-between;margin-top:40rpx;align-items: center}
    .goods-main .goods-list-wrap .goods-list .image{width:180rpx;height:180rpx;border-radius: 6px;}
    .goods-main .goods-list-wrap .goods-list .image image{width:100%;height:100%;border-radius: 6px;}
    .goods-main .goods-list .goods-info{width:62%;height:auto;margin-right:20rpx;}
    .goods-main .goods-list .goods-title{width:100%;height:80rpx;overflow:hidden;font-size:28rpx;color:#333333;font-weight: bold;}
    .goods-main .goods-list .sales{font-size:24rpx;color:#999999;margin-top:10rpx;}
    .goods-main .goods-list .points{font-size:24rpx;color:#D6001C;margin-top:10rpx;}
    .goods-main .goods-list .price{font-size:28rpx;color:#fb4e44;font-weight: bold;}
    .goods-main .goods-list .price-wrap{width:100%;margin-top:10rpx;display:flex;justify-content: space-between;}
    .goods-main .goods-list .meal{width:100%;margin-top:10rpx;display:flex;justify-content:space-between;}
    .goods-main .goods-list .meal .meal-buy{width:110rpx;height:50rpx;background-color:#D6001C;color:#FFFFFF;text-align:center;line-height:50rpx;font-size:28rpx;border-radius: 4px;}
    .goods-main .goods-list .amount{width:auto;height:auto;display:flex;}
    .goods-main .goods-list .amount text{font-size:24rpx;color:#999999;}
    .goods-main .goods-list .handle-amount{width:auto;height:60rpx;display:flex;align-items: center;justify-content:flex-end}
    .goods-main .goods-list .handle-amount .dec{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/dec.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .goods-main .goods-list .handle-amount .inc{width:55rpx;height:55rpx;background-image:url("~@/static/images/main/inc.png");background-size:100%;background-position: center;background-repeat: no-repeat;}
    .goods-main .goods-list .handle-amount .text{font-size:28rpx;color:#333333;margin-right:10rpx;margin-left:10rpx;width:50rpx;text-align: center;}
    .goods-main .goods-list .start-sell{width:100%;height:auto;font-size:24rpx;color:#999999;}
    .goods-main .goods-list .handle-amount input{width:50rpx;height:100%;text-align: center;margin-right:10rpx;margin-left:10rpx;}
</style>