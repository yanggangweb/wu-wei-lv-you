<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单

        f7-list.no-margin
            f7-list-item {{got("data.merchantName")}}
            f7-list-item(divider)
            f7-list-item.fdlist
                table
                    tr(v-for="fd in data.productList")
                        td(v-html="fd.name")
                        td(v-html="'X '+fd.quantity")
                        td(v-html="'￥ '+fd.price * fd.quantity")

            f7-list-item(divider)
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
                .item-title.label 小计
                .item-input ￥{{totalPrice}}

        f7-button.submit-btn(fill,color="red",big,@click="submit") 提交
            picker.filter-gp-picker(ref="shopCard",title="请选择支付方式")
                .item-input
                    i.icon.i-zhifubao(@click="zfpaypal")
                    i.icon.i-weixin1(@click="wxpay")


</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators';
    import Picker from "../components/picker.vue";

    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "meishi-order",
                ...vars.itemCommData,
                data:{},
                couponList:[],
                order:{
                    merchantId:"",
                    quantity:1,
                    totalPrice:0,
                    couponId:"",
                    name:"",
                    phone:""
                },
                srvOrder:{}
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
                }
            }
        },

        computed: {
            originTotalPrice:function(){
                var m = this;
                return  m.got("data.totalPrice",0)*m.order.quantity;
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
                m.req("scoreexchange/ordercoupon",{
                    merchantId:m.id,
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
                order.id = m.got("data.order.id");
                order.merchantId = m.got("id");


                if(order.couponId=="0" || !order.couponId) {
                    order.couponId="";
                }
                m.req("order/save",order)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        //data
                        m.order = data.order;
                        //m.routeTo(`/common-payment/${data.order.code}`)
                        m.$refs.shopCard.show();
                    })
                    .catch(function(err){
                        f7.alert(err,"订单提交失败")
                    })
                ;

            },
            wxpay:function(){
                var m = this;
                m.req("wxPay/unifiedOrder",{
                    noCache:true,
                    outTradeNo:m.order.code,
                    body:m.order.name,
                    totalFee:m.order.totalPrice*100,
                })
                    .then(function(data){
                        var params = {
                            noCache:true,
                            outTradeNo:m.order.code,
                            body:m.order.name,
                            totalFee:m.order.totalPrice*100,
                            prepayid: data.prepayId
                        };

                        return m.req("wxPay/payInfo",params).then(function(data){
                            var ret = {}
                            $.each(data,function(k,el){
                                ret[k.toLowerCase()] = el;
                            });
                            return ret;
                        }).catch(function(err){
                            return  JSON.stringify(err);
                        })
                    })
                    .then(function(data){
                        return new Promise(function(resolve,reject){
                            Wechat.sendPaymentRequest(data, function () {
                                resolve()
                            }, function (reason) {
                                reject(reason)
                            });
                        })
                    })
                    .then(function(){
                        m.result({})
                    })
                    .catch(function(err){
                        console.log(err,"微信支付失败");
                    })
            },

            zfpaypal:function(){
                var m = this;
                m.req("alipay/pay",{
                    noCache:true,
                    code:m.order.code,
                    name:m.order.name,
                    totalPrice:m.order.totalPrice,
                })
                    .then(function(data){
                        AliPay.pay(
                            data.alipay
                            ,function(data){
                                m.result(data)
                            },function(err){
                                console.log(err,"支付失败");
                            }
                        )
                    })
                ;
            },

            result:function(data){
                var m = this;
                m.$refs.shopCard.hide();
                f7.mainView.back({animatePages:false})
                f7.alert("支付成功");
            }
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
            m.mark = m.$route.params.mark;

            /*var para = decodeURIComponent(m.$route.params.choosedData);

            try{
                para = JSON.parse(para)
            }catch(err){
                console.log("数据不合法",para);
            }

            m.req("order/placeorder",para)
                .then(function(data){
                    if(data.resCode) {
                        throw data.message;
                    }
                    m.data = data;

                    m._calcCoupon();
                })
            ;

            m._calcCoupon = _.debounce(function(){
                m.calcCoupon()
            },600)
*/

            m.req("order/get",{id :m.id})
                .then(function(data){
                    if(data.resCode==1){
                        throw integral.message;
                    }

                    m.data = data.data;
                    m.productList=data.data.productList;
                    m._calcCoupon();


                })
                .catch(function(err){
                    f7.alert(err);
                })
            ;
            m._calcCoupon = _.debounce(function(){
                m.calcCoupon()
            },600)

        },

        components: {
            numberic:require("../components/numberic.vue"),
            Picker,
        },
    }
</script>

<style lang=less rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:meishi-order;

    .toolClass();

    .@{name}{

        .fdlist{
            table{
                font-size: 0.9rem;
                width: 100%;

                td{
                    &:last-child{
                        text-align: right;
                        width: 5em;
                    }
                    &:nth-child(2) {
                        width: 4em;
                    }
                }
            }
        }

        .page-content{
            background-color: #ffffff;

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
    }
    .cc-picker {
        position: fixed;
        z-index: 6001;
        bottom: 0;
        left: 0;
        width: 100vw;
        min-height: 60px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .item-input {
            text-align: center;
            .icon {
                font-size: 4rem;
                margin-right: 0.4em;
            }
        }
    }

</style>
