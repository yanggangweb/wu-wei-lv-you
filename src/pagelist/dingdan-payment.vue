<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")


        form
            .diffent(v-if="data.mark=='MEISHI' || data.mark=='TECHAN'")
                f7-list
                    f7-list-item
                        .item-title.label(v-if="data.mark=='MEISHI'") 菜名
                        .item-title.label(v-if="data.mark=='TECHAN'")  果品
                        .item-title.label 单价
                        .item-title.label 数量

                    f7-list-item(v-for="item in data.productList")
                        .item-title.label.bule  {{item.name}}
                        .item-title.label.bule   ￥ {{item.price}}
                        .item-title.label.bule  {{item.quantity}}
            .diffent(v-if="data.mark=='JIUDIAN'||data.mark=='JINGDIAN'")
                f7-list
                    f7-list-item
                        .item-title.label(v-if="data.mark=='JINGDIAN'") 景点名
                        .item-title.label(v-if="data.mark=='JIUDIAN'")  酒店名
                        .item-input.bule  {{data.merchantName}}
                    f7-list-item
                        .item-title.label(v-if="data.mark=='JINGDIAN'") 门票名称
                        .item-title.label(v-if="data.mark=='JIUDIAN'")  房间类型
                        .item-input.bule  {{data.productName}}
                    f7-list-item
                        .item-title.label 单&nbsp;&nbsp;&nbsp;&nbsp;价
                        .item-input.bule   ￥ {{data.price}}
                    f7-list-item
                        .item-title.label 数&nbsp;&nbsp;&nbsp;&nbsp;量
                        .item-input.bule   ￥ {{data.quantity}}
                    f7-list-item(v-if="data.mark=='JIUDIAN'")
                        .item-title.label  入住时间
                        .item-input.bule   {{data.startDate|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                    f7-list-item(v-if="data.mark=='JIUDIAN'")
                        .item-title.label 离开时间
                        .item-input.bule   {{data.endDate|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                    f7-list-item(v-if="data.state  == 1")
                        .item-title.label 兑换码
                        .item-input.bule   {{data.fetchCode}}
            f7-list
                f7-list-item.pay-method
                    .item-title.label 支付方式:
                    .item-input
                        i.icon.i-zhifubao(@click="submit(data)")
                        i.icon.i-weixin1(@click="wxpay(data)")



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
                name: "dingdan-payment",
                product:{},
                data:{},
                order:{}
            }
        },

        validations:{

        },

        computed: {


        },

        methods: {

            wxpay:function(data){

                var m = this;
                m.req("wxPay/unifiedOrder",{
                    noCache:true,
                    outTradeNo:data.code,
                    body:data.name,
                    totalFee:data.totalPrice*100,
                })
                .then(function(data){
                    var params = {
                        noCache:true,
                        outTradeNo:data.code,
                        body:data.name,
                        totalFee:data.totalPrice*100,
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

            submit:function(data){
                var m = this;
                m.req("alipay/pay",{
                    noCache:true,
                    code:data.code,
                    name:data.name,
                    totalPrice:data.totalPrice,
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
            m.id = m.$route.params.id;
            m.req("order/get",{id:m.id,noCache:true})
                .then(function(data){
                    if(data.resCode) {
                        throw data.message
                    }
                    m.data = data.data;
                    m.productList=data.data.productList
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


    @name:dingdan-payment;

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
        .bule{
            color: @cl_flat_greenn;
        }
        .list-block{
            margin: 0;
            .gray{
                color: @cl_flat_gray;
                .item-inner{
                    font-size: 1rem;
                }
            }
            .red  {
                color: @cl_flat_red;
                text-align: right;
            }
        }
        .diffent{
            >.list-block{
                margin: 0;
            }
        }
        .inner{
            padding: @page-edge;
        }
    }



</style>
