<template>
    <view class="page">
        <view class="status_bar">
            <view class="bar-bg"></view>
        </view>
        <view :class="{header:true,ipx:false,official:true}">
            <view :class="{'mp-wrap':true,ipx:false}">
                <view class="mp-logo">
                    <image src="../../static/images/common/logo.jpg"></image>
                </view>
                <view class="info">
                    <view class="name">好运买点餐</view>
                    <view class="desc">关注公众号，下次可在公众号中"点餐"！</view>
                    <view class="focus" @click="pushPage('/pages/main/focus')">关注</view>
                </view>
            </view>
        </view>
        <view class="business-wrap">
            <view class="business-info">
                <view class="business-logo">
                    <image :src="shopInfo.logo"></image>
                </view>
                <view class="business-name">{{shopInfo.branch_shop_name}}</view>
                <view class="notice">{{shopInfo.notice}}</view>
                <view class="home" @click="replacePage('/pages/main/main')"></view>
            </view>
        </view>
        <view class="tags">
            <view class="item-wrap">
                <view :class="{item:true,active:goodsAction}" @click="changeTab(true,false)">点餐</view>
                <view :class="{item:true, active:businessAction}" @click="changeTab(false,true)">商家</view>
            </view>
            <view class="tags-handle">
                <view class="myorder" @click="goMyOrder()">
                    <view class="myorder-icon"></view>
                    <view class="text">订单</view>
                </view>
                <view class="line"></view>
                <view class="my" @click="pushPage('/pages/my/index?branch_shop_id='+branch_shop_id+'&table_code='+table_code+'')"></view>
            </view>
        </view>
        <!--菜品展示组件-->
        <goods :isShow="goodsAction" :branchShopId="branch_shop_id" :gid="gid" :amount="amount" @setAmount="setAmount" @showAmountInput="showAmountInput" :classifysData="classifys" :goodsData="goods" :shelfGoods="shelfGoods" @showGoodsDetails="showGoodsDetails" @incAmount="incAmount" @decAmount="decAmount"></goods>
        <!--商家信息组件-->
        <business-info :isShow="businessAction" :branchShopId="branch_shop_id" :infoData="shopInfo"></business-info>
        <!--只有在菜品展示组件显示的情况下，才显示购物车导航-->
        <view class="cart-main" v-show="goodsAction">
            <view class="handle-cart" @click="showCart()">
                <view class="cart-cle">
                    <view class="cart-cle-2">
                        <view class="cart-icon" id="cart-icon">
                            <view class="badge" v-show="cartCount>0">{{cartCount}}</view>
                        </view>
                    </view>
                </view>
                <view class="total">￥{{total}}</view>
            </view>
            <view class="line"></view>
            <view class="submit" @click="submitOrder()">
                <template v-if="cartCount>0">提交订单 &gt;</template>
                <template v-else>未选购商品</template>
            </view>
        </view>
        <cart :show="setIsCart" :cart-data="cartData"  @close="isCart=false" @incAmount="incAmount" @decAmount="decAmount" @setAmount="setAmount" @clearCart="clearCart()" :values="{branch_shop_id,table_code}"></cart>
    </view>
</template>

