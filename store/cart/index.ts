import {addCartData,getCartData,setAmountData,delData,clearCartData} from "../../api/cart";
export default {
    namespaced:true,
    state:{
        cartData:[],//购物车里面的数据
        cartCount:0,//购物车里菜品的总数量
        isPack:false,//是否自提
    },
    mutations:{
        //添加购物车
        ["ADD_CART_DATA"](state:any,payload:any){
            let isSame=false;//是否有相同的菜品
            state.cartCount=0;//购物车里菜品的数量
            if(state.cartData.length>0){
                for(let i:number=0;i<state.cartData.length;i++){
                    //购物车里套餐菜品明细的gid
                    let newMealItems=(state.cartData[i]["new_meal_items"] && state.cartData[i]["new_meal_items"].length)>0?JSON.stringify(state.cartData[i]["new_meal_items"]):"";
                    //从addCart传递过来的套餐菜品明细的gid                    
let curNewMealItems=(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length)>0?JSON.stringify(payload.cartData.new_meal_items):"";
                    //如果菜品相同
                    if(state.cartData[i]["gid"]==payload.cartData.gid && newMealItems==curNewMealItems){
                        isSame=true;
                        //增加购物车里面菜品的数量
                        state.cartData[i].amount=parseInt(state.cartData[i].amount)+1;
                        //如果套餐里面存着菜品
                        if((state.cartData[i].meal_items && state.cartData[i].meal_items.length)>0){
                            for(let j=0;j<state.cartData[i].meal_items.length;j++){
                                //增加套餐里面菜品的数量
                                state.cartData[i].meal_items[j].amount=state.cartData[i].meal_items[j].dis_amount*state.cartData[i].amount;
                            }
                        }
                    }
                    //计算购物车里菜品的总数量
                    state.cartCount+=parseInt(state.cartData[i].amount);
                }
            }
            //如果购物车里没有相同的菜品
            if(!isSame){
                state.cartCount=parseInt(state.cartCount)+parseInt(payload.cartData.amount);
                //将菜品添加到购物车
                state.cartData.unshift(payload.cartData);
            }
        },
        //将购物车里菜品的数量赋值给菜品展示
        ["SET_GOODS_CART_AMOUNT"](state:any,payload:any){
            if(state.cartData.length>0){
                for(let i:number=0;i<state.cartData.length;i++){
                    let curNewMealItems=(state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length>0)?JSON.stringify(state.cartData[i].new_meal_items):"";
                    for(let j:number=0;j<payload.goods.length;j++){
                        for(let k:number=0;k<payload.goods[j].goods.length;k++){
                            let newMealItems=(payload.goods[j].goods[k].new_meal_items && payload.goods[j].goods[k].new_meal_items.length>0)?JSON.stringify(payload.goods[j].goods[k].new_meal_items):"";
                            //如果有相同的菜品
                            if(state.cartData[i].gid==payload.goods[j].goods[k].gid && curNewMealItems==newMealItems){
                                payload.goods[j].goods[k].amount=state.cartData[i].amount;
                                break;
                            }
                        }
                    }
                }
            }else{//购物车里没有数据，将菜品展示里的数量设置为0
                if(payload.goods.length>0){
                    for(let i:number=0;i<payload.goods.length;i++){
                        for(let j=0;j<payload.goods[i].goods.length;j++){
                            payload.goods[i].goods[j].amount=0;
                        }
                    }
                }
            }
        },
        //减少和删除购物车里的数据
        ["DEL_CART_DATA"](state:any,payload:any){
            if(state.cartData.length>0){
                state.cartCount=0;
                let curNewMealItems=(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length>0)?JSON.stringify(payload.cartData.new_meal_items):"";
                for(let i:number=0;i<state.cartData.length;i++){
                    let newMealItems=(state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length>0)?JSON.stringify(state.cartData[i].new_meal_items):"";
                    //如果有相同的菜品
                    if(state.cartData[i].gid==payload.cartData.gid && curNewMealItems==newMealItems){
                        //减少菜品的数量
                        let cartAmount=parseInt(state.cartData[i].amount)>0?parseInt(state.cartData[i].amount)-1:0;
                        state.cartData[i].amount=cartAmount;
                        if(cartAmount<=0){//如果菜品的数量小于1
                            state.cartData.splice(i--,1);//删除菜品
                        }else{
                            if(state.cartData[i].meal_items && state.cartData[i].meal_items.length>0){
                                for(let j=0;j<state.cartData[i].meal_items.length;j++){
                                    //更改套餐里菜品的数量
                                    state.cartData[i].meal_items[j].amount=cartAmount*state.cartData[i].meal_items[j].dis_amount;
                                }
                            }
                        }
                        break;
                    }
                }
                for(let i:number=0;i<state.cartData.length;i++){
                    state.cartCount+=parseInt(state.cartData[i].amount);
                }
            }
        },
        //显示input数量输入框
        ["SHOW_AMOUNT_INPUT"](state:any,payload:any){
            state.cartData[payload.index].isAmountInput=true;
            state.cartData[payload.index].isAmountInputFocus=true;
        },
        //隐藏input数量输入框
        ["HIDE_AMOUNT_INPUT"](state:any,payload:any){
            state.cartData[payload.index].isAmountInput=false;
            state.cartData[payload.index].isAmountInputFocus=false;
        },
        //设置购物车里菜品的数据
        ["SET_CART_DATA"](state:any,payload:any){
            state.cartData=payload.cartData;
            state.cartCount=0;
            if(state.cartData.length>0){
                for(let i:number=0;i<state.cartData.length;i++){
                    state.cartCount+=parseInt(state.cartData[i].amount);
                }
            }
        },
        //清空购物车里的数据
        ["CLEAR_CART_DATA"](state:any){
            state.cartData=[];
            state.cartCount=0;
        },
        //设置自提
        ["SET_PACK"](state:any,payload:any){
            state.isPack=payload.isPack;
        },
        //更新购物车数量
        ["SET_AMOUNT"](state:any,payload:any){
            state.cartCount=0;
            let amount:number=payload.cartData.amount;
            //如果输入的非数字，替换成空
            amount=parseInt(amount.toString().replace(/[^\d]/g,""));
            //如果输入的数字为空或是0,强行设置为1
            if(!amount || amount==0){
                amount=1;
            }
            if(state.cartData.length>0){
                let curNewMealItems:string=(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length>0)?JSON.stringify(payload.cartData.new_meal_items):"";
                for(let i:number=0;i<state.cartData.length;i++){
                    let newMealItems:string=(state.cartData[i].new_meal_items && state.cartData[i].new_meal_items.length>0)?JSON.stringify(state.cartData[i].new_meal_items):"";
                    //如果有相同的菜品
                    if(state.cartData[i].gid==payload.cartData.gid && curNewMealItems==newMealItems){
                        //设置菜品的数量
                        state.cartData[i].amount=amount;
                        //如果套餐里有菜品
                        if(state.cartData[i].meal_items && state.cartData[i].meal_items.length>0){
                            for(let j:number=0;j<state.cartData[i].meal_items.length;j++){
                                state.cartData[i].meal_items[j].amount=state.cartData[i].meal_items[j].dis_amount*amount;
                            }
                        }
                    }
                    //更新购物车里菜品的总数量
                    state.cartCount+=parseInt(state.cartData[i].amount);
                }
            }
        }
    },
    actions:{
        //添加购物车
        addCart(conText:any,payload:any){
            let data={
                "uid":conText.rootState.user.uid,//会员的唯一标识
                "token":conText.rootState.user.token,//会员登录时的token
                "platform":conText.rootState.system.platform,//平台类型
                "branch_shop_id":payload.cartData.branch_shop_id,//分店的id
                "table_code":payload.cartData.table_code,//桌号
                "gid":payload.cartData.gid,//菜品的唯一标识
                "amount":payload.cartData.amount,//菜品数量
                "is_meal":payload.cartData.is_meal,//是否套餐
                "meal_type":payload.cartData.meal_type,//套餐类型。0:普通套餐，1:自定义套餐
                "meal_items":(payload.cartData.meal_items && payload.cartData.meal_items.length>0)?JSON.stringify(payload.cartData.meal_items):"",//套餐里菜品的明细
                "new_meal_items":(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length>0)?JSON.stringify(payload.cartData.new_meal_items):"",//套餐里菜品的gid
            };

            //添加购物车到数据库
            addCartData(data).then((res:any)=>{
                if(res.code==200){
                    conText.commit("ADD_CART_DATA",{cartData:payload.cartData});
                    conText.commit("SET_GOODS_CART_AMOUNT",{goods:conText.rootState.goods.goods});
                    if(payload.success){
                        payload.success()
                    }
                }
            });
        },
        //减少数量和删除商品
        async delCart(conText:any,payload:any){
            //修改数量
            let amount:any=0;
            let meal_type:number=payload.meal_type;//如果是1：自定义套餐，0:普通套餐
            if(meal_type!=1){//如果是普通套餐
                amount=payload.cartData.amount;
            }else{//meal_type=1表示自定义套餐，获取购物车里面的数量
                amount=await getCartData({"uid":conText.rootState.user.uid,"token":conText.rootState.user.token,"platform":conText.rootState.system.platform,branch_shop_id:payload.branch_shop_id,table_code:payload.table_code}).then((res:any)=>{
                    if(res.code==200){
                        for(let i:number=0;i<res.data.length;i++){
                            let newMealItems=res.data[i].new_meal_items && res.data[i].new_meal_items.length>0?JSON.stringify(res.data[i].new_meal_items):"";
                            let curMealItems=payload.cartData.new_meal_items && payload.cartData.new_meal_items.length>0?JSON.stringify(payload.cartData.new_meal_items):"";
                            //如果有相同的菜品
                            if(res.data[i].gid==payload.cartData.gid && newMealItems==curMealItems){
                                //减少菜品数量
                                return res.data[i].amount>0?res.data[i].amount-1:0;
                            }
                        }
                    }
                })
            }

            let data:any={
                "uid":conText.rootState.user.uid,
                "token":conText.rootState.user.token,
                "platform":conText.rootState.system.platform,
                branch_shop_id:payload.branch_shop_id,
                amount:amount,
                meal_items:(payload.cartData.meal_items && payload.cartData.meal_items.length>0)?JSON.stringify(payload.cartData.meal_items):"",
                new_meal_items:(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length)>0?JSON.stringify(payload.cartData.new_meal_items):"",
                gid:payload.cartData.gid
            };
            if(amount>0){//如果数量大于0，修改数量
                setAmountData(data).then((res:any)=>{
                    if(res.code==200){
                        conText.commit("DEL_CART_DATA",{cartData:payload.cartData});
                    }
                });
            }else{//删除购物里面的数据
                delData(data).then((res:any)=>{
                    if(res.code==200){
                        conText.commit("DEL_CART_DATA",{cartData:payload.cartData});
                    }
                })
            }
        },
        //更改购物车数量
        setAmount(conText:any,payload:any){
            //客户端购物车的数据
            let data:any={
                "uid":conText.rootState.user.uid,
                "token":conText.rootState.user.token,
                "platform":conText.rootState.system.platform,
                branch_shop_id:payload.branch_shop_id,
                amount:payload.cartData.amount,
                meal_items:(payload.cartData.meal_items && payload.cartData.meal_items.length>0)?JSON.stringify(payload.cartData.meal_items):"",
                new_meal_items:(payload.cartData.new_meal_items && payload.cartData.new_meal_items.length)>0?JSON.stringify(payload.cartData.new_meal_items):"",
                gid:payload.cartData.gid
            };
            //更新服务端数据库中菜品的数量
            setAmountData(data).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_AMOUNT",{cartData:payload.cartData});
                }
            });
        },
        //清空购物车
        clearCart(conText:any,payload:any){
            clearCartData({"uid":conText.rootState.user.uid,"token":conText.rootState.user.token,"platform":conText.rootState.system.platform,branch_shop_id:payload.branch_shop_id,table_code:payload.table_code}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("CLEAR_CART_DATA");
                    if(payload.success){
                        payload.success();
                    }
                }
            });
        },
        //显示购物车数据
        showCartData(conText:any,payload:any){
            getCartData({"uid":conText.rootState.user.uid,"token":conText.rootState.user.token,"platform":conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){//如果请求成功
                    for(let i:number=0;i<res.data.length;i++){
                        res.data[i].isAmountInput=false;
                        res.data[i].isAmountInputFocus=false;
                    }
                    conText.commit("SET_CART_DATA",{cartData:res.data});
                    if(payload.success){
                        payload.success();
                    }
                }else{//没有请求成功
                    conText.commit("SET_CART_DATA",{cartData:[]});
                }
                conText.commit("SET_GOODS_CART_AMOUNT",{goods:conText.rootState.goods.goods});
            })
        }
    },
    getters:{
        //计算总价
        total(state:any){
            let total=0;//菜品总价格
            let mealTotal=0;//套餐总价
            let packTotal=0;//包装费总价
            let footTotal=0;//单品总价
            let packFootTotal=0;//单品包装费总价
            let packMealTotal=0//套餐包装费总价
            if(state.cartData.length>0){
                for(let i:number=0;i<state.cartData.length;i++){
                    if (state.cartData[i].is_meal == '0') {//如果非套餐
                        //计算非套餐总价
                        footTotal += parseFloat(state.cartData[i].price) * parseInt(state.cartData[i].amount);
                         if(state.isPack){//如果是自提
//计算非套餐包装费
                            packFootTotal += parseFloat(state.cartData[i].pack_price) * parseInt(state.cartData[i].amount);
                        }
                    }
                    if (state.cartData[i].is_meal == '1') {//如果是套餐
                        for (let j:number = 0; j < state.cartData[i].meal_items.length; j++) {
                            //计算套餐总价
                            mealTotal += parseFloat(state.cartData[i].meal_items[j].price) * parseInt(state.cartData[i].meal_items[j].amount);
                             if(state.isPack){//如果是自提
//计算套餐包装费
                                packMealTotal += (parseFloat(state.cartData[i].meal_items[j].pack_price) * parseInt(state.cartData[i].meal_items[j].amount));
                              }
                        }
                    }
                }
                 packTotal = packFootTotal + packMealTotal;//计算非套餐和套餐包装费总价
                total=footTotal+mealTotal+packTotal;//计算非套餐和套餐总价
            }
            if(total>0){
                total=parseFloat((total).toFixed(2));//计算菜品总价
            }
            return total;
        },
        //计算包装费总价
        packTotal(state:any){
            let packFootTotal=0,packMealTotal=0,packTotal=0;
            if(state.isPack){//如果是自提
                if(state.cartData.length>0){
                    for(let i:number=0;i<state.cartData.length;i++){
                        if(state.cartData[i].is_meal=='0'){//如果非套餐
                            //计算非套餐包装费总价
                            packFootTotal+=parseFloat(state.cartData[i].pack_price)*parseInt(state.cartData[i].amount);
                        }
                        if(state.cartData[i].is_meal=='1'){//如果是套餐
                            for(let j:number=0;j<state.cartData[i].meal_items.length;j++){
                                //计算套餐包装费总价
                                packMealTotal+=(parseFloat(state.cartData[i].meal_items[j].pack_price)*parseInt(state.cartData[i].meal_items[j].amount));
                            }
                        }
                    }
                }
            }
            //计算包装费总价
            packTotal=parseFloat((packFootTotal+packMealTotal).toFixed(2));
            return packTotal;
        }
    }
}