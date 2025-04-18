import {addOrderData,wechatUnifiedorderData,getLastOrderData,payData,getOrderData,getOrderDetailsData,applyRefundOrderData,getRefundOrderData} from "../../api/order";
export default {
    namespaced:true,
    state:{
        lastOrder:{},//提交订单后返回的信息
        orders:[],//已付款订单数据
        orderDetails:{},//订单详情数据
        refundOrders:[]//已退款订单数据
    },
    mutations:{
        //设置提交订单后返回的信息
        ["SET_LAST_ORDER"](state:any,payload:any){
            state.lastOrder=payload.lastOrder;
        },
        //设置已付款订单数据
        ["SET_ORDERS"](state:any,payload:any){
            state.orders=payload.orders;
        },
        //设置已付款订单分页数据
        ["SET_ORDERS_PAGE"](state:any,payload:any){
            state.orders.push(...payload.orders);
        },
        //设置订单详情数据
        ["SET_ORDER_DETAILS"](state:any,payload:any){
            state.orderDetails=payload.orderDetails;
        },
        //改变订单详情退款状态
        ["SET_ORDER_DETAILS_REFUND_STATE"](state:any,payload:any){
            if(state.orderDetails.order_desc){
                if(payload.is_meal=='1'){//套餐
                    level1:
                        for(let i:number=0;i<state.orderDetails.order_desc.length;i++){
                            level2:
                                for(let j=0;j<state.orderDetails.order_desc[i].omi_data.length;j++){
                                    if(state.orderDetails.order_desc[i].omi_data[j].order_item_id==payload.order_item_id) {
                                        state.orderDetails.order_desc[i].omi_data[j].refund_state='-1';
                                        break level1;
                                    }
                                }
                        }
                }else{//非套餐
                    for(let i:number=0;i<state.orderDetails.order_desc.length;i++){
                        if(state.orderDetails.order_desc[i].order_item_id==payload.order_item_id){
                            state.orderDetails.order_desc[i].refund_state='-1';
                             break;
                        }
                    }
                }
            }
        },
        //设置已退款订单数据
        ["SET_REFUND_ORDERS"](state:any,payload:any){
            state.refundOrders=payload.refundOrders;
        },
        //设置已退款订单分页数据
        ["SET_REFUND_ORDERS_PAGE"](state:any,payload:any){
            state.refundOrders.push(...payload.refundOrders);
        }
    },
    actions:{
        //提交订单
        addOrder(conText:any,payload:any){
            addOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //微信小程序统一下单接口
        wechatUnifiedorder(conText:any,payload:any){
            return wechatUnifiedorderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                return res;
            })
        },
        //获取提交订单后返回的信息
        getLastOrder(conText:any,payload:any){
            getLastOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_LAST_ORDER",{lastOrder:res.data});
                }
            })
        },
        //如果支付金额为0，直接支付
        payOrder(conText:any,payload:any){
            payData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        },
        //查看已付款订单数据
        getOrder(conText:any,payload:any){
            getOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_ORDERS",{orders:res.data});
                    if(payload.success){
                        payload.success(res.pageinfo.pagenum);
                    }
                }else{
                    conText.commit("SET_ORDERS",{orders:[]});
                }
                if(payload.complete){
                    payload.complete()
                }
            })
        },
        //查看已付款订单分页数据
        getOrderPage(conText:any,payload:any){
            getOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_ORDERS_PAGE",{orders:res.data});
                }
            })
        },
        //查看订单详情
        getOrderDetails(conText:any,payload:any){
            getOrderDetailsData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_ORDER_DETAILS",{orderDetails:res.data});
                }
                if(payload.complete){
                    payload.complete();
                }
            })
        },
        //申请退款
        applyRefundOrder(conText:any,payload:any){
            applyRefundOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(payload.success){
                    payload.success(res);
                }
                if(res.code==200){
                    //改变订单状态
                    conText.commit("SET_ORDER_DETAILS_REFUND_STATE",{order_item_id: payload.order_item_id,is_meal:payload.is_meal});
                }
            })
        },
         //查看已退款订单数据
         getRefundOrder(conText:any,payload:any){
            getRefundOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_REFUND_ORDERS",{refundOrders:res.data});
                    if(payload.success){
                        payload.success(res.pageinfo.pagenum);
                    }
                }else{
                    conText.commit("SET_REFUND_ORDERS",{refundOrders:[]});
                }
                if(payload.complete){
                    payload.complete();
                }
            })
        },
        //查看退款订单分页数据
        getRefundOrderPage(conText:any,payload:any){
            getRefundOrderData({uid:conText.rootState.user.uid,token:conText.rootState.user.token,platform:conText.rootState.system.platform,...payload}).then((res:any)=>{
                if(res.code==200){
                    conText.commit("SET_REFUND_ORDERS_PAGE",{refundOrders:res.data});
                }
            })
        }
    },
}