<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")



        f7-list

            f7-list-item {{got("pd.product.name")}}
            f7-list-item(divider="")
            f7-list-item
                .item-title.label 数量
                .item-input
                    numberic(:value="1",:min="1",:max="10",@change="numberChange")
            f7-list-item(:class="{v_error:$v.order.name.$error}")
                .item-title.label 姓名
                .item-input
                    input(v-model="order.name",type="text",placeholder="请输入姓名")
            f7-list-item(:class="{v_error:$v.order.phone.$error}")
                .item-title.label 联系人手机
                .item-input
                    input(v-model="order.phone",type="text",placeholder="请输入手机号")
            f7-list-item
                .item-title.label 优惠券
                .item-input
                    template(v-if="!couponList.length") 无优惠券可用
                    template(v-if="couponList.length")
                        select(v-model="order.couponId")
                            option(v-for="card in couponList",:value="card.id") {{card.name}}
                            option(value="0") 不使用
            f7-list-item(divider="")
            f7-list-item
                .item-title.label 单价
                .item-input ￥{{order.price}}
            f7-list-item
                .item-title.label 小计
                .item-input ￥{{totalPrice}}

        f7-button.wrapper.submit-btn(fill,color="red",big,@click="submit(show = !show)") 提交

        .transition
            .tooltip(v-if="show")
                p 内测版本，请不要点击支付，如有问题请联系客服




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'

    export default {
        mixins: [vars.mixin_1],
        data () {

            return {
                name: "jingdian-order",
                id:"",
                pd:{},
                couponList:[],
                order:{
                    merchantId:"",
                    productId:"",

                    quantity:1,
                    price:0,
                    totalPrice:0,
                    couponId:"",
                    name:"",
//                    phone:"15999995454",
                    phone:"",
                },
                show:false,

            }
        },
        validations:{
            order:{
                name:{
                    required,
                    minLength:2,
                },
                phone:{
                    required,
                    withParams:vars.validator.phone
                },
            }
        },

        computed: {
            originTotalPrice:function(){
                var m = this;
                return  m.order.price * m.order.quantity;
            },
            totalPrice:function(){
                var m = this;
                var cp = _.find(m.couponList,{id:m.order.couponId});
                if(!cp) return m.originTotalPrice;

                if(cp.type == 0) {
                    return ((m.originTotalPrice * cp.discountRate *100)>>0)/100 ;
                }else if(cp.type == 1){
                    return (m.originTotalPrice*100 - cp.discountedPrice*100)/100
                }
            }
        },

        methods: {
            calcCoupon:function(){
                var m = this;

                var queryKey    = vars.varsionPrefix == ".tr"?"merchantId":"productId";
                var queryValue  = vars.varsionPrefix == ".tr"?m.order.merchantId:m.id;
                m.req("scoreexchange/ordercoupon",{
                    [queryKey]:queryValue,
                    totalPrice:m.originTotalPrice,
                    noCache:true
                })
                    .then(function(coupon){
                        if(coupon.resCode) {
                            throw coupon.message;
                        }
                        //拿到可用的优惠卡
                        m.couponList = coupon.list;

                        if(m.order.couponId==="0")   return;

                        if(_.findIndex(coupon.list,{id:m.order.couponId})==-1) {
                            m.order.couponId = _.get(coupon.list,"0.id")||"";
                        }
                    })
                    .catch(function(err){
                        console.log(err,"获取优惠卡失败");
                    })
                ;
            },
            numberChange:function(v){
                var m = this;
                m.order.quantity = v;
            },
            submit:function(){
                var m = this;
                if (m.$v.order.$invalid) {
                    m.$v.order.$touch();
                    return;
                }


                var order = _.merge({noCache:true},m.order);

                order.totalPrice = m.totalPrice;
                order.productPrice = m.originTotalPrice;


                if(order.couponId=="0" || !order.couponId) {
                    order.couponId="";
                }
                m.req("order/save",order)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        //todo:屏蔽支付功能
//                        return !function(){
//                            f7.mainView.back({animatePages:false});
//                            setTimeout(function(){
//                                f7.alert("恭喜,下单成功")
//                            },80)
//                        }();

                        //data
                        vars.jiudian_order_cache.orderObject = data.order;
                        m.routeTo(`/common-payment/${data.order.code}`)
                    })
                    .catch(function(err){
                        f7.alert(err,"订单提交失败")
                    })
                ;

            },
        },

        watch: {
            "originTotalPrice":function(v){
                var m = this;
                m._calcCoupon();
            }
        },

        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;

            m.req("product/productdetail",{id:m.id})
                .then(function(data){
                    if(data.resCode) {
                        throw data.message;
                    }
                    m.pd=data;
                    m.order.productId=m.id;
                    m.order.merchantId=m.got("pd.product.merchantId");
                    m.order.price = data.product.price;
                    m.order.totalPrice = data.product.price * m.order.quantity;
                    m._calcCoupon()
                })
                .catch(function(err){
                    console.log("获取订单信息失败:",err);
                })
            ;

            m._calcCoupon = _.debounce(function(){
                m.calcCoupon()
            },600)

        },

        components: {
            numberic:require("../components/numberic.vue")
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:jingdian-order;

    .toolClass();

    .@{name}{
        .page-content{
            background-color: transparent;

            .list-block{


                .item-content{
                    .numberic{
                        height: 28px;
                        align-items: stretch;
                        >a{
                            .padding_h(0.25em);
                            height: auto;
                            display: flex;
                            align-items: center;
                            text-align: center;
                            justify-content: center;
                        }
                        >input{
                            height: auto;
                            border: 1px solid @cl_bd_light;
                            margin-left: -1px;
                            margin-right: -1px;
                        }
                    }
                }
            }
        }

        .submit-btn{
            margin:@page-edge;
        }
        .transition{
            box-sizing: border-box;
            margin: 0 5%;
            border-radius: 5px;
            background-color: @cl_flat_greenn;
            color: #fff;
            position: relative;
            animation-name: myfirst;
            animation-duration: 5s;
            animation-timing-function: linear;
            animation-delay: 2s;
            animation-iteration-count:1;
        }
        .tooltip{
            p{
                padding: @page-edge/2;
            }
            &:before{
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom:10px solid @cl_flat_greenn;
                position: absolute;
                left: 10%;
                top:-10px;
                width: 0;
                height: 0;
                content: "";

            }
        }
    }

    @keyframes myfirst{
        0%   {opacity: 0; left:-100%; }
        25%  {opacity: 0.2;  left:-20%; }
        50%  {opacity: 0.5;  left:-40%; }
        75%  {opacity: 0.7;  left:-70%;}
        100% {opacity: 1;  left:0; }
    }
    @-moz-keyframes mybefore{
        0%   {opacity: 0; left:-90%; }
        25%  {opacity: 0.2;  left:-60%; }
        50%  {opacity: 0.5;  left:-30%; }
        75%  {opacity: 0.7;  left:-10%;}
        100% {opacity: 1;  left:10%; }
    }




</style>
