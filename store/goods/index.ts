import {getClassifyData,getGoodsData,getGoodsDetailsData} from "../../api/goods";
//定义一个actions内部参数payload类型接口
interface IActionPayload{
    branch_shop_id:string,
    success?:Function
}
export default {
    namespaced:true,
    state:{
        classifys:[],//菜品分类
        goods:[],//菜品展示
        goodsDetails:{}//菜品详情数据
    },
    mutations:{
        //设置菜品分类
        ["SET_CLASSIFY"](state:any,payload:{classifys:any []}){
            state.classifys=payload.classifys;
        },
        //设置菜品展示
        ["SET_GOODS"](state:any,payload:{goods:any []}){
            state.goods=payload.goods;
        },
        //设置菜品数量
        ["SET_AMOUNT"](state:any,payload:any){
            level1:
            for(let i=0;i<state.goods.length;i++){
                level2:
                for(let j=0;j<state.goods[i].goods.length;j++){
                    //源数据套餐属性
                    let newMealItems:string=(state.goods[i].goods[j].new_meal_items && state.goods[i].goods[j].new_meal_items.length)>0?JSON.stringify(state.goods[i].goods[j].new_meal_items):"";
                    //传入的套餐属性
                    let curNewMealItems:string=(payload.new_meal_items && payload.new_meal_items.length)>0?JSON.stringify(payload.new_meal_items):"";
                    //如果有相同的单品或套餐
                    if(state.goods[i].goods[j].gid==payload.gid && newMealItems==curNewMealItems){
                        //更新数量
                        state.goods[i].goods[j].amount=parseInt(payload.amount);
                        //验证数量格式必须为数字，这里需要使用setTimeout延迟，否则无法验证
                        setTimeout(()=>{
                            state.goods[i].goods[j].amount=parseInt(state.goods[i].goods[j].amount.toString().replace(/[^\d]/g,""));
                        },30);
                        //如果数量为空或是为0，强制设置数量为1
                        if(!state.goods[i].goods[j].amount || state.goods[i].goods[j].amount==0){
                            state.goods[i].goods[j].amount=1;
                        }
                        break level1;//结束最外层循环
                    }
                }
            }
        },
        //显示数量input
        ["SHOW_AMOUNT_INPUT"](state:any,payload:{index:number,index2:number}){
            state.goods[payload.index].goods[payload.index2].isAmountInput=true;//显示input
            state.goods[payload.index].goods[payload.index2].isAmountInputFocus=true;//input获取焦点
        },
        //隐藏数量input
        ["HIDE_AMOUNT_INPUT"](state:any,payload:{index:number,index2:number}){
            state.goods[payload.index].goods[payload.index2].isAmountInput=false;
            state.goods[payload.index].goods[payload.index2].isAmountInputFocus=false;
        },
        //设置某一个菜品的位置
        ["SET_GOODS_POISTION"](state:any,payload:{index:number,position:number,top:number,left:number}){
            state.goods[payload.index].position=payload.position;
            state.goods[payload.index].top=payload.top;
            state.goods[payload.index].left=payload.left;
        },
        //设置菜品详情
        ["SET_GOODS_DETAILS"](state:any,payload:{goodsDetails:object}){
            state.goodsDetails=payload.goodsDetails;
        }
    },
    actions:{
        //显示左侧分类
        getCalssifys(conText:any,payload:IActionPayload){
            getClassifyData(payload.branch_shop_id).then((res:any)=>{
                if(res.code==200){
                    for(let i=0;i<res.data.length;i++){
                        if(i==0){
                            res.data[i].active=true;//选中分类时的样式
                        }else {
                            res.data[i].active = false;
                        }
                        //goodsTop，goodsHeight,top可以实现单击分类定位到相关的菜品
                        res.data[i].goodsTop=0;//该分类对应菜品距顶部的距离
                        res.data[i].goodsHeight=0;//该分类对应菜品的高
                        res.data[i].top=0;//该分类距顶部的距离
                    }
                    conText.commit("SET_CLASSIFY",{classifys:res.data});
                }else{
                    conText.commit("SET_CLASSIFY",{classifys:[]});
                }
                if(payload.success){
                    payload.success();
                }
            })
        },
        //显示新上架或下架的菜品
        getNewGoods(conText:any,payload:IActionPayload){
            getGoodsData(payload.branch_shop_id).then((res:any)=>{
                if(res.code==200){
                    if(payload.success){
                        payload.success(res.data);
                    }
                }
            })
        },
        //显示菜品
        getGoods(conText:any,payload:IActionPayload){
            getGoodsData(payload.branch_shop_id).then((res:any)=>{
                if(res.code==200){
                    for(let i=0;i<res.data.length;i++){
                        res.data[i].top=0;//css样式position的top
                        res.data[i].left=0;//css样式position的left
                        res.data[i].position="static";//动态改变css样式的position的值
                     for(let j=0;j<res.data[i].goods.length;j++){
res.data[i].goods[j].itemTop=0;//每个菜品的top
                            res.data[i].goods[j].amount=0;//菜品数量
                            res.data[i].goods[j].new_meal_items=[];//套餐规格
                            res.data[i].goods[j].isAmountInput=false;//是否显示数量输入框
                            res.data[i].goods[j].isAmountInputFocus=false;//数量输入框焦点
                            //重组套餐菜品里面的规格用于判断购物车里面的套餐是否相同
                            if(res.data[i].goods[j].meal_items){
                                for(let k=0;k<res.data[i].goods[j].meal_items.length;k++){
                                    res.data[i].goods[j].new_meal_items.push({"gid":res.data[i].goods[j].meal_items[k].gid})
                                }
                            }
                        }
                    }
                    conText.commit("SET_GOODS",{goods:res.data});
                    //调用store/cart/index.ts文件内mutations属性内部的SET_GOODS_CART_AMOUNT方法，将购物车里面的数据同步到菜品组件内部的菜品数量
                    conText.commit("cart/SET_GOODS_CART_AMOUNT",{goods:res.data},{root:true});
                    if(payload.success){
                        payload.success(res.data);
                    }
                }else{
                    conText.commit("SET_GOODS",{goods:[]});
                 }
            })
        },
        //菜品详情
        getGoodsDetails(conText:any,payload:{branch_shop_id:string,gid:string}){
            getGoodsDetailsData(payload).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_GOODS_DETAILS",{goodsDetails:res.data});
                }
            })
        }
    }
}