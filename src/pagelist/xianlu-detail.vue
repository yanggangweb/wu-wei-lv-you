<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单详情
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")
        .no-margin
            .bg-green
                p(v-if="detaildata.state  == 0") 待支付
                p(v-if="detaildata.state  == 1") 已支付
                p(v-if="detaildata.state  == 7") 支付失败
                p(v-if="detaildata.state  == 2") 申请退款
                p(v-if="detaildata.state  == 3") 拒绝退款
                p(v-if="detaildata.state  == 4") 已退款
            .list-mark(v-if="detaildata.mark=='XIANLU'")
                .list-warpper
                    .custom-list-item
                        .img
                            img(:src="vars.oss_url_base + detaildata.productCover|ossResize(120)")

                        .right.shortcut-class
                            //商户
                            .distance.row.between
                                span.row {{detaildata.productName}}
                                div
                                    |￥
                                    b.red {{detaildata.price}}

                            .row.row-with-sell.between
                                b.item-title 成人 X {{detaildata.quantity - detaildata.childQuantity}}
                                b.item-title 儿童 X {{detaildata.childQuantity}}

            .diffent(v-if="detaildata.mark=='XIANLU'")
                .item-row.bg-gray.red
                    .item-title.label 实际付款
                    .item-input  {{detaildata.totalPrice}} 元
                .item-row.row
                    .item-title.label 单价
                    .item-input.bule.right   {{detaildata.price}}
                .item-row(v-if="detaildata.state  == 0")
                    .item-title.label 下单时间
                    .item-input.bule   {{detaildata.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="detaildata.state  == 1")
                    .item-title.label 支付时间
                    .item-input.bule   {{detaildata.paymentTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="detaildata.state  == 4")
                    .item-title.label 退款时间
                    .item-input.bule   {{detaildata.refundTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="detaildata.state  == 1")
                    .item-title.label 兑换码
                    .item-input.bule   {{detaildata.fetchCode}}

            .inner
                f7-button(color="red",fill="",v-if="detaildata.state == 0",@click.prevent="pay_page") 支付
                f7-button(color="red",fill="",v-if="detaildata.state == 1",@click.prevent="next_page") 再次购买




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import mo from "moment"



    export default {
        data () {
            return {
                name: "dingdan-detail",
                data:{
                    order:{}
                },
                detaildata:{

                }
            }
        },

        validations:{

        },

        computed: {


        },

        methods: {
            init: function (data) {
                var m = this;
                var para={
                    id:m.id,
                    noCache:true
                }
                m.req("order/get",para)
                    .then(function(detaildata){
                        if(detaildata.resCode==1){
                            throw integral.message;
                        }

                        m.detaildata = detaildata.data;
                    })
                    .catch(function(err){
                        f7.alert(err);
                    })
                ;
            },
            pay_page:function (e) {
                var m = this;
                m.data.order=m.detaildata
                vars.xianlu_order_cache.orderLine = m.data.order;


                m.routeTo(`/xianlu-payment/${m.detaildata.code}/`)
            },
            next_page:function (e) {
                var m = this;
                if( m.data.mark == "XIANLU"){
                    m.routeTo(`/xianlu-index-page/${m.data.lineId}/XIANLU/`)
                }
            },

        },

        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;
            m.pid = m.$route.params.pid;
            m.init();
        },

        components: {
            numberic:require("../components/numberic.vue")
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:dingdan-detail;

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
            color: #9c9f9e;
            font-size: .9rem;
            &.right{
                padding-right: @page-edge;
            }
        }

        .bg-green{

            background-color: #4cab93;
            color: #fff;
            padding:10px 15px;

        }
        .red{
            color: @cl_flat_red;
        }
        .bg-gray{
            background-color:#f6f6f6;
            padding: 5px 0;
            .tilte-list{
                padding:10px 15px;
                margin: 5px 0;
                background-color: #fff;
            }

        }

        .small-state{
            font-size: 0.8rem;
            color: @cl_flat_gray;
            .item-inner{
                display: block;
            }
        }
        .list-block{
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


        .list-warpper{
            flex: 1;
            background-color: #fff;

            padding:0 @page-edge;
            margin: 0;

            .custom-list-item{
                display: flex;
                margin-bottom:@page-edge;
                margin-top: @page-edge;
                align-items: stretch;

                .title{
                    position: static;
                    transform: none;
                    text-align: left;
                    color: #3D3D3D;
                    font-size: 0.9rem;
                    text-shadow: none;
                    border: none;
                    padding-left: 0;
                    margin-bottom: 0.25em;
                }

                .label.button.thin{
                    display: inline-block;
                    padding: 0 0.25em;
                    margin-right: @page-edge/2;
                    .lineh(1.3em);
                }

                >.img{
                    height: 7.2em;
                    width: 8em;
                    margin-right:@page-edge/2;
                    img{
                        display: block;
                        &:extend(.expandin);
                        border-radius:0;
                    }
                }

                .right{
                    flex: 1;
                    //background-color: #f0f0f0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }

            .star-list{
                color: #E9E9E9;
            }


            //商户
            &.JINGDIAN,
            &.MEISHI,
            &.JIUDIAN,
            &.TECHAN,
            .merchantElement
            {
                .label.hide{
                    display: inline;
                }
                .mark-merchant.hide{
                    display: block;
                }
            }

            &.JINGDIAN{
                .row-with-sell{
                    display: flex;
                }

            }
        }
        .item-row{
            display: flex;
            margin: 10px 0;

            .item-title{
                width: 30%;
                padding-left: 15px;
            }
            &.bg-gray{
                margin: 0;
            }

        }
    }



</style>
