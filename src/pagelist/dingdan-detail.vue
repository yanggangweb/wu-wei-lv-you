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
                p(v-if="data.state  == 0") 待支付
                p(v-if="data.state  == 1") 已支付
                p(v-if="data.state  == 7") 支付失败
                p(v-if="data.state  == 2") 申请退款
                p(v-if="data.state  == 3") 拒绝退款
                p(v-if="data.state  == 4") 已退款
            //f7-list-item.small-state
                b(v-if="data.state  == 0") 您
                    b.bule {{data.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                |进行支付前的一些操作，如果确认订单请进行支付操作，确保您的支付成功。
                b(v-if="data.state  == 1") 您
                    b.bule {{data.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                |进行本次订单进行了支付操作，确认您的支付成功后，获取兑换码，到商家进行实际使用。
                b(v-if="data.state  == 7") 您
                    b.bule {{data.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                |进行本次支付失败，重新进行支付。
            //.gray.title-item
                | 订单总价:
                .item-title.label.red  ￥ {{data.totalPrice}}
            .list-mark(v-if="data.mark=='JIUDIAN'||data.mark=='JINGDIAN'")
                .bg-gray
                    p.tilte-list {{data.merchantName}}
                .list-warpper
                    .custom-list-item
                        .img
                            img(:src="vars.oss_url_base + data.productCover|ossResize(120)")

                        .right.shortcut-class
                            //商户
                            .distance.row.between
                                span.row {{data.productName}}
                                div
                                    |￥
                                    b.red {{data.price}}
                                    |   元
                            .row.row-with-sell.between
                                span
                                b.item-title  X {{data.quantity}}
                            //.row.row-with-sell
                                | 手机号码
                                b.item-title.label.red   {{data.phone}}




            .list-mark(v-if="data.mark=='MEISHI' || data.mark=='TECHAN'")
                .bg-gray
                    p.tilte-list {{data.merchantName}}
                .list-warpper(v-for="item in data.productList")
                    .custom-list-item
                        .img
                            img(:src="vars.oss_url_base + item.cover|ossResize(120)")
                        .right.shortcut-class
                            //商户
                            .distance.row.between
                                span.row {{item.name}}
                                div
                                    |￥
                                    b.red {{item.price}}
                                    |   元
                            .row.row-with-sell.between
                                span
                                b.item-title  X {{data.quantity}}
            .diffent(v-if="data.mark=='MEISHI' || data.mark=='TECHAN'")
                .item-row.row.between(v-if="data.state  == 1&& data.mark=='TECHAN'")
                    .item-title.label 运费
                    .item-input.bule.right {{data.couponPrice||"无"}}
                .item-row.row.between(v-if="data.state  == 1")
                    .item-title.label(v-if="") 订单总价
                    .item-input.bule.right   {{data.productPrice}}
                .item-row.bg-gray
                    .item-title.label 优惠券折扣
                    .item-input  {{data.couponPrice||"无"}}
                .item-row.bg-gray.red
                    .item-title.label 实际付款
                    .item-input  {{data.totalPrice}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 兑换码
                    .item-input.bule   {{data.fetchCode}}
                .item-row(v-if="data.state  == 0")
                    .item-title.label 下单时间
                    .item-input.bule   {{data.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 支付时间
                    .item-input.bule   {{data.paymentTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 4")
                    .item-title.label 退款时间
                    .item-input.bule   {{data.refundTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 地址
                    .item-input.bule   {{data.deliveryAddress}}
            .diffent(v-if="data.mark=='JIUDIAN'||data.mark=='JINGDIAN'")
                .item-row.row.between(v-if="data.state  == 1")
                    .item-title.label(v-if="") 订单总价
                    .item-input.bule.right   {{data.productPrice}}
                .item-row.bg-gray
                    .item-title.label 优惠券折扣
                    .item-input  {{data.couponPrice||"无"}}
                .item-row.bg-gray.red
                    .item-title.label 实际付款
                    .item-input  {{data.totalPrice}}
                .item-row(v-if="data.mark=='JIUDIAN'")
                    .item-title.label  入住时间
                    .item-input.bule   {{data.startDate|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.mark=='JIUDIAN'")
                    .item-title.label 离开时间
                    .item-input.bule   {{data.endDate|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 兑换码
                    .item-input.bule   {{data.fetchCode}}
                .item-row(v-if="data.state  == 0")
                    .item-title.label 下单时间
                    .item-input.bule   {{data.createTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 支付时间
                    .item-input.bule   {{data.paymentTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 4")
                    .item-title.label 退款时间
                    .item-input.bule   {{data.refundTime|formatDate("YYYY年MM月DD  hh:mm:ss")}}
                .item-row(v-if="data.state  == 1")
                    .item-title.label 地址
                    .item-input.bule   {{data.deliveryAddress ||"无"}}
            .inner
                f7-button(color="red",fill="",v-if="data.state == 0",@click.prevent="pay_page") 支付
                f7-button(color="red",fill="",v-if="data.state == 1",@click.prevent="next_page") 再次购买




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import mo from "moment"



    export default {
        data () {
            return {
                name: "dingdan-detail",
                data:{},
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
                    .then(function(data){
                        if(data.resCode==1){
                            throw integral.message;
                        }
                        m.data = data.data;
                        m.productList=data.data.productList
                    })
                    .catch(function(err){
                        f7.alert(err);
                    })
                ;
            },
            pay_page:function (e) {
                var m = this;
                m.routeTo(`/dingdan-payment/${ m.id}/`)
            },
            next_page:function (e) {
                var m = this;
                m.req("pagegroup/getpagegroup",{id: m.pid,noCache:true})
                    .then(function (data) {
                        m.data = data.data;
                        if (data.resCode) {
                            //列表信息获取失败
                            throw data.message;
                        }
                        if( m.data.mark == "JIUDIAN"){
                            m.$router.loadPage(`/jiudian-index-page/${m.pid}/JIUDIAN/`)
                        }else if(m.data.mark == "MEISHI"){
                            m.$router.loadPage(`/meishi-index-page/${ m.pid}/MEISHI/`)
                        }
                        else if(m.data.mark == "JINGDIAN"){
                            m.$router.loadPage(`/jingdian-products-detail/${ m.pid}/JINGDIAN/${m.mid}/`)
                        }
                        else if(m.data.mark== "TECHAN"){
                            m.$router.loadPage(`/techan-index-page/${ m.pid}/TECHAN/`)
                        }

                    },
                    function (err) {
                        f7.alert("列表信息获取失败")
                    })
                ;
            },

        },

        filters:{
            mark2label(mark){
                return (vars.dic.type_id2type[mark]||{label:"商家"}).label;
            }
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
