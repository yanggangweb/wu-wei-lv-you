<template type="text/html" lang="jade">
    f7-page(:class="[name]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(back-link="",sliding)
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                | 我的订单
        f7-subnavbar
            f7-tabs.header-tabs(tabbar)
                f7-link.link-active(@click="freshListByType('3')",active) 全部
                f7-link.link-active(@click="freshListByType('0')",) 待付款
                f7-link.link-active(@click="freshListByType('1')", ) 已付款
                f7-link.link-active(@click="freshListByType('4')",) 退款

        f7-list.no-list(v-show="!items.length",:class="[{listEnd:eof}]")
            f7-list-item
                .blank-placeholder.no-mt(style="margin-top:21px")
                    i.icon.i-zhaobudao
                    .label 暂无数据
        f7-block.list-show(:class="[{listEnd:eof}]")
            f7-tabs(animated)
                f7-tab#tab1
                    .plist
                        .custom-list(v-for="(item,index) in items",:data-id="item.merchantId",:id="item.id",:productId="item.productId",:state="item.state",:mark="item.mark",@click="allDetail(item)")
                            .img
                                img.lazy.lazy-fadeIn(slot="media",:src="vars.null_img", v-if="!item.cover")
                                img.lazy.lazy-fadeIn(slot="media",:src="vars.oss_url_base + item.cover |ossResize(120)", v-if="item.cover")
                            .content-dail
                                div
                                    .title-text {{item.productName}}
                                    a.right
                                        i.icon.i-shanchu(@click.stop="dele(index)")
                                .desc(v-if="_get(item,'productIntroduction')" v-html="_get(item,'productIntroduction')")
                                .serial(v-if="item.state=='1'&&item.fetchCode") 兑换码: {{item.fetchCode}}（泄露有风险）
                                .segmentation
                                    .price ￥
                                        b {{item.totalPrice}}
                                    .bot(:data-id="item.merchantId",:id="item.id",:productId="item.productId",:state="item.state",:mark="item.mark")
                                        .afthin(v-if="item.state=='2'",fill="") 申请退款
                                        .afthin(v-if="item.state=='3'",fill="") 拒绝退款
                                        .afthin(v-if="item.state=='4'",fill="") 已退款
                                        f7-button.thin(v-if="item.state=='9'",fill="", color="deeporange",@click.prevent.stop="genre_pay(item)") 继续下单
                                        f7-button.thin(v-if="item.state=='0'",fill="", color="deeporange",@click.prevent.stop="pay_page(item)") 支付
                                        f7-button.button-margin.margin-padding.thin.button-deeporange(v-if="item.state=='1'",fill="",@click.stop.prevent="refundsPay(item,items,index)") 申请退款
                                        f7-button.thin(v-if="item.state=='1'",fill="", color="deeporange",@click.prevent.stop="next_page(item)") 再次购买



</template>
<script type="text/ecmascript-6">
    import $ from "jquery";
    import PG from "../libs/ClassPG";
    import _ from "lodash";
    export default {
        data: function () {
            return {
                name: "my-dingdan",
                items:[],
                id: "",
                data: "",
                mark: "",
                typeid: "",
                accoundid: "",
                ind: "",
                eof: true,
                order:{}
            }
        },
        methods: {
            onInfiniteScroll: function () {
                var m = this;
                m.freshListByType();
            },
            dele: function (index) {
                var m = this;
                var ind = index;
                m.req("order/delete", {
                    noCache: true,
                    id: m.list[ind].id,
                })
                    .then(function (data) {
                        if (data.resCode) {
                            throw data.message;
                        }
                        vars.toast("删除订单成功")
                        m.list.splice(index, 1);
                        vars.root.$emit("order-fresh", {id: m.list[ind].id, noCache: true});
                    })
                    .catch(function (err) {
                        vars.toast(vars.trimErrorMessage(err))
                    })
                ;
            },
            allDetail:function (item) {
                var m=this;
                if(item.mark!=="XIANLU"){
                    m.routeTo(`/dingdan-detail/${item.id}/${item.merchantId}/`)
                }else if(item.mark=="XIANLU"){
                    m.routeTo(`/xianlu-detail/${item.id}/`)
                }

            },
            next_page: function (item) {
                var m = this;
                //var li = m.$(e.target).parents(".bot");
                var did = item.merchantId;
                var id = item.id;
                var mark = item.mark;
                if (mark == "JIUDIAN") {
                    m.routeTo(`/jiudian-index-page/${did}/JIUDIAN/`)
                } else if (mark == "MEISHI") {
                    m.routeTo(`/meishi-index-page/${did}/MEISHI/`)
                }
                else if (mark == "JINGDIAN") {
                    m.routeTo(`/jingdian-index-page/${did}/JINGDIAN/`)
                    // m.routeTo(`/jingdian-products-detail/${did}/JINGDIAN/${did}/`)
                }
                else if (mark == "TECHAN") {
                    m.routeTo(`/techan-index-page/${did}/TECHAN/`)
                }else if (mark == "XIANLU") {
                    m.routeTo(`/xianlu-index-page/${item.lineId}/TECHAN/`)
                }

            },
            refundsPay: function (item,array,index) {
                var m = this;
                m.req("order/refund",{id :item.id})
                    .then(function(data){
                        if(data.resCode==1){
                            throw data.message;
                        }
                        array.splice(index,1);
                        vars.toast("申请退款成功");
                    })
                    .catch(function(err){
                        vars.toast(vars.trimErrorMessage(err));
                    })
                ;

            },
            quan_pay: function (item) {
                var m = this;
                var id = item.id;
                var mark = item.mark;
                var state = item.state;
                var did = item.merchantId;
                if (state == "0") {
                    /*待付款*/
                    if (mark = "MEISHI") {
                        m.req("order/get", {id: id})
                            .then(function (data) {
                                if (data.resCode == 1) {
                                    throw integral.message;
                                }
                                m.data = data.data;
                                m.productList = data.data.productList;
                                var para = {
                                    noCache: true,
                                    merchantId: m.data.merchantId,
                                    comboId: m.data.comboId,
                                    totalPrice: _.sum(m.productList.map(el => el.price * el.quantity)),
                                    productIds: m.productList.map(el => el.id).join(","),
                                    copies: m.productList.map(el => el.quantity).join(",")
                                }
                                para = encodeURIComponent(JSON.stringify(para));
                                m.routeTo(`/meishi-order/${m.data.merchantId}/${m.data.mark}/${para}`);

                            })
                            .catch(function (err) {
                            })
                        ;
                    }
                    if(mark = "XIANLU"){
                        var m = this;
                        vars.xianlu_order_cache.orderLine = item.order;

                        m.routeTo(`/xianlu-payment/${item.code}/`)
                    }


                } else if (state == "9") {
                    /*未完成*/
                    if (mark = "MEISHI") {
                        m.routeTo(`/jump-meishi-order/${id}/${mark}`);
                    }
                    if (mark = "TECHAN") {
                        m.routeTo(`/jump-meishi-order/${id}/${mark}`);
                    }
                    if (mark = "XIANLU") {
                        m.routeTo(`/jump-meishi-order/${item.lineId}/XIANLU/`);
                    }

                } else if (state == "1") {
                    /*已支付*/

                    if (mark == "JIUDIAN") {
                        m.routeTo(`/jiudian-index-page/${did}/JIUDIAN/`)
                    } else if (mark == "MEISHI") {
                        m.routeTo(`/meishi-index-page/${did}/MEISHI/`)
                    }
                    else if (mark == "JINGDIAN") {

                        m.routeTo(`/jingdian-index-page/${did}/JINGDIAN/`)
                        // m.routeTo(`/jingdian-products-detail/${did}/JINGDIAN/${id}/`)
                    }
                    else if (mark == "TECHAN") {
                        m.routeTo(`/techan-index-page/${did}/TECHAN/`)
                    }
                    else if (mark == "XIANLU") {
                        m.routeTo(`/techan-index-page/${item.lineId}/XIANLU/`)
                    }

                }
            },
            genre_pay: function (item) {
                var m = this;
                var id = item.id;
                var mark = item.mark;
                var state = item.state;
                var did = item.merchantId;
                if (state == "0") {
                    /*待付款*/
                    if (mark = "MEISHI") {
                        m.routeTo(`/jump-meishi-order/${id}/${mark}`);
                    }

                }else if (state == "9") {
                    /*未完成*/
                    if (mark = "MEISHI") {
                        m.routeTo(`/jump-meishi-order/${id}/${mark}`);
                    }
                    if (mark = "TECHAN") {
                        m.routeTo(`/jump-meishi-order/${id}/${mark}`);
                    }

                } else if (state == "1") {
                    /*已支付*/

                    if (mark == "JIUDIAN") {
                        m.routeTo(`/jiudian-index-page/${did}/JIUDIAN/`)
                    } else if (mark == "MEISHI") {
                        m.routeTo(`/meishi-index-page/${did}/MEISHI/`)
                    }
                    else if (mark == "JINGDIAN") {
                        m.routeTo(`/jingdian-index-page/${did}/JINGDIAN/`)
                        // m.routeTo(`/jingdian-products-detail/${did}/JINGDIAN/${id}/`)
                    }
                    else if (mark == "TECHAN") {
                        m.routeTo(`/techan-index-page/${did}/TECHAN/`)
                    }

                }
            },
            togenre_pay: function (item) {
                var m = this;
                var id = item.id;
                m.req("order/get", {id: id})
                    .then(function (data) {
                        if (data.resCode == 1) {
                            throw integral.message;
                        }
                        m.data = data.data;
                        m.productList = data.data.productList;
                        var para = {
                            noCache: true,
                            merchantId: m.data.merchantId,
                            comboId: m.data.comboId,
                            totalPrice: _.sum(m.productList.map(el => el.price * el.quantity)),
                            productIds: m.productList.map(el => el.id).join(","),
                            copies: m.productList.map(el => el.quantity).join(",")
                        }
                        para = encodeURIComponent(JSON.stringify(para));
                        m.routeTo(`/meishi-order/${m.data.merchantId}/${m.data.mark}/${para}`);

                    })
                    .catch(function (err) {
                    })
                ;
            },
            pay_page: function (item) {
                var m = this;
                var id = item.id;
                if(item.mark!=="XIANLU"){
                    m.routeTo(`/dingdan-payment/${id}/`)
                }

                if(item.mark=="XIANLU"){

                    vars.xianlu_order_cache.orderLine = item;


                    m.routeTo(`/xianlu-payment/${item.code}/`)
                }
            },
            beforeanimation: function () {
                var m = this;
            },
            freshListByType: function (typeid) {
                var m = this;
                if(typeid){
                    var localStorage = window.localStorage;
                    localStorage.removeItem("typeid");

                    localStorage.setItem("typeid",typeid) ;
                }

                if(!typeid){
                    var localStorage = window.localStorage;
                    if(localStorage.typeid=="3"){
                        var typeid=3;
                    }
                    if(localStorage.typeid=="0"){
                        var typeid=0;
                    }
                    if(localStorage.typeid=="1"){
                        var typeid=1;
                    }
                    if(localStorage.typeid=="4"){
                        var typeid=4;
                    }
                }
                $('.header-tabs a').on('click', function () {
                    $(this).addClass("active").siblings().removeClass("active");
                    var listId = $('.header-tabs a.active');
                    var tab = listId.attr("data-tab");
                    if(m.pg){
                        m.pg.reset();
                    }
                });
                if (!m.pg) {
                    m.pg = new PG({
                        size: 10,
                        pageField: "pageNum",
                        sizeField: "pageSize",
                        onEofStatusChange: function (flag) {
                            m.eof = flag;
                        },
                        onReset: function () {
                            m.items = [];
                        }
                    });
                }
                var para = {
                    noCache: true,
                    type: typeid,
                    ...m.pg.getPara(),
                }

                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();
                m.req("order/list", para)
                    .then(
                        function (data) {
                            f7.hideProgressbar();
                            if(data.resCode) {
                                //列表信息获取失败
                                f7.alert("列表信息获取失败");
                                f7.hideProgressbar();
                                m.items = [];
                                return;
                            }
                            m.list= data.list;
                            var newList=m.list;
                            m.items = m.items.concat(newList);

                            if (!data.end) {
                                m.pg.step();
                                f7.attachInfiniteScroll(m.$pageContent);

                            } else {
                                m.pg.forceEof();
                            }
                        },
                        function (err) {
                            f7.hideProgressbar();
                        });
            },
        },
        mounted: function () {
            var m = this;
            m.$pageContent = m.find(".page-content");
            m.freshListByType(3);

        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-dingdan {
        .page-content{
            background-color: #fff;
        }

        .tabs-animated-wrap {
            height: auto;
        }
        @keyframes show-content
        {
            from {opacity: 0 }
            to {opacity: 1}
        }
        .no-list{
            z-index: 1000;
            position: relative;
            animation:show-content 15s;
            -moz-animation:show-content 15s;
            -webkit-animation:show-content 15s;
            -o-animation:show-content 15s;
            margin: 0;
            .item-content{
                .item-inner {

                    text-align: center;
                }
            }
            .no-mt{
                width: 100%;

            }
            ul:after {

                background-color: transparent;

            }
        }
        .header-tabs {
            text-align: center;
            font-size: 1rem;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            padding-top: @page-edge;
            margin-bottom: @page-edge*2;
            a.link-active {

                background-color: #fff;
                align-items: center;
                padding-top: 10px;
                text-align: center;
                margin: 0 auto;
                flex: 4;
                justify-content: center;
                span {
                    display: block;
                    border-right: 1px solid @cl_flat_gray;
                    margin-top: 8px;
                }
                &.active {
                    color: @cl_flat_green;
                    background-color: #fff;
                    align-items: center;
                    padding-top: 10px;
                    text-align: center;
                    margin: 0 auto;
                    flex: 4;
                    border-bottom: 3px solid #01BF9D;

                }
            }
            .last {
                span {
                    border-right: none;
                }
            }
        }

        .plist {
            @ih: 100px;
            margin-top: @page-edge/2;
            .item-content {
                padding: 0;
                margin-bottom: @page-edge;

                .content-dail{
                    p{
                        position: relative;
                        line-height:1.4rem;
                        height:1.4rem;
                        overflow : hidden;
                        -o-text-overflow: ellipsis;
                        text-overflow:  ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    }
                }
            }
            .custom-list{
                display: -ms-flexbox;
                display: flex;
                margin-bottom: 15px;
                -ms-flex-align: stretch;
                align-items: stretch;
                .img{
                    height: 7.2em;
                    width: 8em;
                    margin-right:@page-edge/2;
                    img{
                        display: block;
                        &:extend(.expandin);
                        border-radius:0;
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            h3 {
                text-align: left;
                font-weight: 400;
                margin-top: 0;
                margin-bottom: 0;
                font-size: 1rem;
            }
            .content-dail {
                flex: 1;
                //background-color: #f0f0f0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: 0.9rem;
                >div{
                    display: flex;
                    justify-content: space-between;
                    .title-text{
                        line-height:1.4rem;
                        height:1.4rem;
                        overflow : hidden;
                        -o-text-overflow: ellipsis;
                        text-overflow:  ellipsis;
                        -webkit-line-clamp: 1;
                    }
                    &.desc{
                        font-size: 0.8rem;
                        color: @cl_flat_gray1;
                        display: block;
                        position: relative;
                        line-height:1.4rem;
                        height:2.8rem;
                        overflow : hidden;
                        -o-text-overflow: ellipsis;
                        text-overflow:  ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        /* &:after{
                             content:'...';
                             font-weight:bold;
                             position:absolute;
                             bottom:0;
                             right:0;
                             padding:0 1.1rem 0px 0px;
                             background:#fff;
                         }*/

                    }
                    &.segmentation {
                        //display: flex;
                        align-items: center;
                        text-align: right;
                        .button-margin {
                            margin-right: 5px;
                        }
                        .margin-padding {
                            padding: 0 5px;
                        }
                        .afthin {
                            color: @cl_flat_green1;
                            border-color: transparent;
                            font-size: 0.9rem;
                        }
                        .button{
                            font-size: .8rem;
                            display: inline-block;
                        }
                        .button-deeporange{
                            background: #ff5722;
                        }
                        .price {
                            //flex: 1;
                            font-size: 0.8rem;
                            text-align: right;
                            padding: 0.2rem 0;
                            b{
                                color: @cl_flat_red;
                            }
                        }

                    }
                    &.serial {
                        font-size: 0.9rem;
                        color: @cl_flat_black;

                    }

                }
                .icon {
                    font-size: 1.2rem;
                    color: @cl_flat_greenn;
                }
            }



        }
        .content-block {
            background-color: #fff;
            margin: 0;
            margin-top: @page-edge;

            .no-product {
                margin: 0;
                height: calc(~"75vh" - (@top-bar-height * 2 + @page-edge));
                padding-top: 25vh;
                p {
                    text-align: center;
                    .icon {
                        display: flex;

                        font-size: 4rem;
                        -ms-flex-align: center;
                        align-items: center;
                        -webkit-justify-content: center;
                        justify-content: center;
                        color: @cl_flat_gray4;

                    }
                }

            }
            .page-content {
                padding-top: 0 !important;
                margin-top: @top-bar-height;
            }
            .subnavbar {
                padding: 0;
                font-size: 1rem;
                text-align: center;
                &:after {
                    background-color: transparent;
                }
            }

        }
        .subnavbar{
            padding: 0;
        }
        .infinite-scroll-preloader{
            .preloader {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-image: url("../assets/loading.png");
                background-position: 50%;
                background-size: 100%;

            }
            /*&:after{
                content: "正在加载";
                display: block;
                margin: 5px 0;
                color: #ccc;
            }*/

        }

        .listEnd{
            & + .infinite-scroll-preloader {
                .preloader {
                    display: none;

                }

                &:after{
                    display: none;
                }
            }
        }

    }
</style>

