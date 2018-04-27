<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        //f7-list.line-content
            f7-list-item(divider="")
            f7-list-item
                .numberic-row
                    .numberic-col
                        .item-title.label 购买时间
                        .item-input.no-marign
                            span {{newdate.format("Y年M月D日")}}
                    .numberic-col
                        .item-title.label  单价
                        .item-input.no-marign
                            span {{toPrice}}
                    .numberic-col.flex-center
                        .numberic-people
                            span.item-title 成人
                            span.item-input
                                numberic(:value="order.adultNumber",:min="1",v-model="order.adultNumber",:max="30",@change="adultChange")
                        .numberic-people
                            span.item-title 儿童
                            span.item-input
                                numberic(:value="order.childrenNumber",v-model="order.childrenNumber",:min="0",:max="30",@change="childrenChange")
                    .numberic-col
                        |1、儿童的身高不超过1.2(不含)
                    .numberic-col
                        |2、儿童票价为半价
                    .numberic-col
                        |3、解释权归提供线路的旅行社

            f7-list-item(divider="")
            f7-list-item.bottom-none
                .rules-row
                    p 出行人信息
                    .form-content.button-line(:class="{v_error:$v.order.name.$error}")
                        .item-title.label 姓名
                        .item-input
                            input(v-model="order.name",type="text",placeholder="请输入姓名",@click="$v.order.name.$touch()")
                    .form-content.button-line(:class="{v_error:$v.order.phone.$error}")
                        .item-title.label 联系人手机
                        .item-input
                            input(v-model="order.phone",type="text",placeholder="请输入手机号",@click="$v.order.phone.$touch()")



        f7-list.line-content
            f7-list-item(divider="")
            f7-list-item
                .item-title.label 购买时间
                .item-input.no-marign {{newdate.format("Y年M月D日")}}
            f7-list-item
                .item-title.label  单价
                .item-input.no-marign {{toPrice}}
            f7-list-item
                .item-title.label 成人
                .item-input
                    numberic(:value="order.adultNumber",:min="1",v-model="order.adultNumber",:max="30",@change="adultChange")
            f7-list-item
                 .item-title.label 儿童
                 .item-input
                     numberic(:value="order.childrenNumber",v-model="order.childrenNumber",:min="0",:max="30",@change="childrenChange")
            f7-list-item
                |1、儿童的身高不超过1.2(不含)
            f7-list-item
                |2、儿童票价为半价
            f7-list-item
                |3、解释权归提供线路的旅行社

            f7-list-item(divider="")
            f7-list-item.bottom-none 出行人信息
            f7-list-item(:class="{v_error:$v.order.name.$error}")
                .item-title.label 姓名
                .item-input
                    input(v-model="order.name",type="text",placeholder="请输入姓名",@click="$v.order.name.$touch()")
            f7-list-item(:class="{v_error:$v.order.phone.$error}")
                .item-title.label 联系人手机
                .item-input
                    input(v-model="order.phone",type="text",placeholder="请输入手机号",@click="$v.order.phone.$touch()")

        f7-toolbar(bottom)
                .bot-bar
                    span.total-price 共计￥{{order.adultNumber*toPrice + order.childrenNumber*toPrice/2}}
                .from-button
                    f7-button.no-round(fill,color="red",@click="submit") 立即下单







</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    import mo from "moment"



    export default {

        mixins: [vars.mixin_1],
        data () {
            var m = this;
            return {
                name: "xianlu-order",
                min: mo(m.start),
                order:{
                    adultNumber:1,
                    childrenNumber:0,
                    name:"",
                    phone:""
                },
                toPrice:[],
                currPriceTime:"",
                newdate: mo(m.currPriceTime),

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

        },

        methods: {
            adultChange:function(v){
                var m = this;
                m.order.adultNumber = v;
            },
            childrenChange:function(v1){
                var m = this;
                m.order.childrenNumber = v1;
            },
            submit:function(){
                var m=this;
                var linePlineMonery=m.toPrice;
                var orderChildrenNumber=m.order.childrenNumber;
                var orderAdultNumber=m.order.adultNumber;
                var lineQuantity=m.order.childrenNumber +m.order.adultNumber;
                var lineTotallyPrice= linePlineMonery*orderAdultNumber+orderChildrenNumber*linePlineMonery/2;
                console.log(lineTotallyPrice);
                if (m.$v.order.$invalid) {
                    m.$v.order.$touch();
                    return;
                }


                var order = _.merge({},m.order);
                order.visittime = m.currPriceTime;
                order.totalPrice = lineTotallyPrice;
                order.lineId = m.id;
                order.linePriceId = m.dataPriceId;
                order.quantity =  lineQuantity;
                order.childQuantity = m.order.childrenNumber;
                order.productPrice = lineTotallyPrice;
                order.price = m.toPrice ;

                order.mark=m.mark;
                m.req("order/save",order)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        //data
                        vars.xianlu_order_cache.orderLine = data.order;

                        m.routeTo(`/xianlu-payment/${data.order.code}/`)
                        //f7.alert("支付功能正在开发中","订单创建成功")


                    })
                    .catch(function(err){
                        vars.toast(vars.trimErrorMessage(err))
                        console.log(err,"订单提交失败")
                    })
                ;
            },
        },

        watch: {
        },

        mounted: function () {
            var m = this;
            m.currPriceTime = m.$route.params.currPriceTime;
            m.toPrice = m.$route.params.toPrice;
            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.dataPriceId = m.$route.params.dataPriceId;

        },

        components: {
            numberic:require("../components/numberic.vue"),
        },
        props: {
            start: {
                default() {
                    var m=this;
                    return new Date(m.currPriceTime);
                }
            },
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:xianlu-order;

    .toolClass();

    /*.@{name}{
        .data-range-item{
            .item-inner{
                justify-content: center;
                padding: 5px 0;
            }
        }
        .page-content{
            background-color: #ffffff;
            >.list-block{
                margin:0;
                .bottom-none{

                }
                .bottom{
                    position: fixed;
                    bottom: 0;
                }
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

                &.line-content{
                    .numberic-row,.rules-row{
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        p{
                            margin: 10px 0;
                        };
                        .numberic-col,.form-content{
                            display: flex;
                            justify-content: space-between;
                            margin: 5px 0;
                            .label {
                                flex: none;
                            }
                            &.flex-center{
                                justify-content:space-between;
                                margin: @page-edge/2 0;
                            }
                            .numberic-people{
                                justify-content: center;
                                align-items: center;
                                display: flex;
                                .item-title{
                                    overflow: visible;
                                }
                            }
                            .no-marign{
                                margin: 0;
                            }
                            &.button-line{
                                border-bottom:1px solid #c8c7cc;
                                &.v_error{
                                    border-bottom:1px solid #EA4B35;
                                }
                            }



                        }
                        .from-button{
                            margin: 5px 0;
                        }
                    }
                    :after {
                        background-color: transparent;
                    }
                }

            }
        }

        .submit-btn{
            margin:@page-edge;
        }
    }*/
    .@{name}{

        .page-content{
            background-color: #ffffff;

            .list-block{
                margin: 0;
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



</style>
