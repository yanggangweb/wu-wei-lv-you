<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")


        form
            f7-list.no-margin
                f7-list-item(divider="")
                f7-list-item {{_get(product,"product.name")}}
                f7-list-item
                    .item-title.label 单价:
                    .item-input ￥{{_get(product,"product.price")}}
                f7-list-item
                    .item-title.label 总价:
                    .item-input ￥{{_get(order,"totalPrice")}}

                f7-list-item {{_get(product,"product.name")}}

                f7-list-item(divider="")

                f7-list-item.pay-method
                    .item-title.label 支付方式:
                    .item-input
                        i.icon.i-zhifubao(@click="submit")
                        i.icon.i-weixin1(@click="wxpay")



            //f7-button.submit-btn(fill,color="red",big,@click="submit") 支付




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    import mo from "moment"



    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "common-payment",
                product:{},

                order:{}
            }
        },

        validations:{

        },

        computed: {


        },

        methods: {

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

            submit:function(){
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
                console.log("支付成功",data);
                f7.mainView.back({animatePages:false})
                f7.alert("支付成功")
               /* setTimeout(function(){
                    f7.mainView.back({animatePages:false})
                    f7.alert("支付成功")
                },80)*/
            }
        },


        mounted: function () {
            var m = this;
            m.code          =   m.$route.params.orderCode;
            var order = _.merge({},vars.jiudian_order_cache.orderObject);
            m.order = order;

            m.req("product/productdetail",{id:order.productId,noCache:true})
                .then(function(data){
                    if(data.resCode) {
                        throw data.message
                    }
                    m.product = data;
                })
                .catch(function(err){
                    f7.alert(err.toString(),"产品信息获取失败");
                })
            ;

        },

        components: {
            numberic:require("../components/numberic.vue")
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:common-payment;

    .toolClass();

    .@{name}{
        .page-content{
            background-color: #ffffff;
            .list-block{
                .item-content {
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

        .pay-method{
            .item-input{
                .icon{
                    font-size: 4rem;
                    margin-right: 0.2em;
                }
            }
        }
        .submit-btn{
            margin:@page-edge;
        }
    }



</style>
