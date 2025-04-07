import {getMealData,getMealDetailsData} from "../../api/goods";
//state数据格式接口
interface IState{
    title:string,
    mealData:any []
}
//actions内部的payload数据类型接口
interface IActionPayload{
    gid:string,
    branch_shop_id:string,
    success?:Function
}
export default {
    namespaced:true,
    state:{
        title:"",//套餐标题
        mealData:[]//可替换套餐菜品列表
    },
    mutations:{
        //设置可替换套餐菜品列表
        ["SET_MEAL_DATA"](state:IState,payload:{mealData:any []}){
            state.mealData=payload.mealData;
        },
        //设置套餐标题
        ["SET_TITLE"](state:IState,payload:{title:string}){
            state.title=payload.title;
        }
    },
    actions:{
        //获取套餐可替换数据
        getMeal(conText:any,payload:IActionPayload){
            getMealData(payload).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_MEAL_DATA",{mealData:res.data});
                    if(payload.success){
                        payload.success()
                    }
                }
            })
        },
        //获取套餐详情
        getMealDetails(conText:any,payload:IActionPayload){
            getMealDetailsData(payload).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_TITLE",{title:res.data.title});
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        }
    }
}