<script lang="ts">
    import { defineComponent,ref,computed,getCurrentInstance} from 'vue';
    import {onLoad,onShow} from "@dcloudio/uni-app";//导入uni-app
    import {useStore} from "vuex";
    import Goods from '../../components/goods';
    import BusinessInfo from '../../components/business/info';
    import Cart from '../../components/cart';
    //onLoad页面传过来的参数格式接口
    interface IOnLoadOpts{
        branch_shop_id:string,//分店的id数据类型为string
        table_code:string,//桌号数据类型为string
        gid:string//菜品的id数据类型为string
    }
    //由于变量branch_shop_id、table_code需要在onShareAppMessage函数内部使用，需要将其定义为全局变量不要写在setup函数内部
    let branch_shop_id:any=ref("");//分店的id
    let table_code:any=ref("");//桌号
    export default defineComponent({
        name:'goods',
        //分享此页面
        onShareAppMessage(res:any){
            if (res.from === 'menu') {
                return {
                    title: '好运买点餐',
                    path: '/pages/goods/index?branch_shop_id='+branch_shop_id.value+'&table_code='+table_code.value+''
                }
            }
        },
        components:{
            Goods,
            BusinessInfo,
            Cart
        },
        setup(){
            let goodsAction:any=ref(true);//是否显示菜品展示组件
            let businessAction:any=ref(false);//是否显示商家信息组件
            let gid:any=ref("");//菜品的id
            let amount:any=ref(0);//菜品数量
            let shelfGoods:any=ref(false);//是否有上架或下架的菜品
            let store=useStore();
            let goods:any=computed(()=>store.state.goods.goods);//菜品展示数据
            let classifys:any=computed(()=>store.state.goods.classifys);//菜品分类数据
            let shopInfo:any=computed(()=>store.state.business.shopInfo);//商家信息
            let isLogin:any=computed(()=>store.state.user.isLogin);//会员是否登录
            let cInstance:any=getCurrentInstance();//获取当前组件实例 
            let utils:any=cInstance.proxy.$utils;//获取全局属性utils
            let cartCount:any=computed(()=>store.state.cart.cartCount);//购物车里菜品的数量
            let total:any=computed(()=>store.getters["cart/total"]);//购物车里菜品的总价
            let isCart:any=ref(false);//是否显示购物车组件
            let cartData:any=computed(()=>store.state.cart.cartData);//购物车里的菜品
            let setIsCart:any=computed(()=>{
                    if(cartData.value.length>0){
                        return isCart.value;
                    }else{
                        isCart.value=false;//解决购物车里没有数据自动隐藏，再加上数据不显示的问题
                        return isCart.value;
                    }
                });
            onLoad((opts:IOnLoadOpts)=>{
                branch_shop_id.value=opts.branch_shop_id?opts.branch_shop_id:"";//分店的id
                table_code.value=opts.table_code?opts.table_code:"";//桌号
                gid.value=opts.gid?opts.gid:"";//菜品的id，从搜索菜品页面进入此页面会有gid
                //调用Vuex内部的分类方法
                store.dispatch("goods/getCalssifys",{branch_shop_id:branch_shop_id.value,success:()=>{
                    //要在这里调用显示菜品，解决异步获取dom的问题
                    store.dispatch("goods/getGoods",{branch_shop_id:branch_shop_id.value});
                }});
                //如果有桌号代表堂内点餐，如果没有桌号代表自提点餐
                store.commit("cart/SET_PACK",{isPack:!table_code.value?true:false});

            })

            onShow(()=>{
                //如果有菜品
                if(goods.value && goods.value.length>0){
                    //获取上架或下架的菜品
                    store.dispatch("goods/getNewGoods",{branch_shop_id:branch_shop_id.value,success:(data:any [])=>{
                        for (let i = 0; i < goods.value.length; i++) {
                            //是否有新上架或下架的菜品
                            if (goods.value[i].goods.length != data[i].goods.length) {
                               shelfGoods.value=true;//有上架或下架的菜品
                                //先清空vuex中的菜品数据，再重新获取菜品数据，解决scroll-view无法重新计算高度的问题
                                store.commit("goods/SET_GOODS",{goods:[]});//清空vuex中的菜品数据
                                //有新上架或下架的菜品重新获取数据
                                store.dispatch("goods/getGoods",{branch_shop_id:branch_shop_id.value});
                                break;
                            }
                        }
                    }})
                }
                //获取商家信息
                store.dispatch("business/showShopInfo",{branch_shop_id:branch_shop_id.value});
                //显示购物车里的菜品数据
                store.dispatch("cart/showCartData",{branch_shop_id:branch_shop_id.value});
            })

            //显示数量输入框
            let showAmountInput:Function=(index:number,index2:number)=>{
                store.commit("goods/SHOW_AMOUNT_INPUT",{index,index2});
            }
            //修改数量
            let setAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string,index:number,index2:number)=>{
                amount.value=parseInt(e.target.value);
                //设置菜品数量
                store.commit("goods/SET_AMOUNT",{amount:amount.value,gid:gid,new_meal_items:new_meal_items});
                //更新购物车里菜品的数量
                store.dispatch("cart/setAmount",{branch_shop_id:branch_shop_id.value,cartData:{amount:amount.value,gid:gid,meal_items:meal_items,new_meal_items:new_meal_items}});
                if(index!=undefined && index2!=undefined){
                    //隐藏输入框
                    store.commit("goods/HIDE_AMOUNT_INPUT",{index,index2});
                }
            }
            //打开新页面跳转
            let pushPage:Function=(url:string)=>{
                uni.navigateTo({
                    url:url
                })
            }
            //重定向跳转
            let replacePage:Function=(url:string)=>{
                uni.redirectTo({
                    url:url
                })
            }
            //菜品组件和商家信息组件切换显示
            let changeTab:Function=(goodsActionVal:boolean,businessActionVal:boolean)=>{
                goodsAction.value=goodsActionVal;
                businessAction.value=businessActionVal;
            }
            //显示商品详情
            let showGoodsDetails:Function=(gidVal:string,isMeal:string,amountVal:string,sell_status:string,stock:number)=>{
                    if(isMeal=='1'){//如果是套餐
                        //跳转到套餐页面
                        pushPage('/pages/goods/meal?gid='+gidVal+"&branch_shop_id="+branch_shop_id.value+"&table_code="+table_code.value);
                    }else{
                        gid.value=gidVal;//菜品的id
                        amount.value=parseInt(amountVal);//菜品数量
                    }
            }

            //添加菜品数量
            let incAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                //如果会员已登录
                if(isLogin.value){
                    //调用static/ts/utils/index.ts文件中的safeUser()方法，如果token验证成功
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                        let isGoodsSame:boolean=false;//是否还有相同的菜品
                        //套餐里菜品明细的gid，用于添加购物车时判断是否有相同的套餐
                        let curNewMealItems:string=new_meal_items && new_meal_items.length>0?JSON.stringify(new_meal_items):"";
                        for(let i:number=0;i<goods.value.length;i++){
                            for(let j:number=0;j<goods.value[i].goods.length;j++){
                                //默认套餐里菜品的gid
                                let newMealItems:string=goods.value[i].goods[j].new_meal_items.length>0?JSON.stringify(goods.value[i].goods[j].new_meal_items):"";
                                //如果有相同的菜品，这个的判断是为了增加amount数量
                                if(goods.value[i].goods[j].gid==gid && newMealItems==curNewMealItems){
                                    isGoodsSame=true;
                                    //增加菜品的数量，这里的数量会传递给菜品展示组件和菜品详情组件，这样数量就可以同步了
                                    amount.value=parseInt(goods.value[i].goods[j].amount)+1;

                                    //添加购物车的数据
                                    let cartData:any={
                                        "title":goods.value[i].goods[j].title,//菜品名称
                                        "branch_shop_id":branch_shop_id.value,//分店的id
                                        "table_code":table_code.value,//桌号
                                        "gid":gid,//菜品的唯一标识
                                        "price":goods.value[i].goods[j].price,//菜品价格
                                        "amount":1,//菜品数量默认为1，数量的改变在Vuex中写逻辑
                                        "is_meal":goods.value[i].goods[j].is_meal,//是否套餐，1：是，0：否
                                        "pack_price":goods.value[i].goods[j].pack_price?goods.value[i].goods[j].pack_price:0,//包装费
                                        "meal_type":0,//套餐类型。0:普通套餐，1:自定义套餐
                                        "meal_items":goods.value[i].goods[j].meal_items,//套餐里菜品的明细
                                        "new_meal_items":goods.value[i].goods[j].new_meal_items,//套餐里菜品的gid明细
                                        "isAmountInput":false,//是否显示数量input输入框
                                        "isAmountInputFocus":false//数量input输入框获取焦点
                                    };
                                    //添加购物车
                                    store.dispatch("cart/addCart",{cartData:cartData});
                                    break;
                                }
                            }
                        }
                        //如果没有相同的菜品，表示是自定义套餐
                        if(!isGoodsSame){
                            //自定义套餐数据
                            let cartData:any={
                                "branch_shop_id":branch_shop_id.value,//分店的id
                                "table_code":table_code.value,//桌号
                                "gid":gid,//套餐的唯一标识
                                "amount":1,//菜品数量默认为1，数量的改变在Vuex中写逻辑
                                "is_meal":1,//是否套餐，1：是，0：否
                                "meal_type":1,//套餐类型。0:普通套餐，1:自定义套餐
                                "meal_items":meal_items,//套餐里菜品的明细
                                "new_meal_items":new_meal_items,//套餐里菜品的gid明细
                                "isAmountInput":false,//是否显示数量input输入框
                                "isAmountInputFocus":false//数量input输入框获取焦点
                            };
                            //添加购物车
                            store.dispatch("cart/addCart",{cartData:cartData});
                        }
                    })
                }else{//如果会员未登录
                    //跳转到登录页面
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                }
            }
            //显示购物车
            let showCart:Function=()=>{
                if(isLogin.value){
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                        if(cartData.value.length>0){
                            isCart.value=true;//显示购物车组件
                        }
                    });
                }else{
                    //跳转到登录页面
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                }
            }
             //清空购物车
             let clearCart:Function=()=>{
                if(isLogin.value){
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                        if(goods.value.length>0){
                            //将菜品展示的数量设置为0
                            for(let i:number=0;i<goods.value.length;i++){
                                for(let j:number=0;j<goods.value[i].goods.length;j++){
                                    goods.value[i].goods[j].amount=0;
                                }
                            }
                            amount.value=0;
                        }
                        //清空数据库中的购物车数据
                        store.dispatch("cart/clearCart",{branch_shop_id:branch_shop_id.value,table_code:table_code.value});
                    });
                }else{
                     //跳转到登录页面
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                }
            }
            //减少购物车里的菜品数量
            let decAmount:Function=(e:any,gid:string,new_meal_items:string,meal_items:string)=>{
                if(isLogin.value){
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                            let curNewMealItems:string=new_meal_items && new_meal_items.length>0?JSON.stringify(new_meal_items):"";
                            if(goods.value.length>0){
                                    let isGoodSame:boolean=false;
                                    for(let i:number=0;i<goods.value.length;i++){
                                        for(let j:number=0;j<goods.value[i].goods.length;j++){
                                            let newMealItems:string=goods.value[i].goods[j].new_meal_items.length>0?JSON.stringify(goods.value[i].goods[j].new_meal_items):"";
                                            if(goods.value[i].goods[j].gid==gid && newMealItems==curNewMealItems){
                                                isGoodSame=true;
                                                //减少菜品展示里的菜品数量
                                                goods.value[i].goods[j].amount=parseInt(goods.value[i].goods[j].amount)>0?parseInt(goods.value[i].goods[j].amount)-1:0;
                                                //减少菜品的数量
                                                amount.value = parseInt(goods.value[i].goods[j].amount);
                                                //减少服务端菜品的数量
                                                store.dispatch("cart/delCart",{cartData:goods.value[i].goods[j],branch_shop_id:branch_shop_id.value,table_code:table_code.value,meal_type:0});
                                                break;
                                            }
                                        }
                                    }
                                    //如果是自定义套餐
                                    if(!isGoodSame){
                                        store.dispatch("cart/delCart",{cartData:{gid:gid,meal_items:meal_items,new_meal_items:new_meal_items},meal_type:1,branch_shop_id:branch_shop_id.value,table_code:table_code.value});
                                    }
                            }
                    });
                }else{
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                }
            }
            //提交订单
            let submitOrder:Function=()=>{
                if(isLogin.value) {//如果会员已登录
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                        //如果购物车里有菜品
                        if (cartCount.value > 0) {
                            //跳转到提交订单页面
                            pushPage("/user_pages/order/index?branch_shop_id=" + branch_shop_id.value + "&table_code=" + table_code.value);
                        }
                    });
                        }else{//会员未登录
                            //跳转到会员登录页面
                            pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                    }
                }
            //跳转到我的订单页面
            let goMyOrder:Function=()=>{
                if(isLogin.value){//会员已登录
                    utils.safeUser(store,branch_shop_id.value,table_code.value,()=>{
                        pushPage(`/pages/myorder/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                    })
                }else{
                    //跳转到会员登录页面
                    pushPage(`/pages/login/index?branch_shop_id=${branch_shop_id.value}&table_code=${table_code.value}`);
                }
            }
           return{
            branch_shop_id,
            table_code,
            goodsAction,
            businessAction,
            gid,
            pushPage,
            replacePage,
            changeTab,
            amount,
            shelfGoods,
            goods,
            classifys,
            showAmountInput,
            setAmount,
            showGoodsDetails,
            shopInfo,
            incAmount,
            cartCount,
            total,
            isCart,
            setIsCart,
            showCart,
            cartData,
            clearCart,
            decAmount,
            submitOrder,
            goMyOrder
           }
        }
    })
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow:hidden;position: relative;}
    .header{width:100%;height:230rpx;background-color:#E30019;position:relative;z-index:1;}
    /* #ifndef H5 */
    .header.official{height:280rpx;}
    /* #endif */
    .business-wrap{width:100%;height:100rpx;position:relative;z-index:1;}
    .header.ipx.official{height:320rpx;}
    .status_bar{background-color:#E30019}
    .status_bar .bar-bg{width:90%;height:100%;background-color:#FFFFFF;margin:0 auto;}
    .business-wrap .business-info{width:90%;height:180rpx;background-color:#FFFFFF;position: absolute;z-index:1;left:50%;top:-80rpx;transform: translateX(-50%);box-shadow: 3px 3px 5px #efefef;border-radius: 5px;}
    .business-wrap .home{width:50rpx;height:50rpx;position:absolute;right:15rpx;top:15rpx;z-index:1;background-image: url("~@/static/images/goods/home.png");background-size:100%;background-repeat: no-repeat;background-position:center;}
    .business-wrap .business-logo{width:100rpx;height:100rpx;position:absolute;z-index:1;left:35rpx;top:15rpx;}
    .business-wrap .business-logo image{width:100%;height:100%;border-radius: 8px;}
    .business-wrap .business-name{width:450rpx;height:100rpx;font-size:36rpx;color:#333333;position: absolute;z-index:1;top:20rpx;left:156rpx;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;}
    .business-wrap .promotion{width:75%;height:60rpx;position:absolute;z-index:1;left:156rpx;top:80rpx;font-size:26rpx;color:#E30019;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;text-decoration: underline;}
    .business-wrap .notice{width:630rpx;height:60rpx;position:absolute;z-index:1;left:35rpx;top:130rpx;font-size:26rpx;color:#999999;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;}
    .tags{width:100%;height:100rpx;display:flex;justify-content: space-between;align-items: center;padding:0px 25rpx;box-sizing: border-box;}
    .tags .item-wrap{width:auto;height:auto;display:flex;}
    .tags .item-wrap .item{width:auto;height:auto;color:#333333;font-size:28rpx;padding:10rpx 5rpx;margin-right:30rpx;}
    .tags .item-wrap .item.focus{color:#E30019}
    .tags .item-wrap .item.active{border-bottom: 2px solid #ffd161;font-weight:bold;}
    .tags .myorder{width:150rpx;height:100%;border-radius: 15px;background-color:#f5f5f5;display: flex;justify-content: center;align-items: center;margin-right:10rpx;}
    .tags .myorder-icon{width:40rpx;height:40rpx;background-image:url("~@/static/images/goods/myorder.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-right:10rpx;}
    .tags .myorder .text{color:#333333;font-size:28rpx;}
    .tags .tags-handle{display:flex;height:50rpx;}
    .tags .tags-handle .line{width:3px;height:100%;background-color:rgba(245,245,245,0.6);}
    .tags .tags-text{font-size:28rpx;color:#FFFFFF;margin-left:10rpx;border-radius: 5px;background-color:#E30019;padding:5rpx 10rpx;}
    .tags .my{width:40rpx;height:40rpx;background-image: url("~@/static/images/main/my.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-left:10rpx;}

    .cart-main{width:100%;height:100rpx;background-color:#f6ab00;position: fixed;z-index:90;left:0px;bottom:0px;}
    .cart-main .cart-cle{width:130rpx;height:130rpx;border-radius: 100%;background-color:#f6ab00;position:absolute;left:56rpx;top:-40rpx;}
    .cart-main .cart-cle-2{width:100rpx;height:100rpx;border-radius: 100%;position: absolute;left:50%;top:50%;transform: translate(-50%,-50%);background-color:#F8CE86}
    .cart-main .cart-icon{width:60rpx;height:60rpx;background-image:url("~@/static/images/main/cart.png");background-size:100%;background-position:center;background-repeat: no-repeat;position: absolute;z-index:1;left:50%;top:50%;transform: translate(-50%,-50%); }
    .cart-main .badge{width:50rpx;height:50rpx;border-radius: 100%;background-color:#ff2400;position:absolute;right:-35rpx;top:-35rpx;font-size:24rpx;color:#FFFFFF;text-align: center;line-height:50rpx;white-space: nowrap;overflow:hidden;}
    .cart-main .total{font-size:36rpx;color:#FFFFFF;width:auto;height:auto;position:absolute;left:180rpx;top:50%;transform: translateY(-50%);}
    .cart-main .line{width:2px;height:62rpx;background-color:rgba(255,255,255,0.6);position:absolute;z-index:1;left:507rpx;top:50%;transform: translateY(-50%);}
    .cart-main .submit{width:175rpx;height:60rpx;position:absolute;z-index:1;right:30rpx;top:50%;transform: translateY(-50%);font-size:32rpx;color:#FFFFFF;line-height:60rpx;}
    .cart-main .handle-cart{width:65%;height:100%;}

    .mp-wrap{width:90%;margin:0 auto;height:180rpx;background-color:#FFFFFF;display:flex;justify-content: space-between;align-items: flex-end;box-sizing: border-box;padding:0px 20rpx;border-bottom-left-radius: 5px;border-bottom-right-radius:5px;overflow:hidden;}
    /* #ifdef H5 */
    .mp-wrap{height:140rpx;}
    /* #endif */
    .mp-wrap.ipx{height:220rpx;}
    .mp-wrap .mp-logo{width:80rpx;height:80rpx;margin-bottom:20rpx;}
    .mp-wrap .mp-logo image{width:100%;height:100%;border-radius: 8px;}
    .mp-wrap .info{width:84%;height:80rpx;position: relative;z-index:1;margin-bottom:20rpx;}
    .mp-wrap .info .name{width:auto;height:auto;font-size:28rpx;color:#5A5A5A;position:absolute;z-index:1;left:0px;top:0px;}
    .mp-wrap .info .desc{width:auto;height:auto;font-size:24rpx;color:#5A5A5A;position:absolute;z-index:1;left:0px;top:45rpx;}
    .mp-wrap .info .focus{width:auto;height:auto;border:1px solid #28A622;border-radius: 4px;font-size:28rpx;color:#28A622;position:absolute;z-index:1;right:0px;top:14rpx;padding:5rpx 20rpx;}

    /* #ifdef MP-WEIXIN */
    .mp-wrap2{width:100%;margin:0 auto;height:230rpx;background-color:#FFFFFF;display:flex;justify-content: center;align-items: flex-end;box-sizing: border-box;border-bottom-left-radius: 5px;border-bottom-right-radius:5px;overflow:hidden;margin-top:20rpx;}
    .mp-wrap2.ipx{height:250rpx;}
    /* #endif */
</style>