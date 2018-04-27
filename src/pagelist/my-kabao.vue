<template type="text/html">
    <f7-page :class="[name]">
        <f7-navbar back-link="" color="block" sliding>
            <f7-nav-left>
                <f7-link icon="i-fanhui" back=""></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                我的卡包
            </f7-nav-center>
        </f7-navbar>

        <f7-block>
            <div class="card-list" v-if="data.list">
                <div class="header" v-if="data.list.length">优惠券</div>

                <div class="total-main">
                    <div class="text-main" v-for="item in data.list">
                        <div class="text-title">{{ item.name}}</div>
                        <div class="font-style" v-if="item.type==0"><b>{{item.discountRate*10}}折优惠</b>&nbsp;扣折券</div>
                        <div class="font-style" v-if="item.type==1"><b>优惠价{{item.discountedPrice}}元</b>&nbsp;优惠券</div>
                        <div class="bo-lang"></div>
                        <div class="absolute">立即<br>使用</div>
                        <div class="title-text">
                            <f7-link icon="icon i-21">
                                {{item.rule}}
                            </f7-link>
                        </div>
                        <div class="title-next">
                            <f7-link icon="icon i-21">
                                使用时间：即日起至{{item.expireTime|formatDate("YYYY-MM-DD")}}
                            </f7-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="unheader" v-if="!data.list||data.list ==''">
                <f7-block class="no-product">
                    <p>
                        <i class="icon i-ku"></i>
                    </p>
                    <p>
                        你还没有折扣券和现金券，请添加！
                    </p>



                </f7-block>




            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-kabao",
                null_img:vars.null_img,
                data:{}
            }
        },
        methods: {
        },
        mounted: function () {
            var m = this;
            m.id=m.$route.params.id;
            if(!m._pg) {
                m._pg = new PG({
                    size:18,
                    onEofStatusChange:function(flag){
                        m.listEof = flag;
                    },
                    onReset:function(){
                        m.list = [];
                    }
                })
            }
            var para={
                accountId: m.id,
                noCache:true,
                ...m._pg.getPara()
            }
            m.req("scoreexchange/mycoupon", para)
                .then(function(data){
                    m.data = data;
                    if(data.resCode) {
                        throw data.message;
                    }
                })
                .catch(function(err){
                })
            ;
            m._commentFreshHandler = function(data){
                if(data.id == m.id) {
                    m._pg.reset()
                }
            }
            vars.root.$on("comment-fresh",m._commentFreshHandler)
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-kabao {
        .page-content {
            margin: 10px 0;
            position: relative;
            .card-list{
                background-color: #fff;
                padding-bottom: 1px;
                .header {
                    background-color: @cl_flat_gray3;
                    padding: @page-edge 0 @page-edge @page-edge;
                    font-size: 1rem;
                    height: 1.4rem;
                    line-height: 1.4rem;

                }
                .total-main {
                    padding-top: @page-edge*2 @page-edge;
                    .text-main{
                        border-radius: 8px;
                        margin: @page-edge;
                        border: 1px solid @cl_flat_gray;
                        position: relative;
                        .text-title{
                            padding:  @page-edge;
                            background-color: @cl_flat_blue;
                            border-top-left-radius: 7px;
                            border-top-right-radius: 7px;
                            font-size: 1rem;
                            color:#fff;
                        }
                        .font-style {
                            font-size: 1.6rem;
                            background-color: @cl_flat_blue;
                            margin-top: -1px;
                            color:#fff;
                            padding:@page-edge 0 ;
                            b{
                                font-size: 1rem;
                                padding-left:@page-edge ;
                            }
                        }
                        .bo-lang {
                            content: '';
                            border: 4px dotted @cl_flat_blue;
                            margin-top: -2px;
                        }
                        .absolute {
                            display: none;
                            position: absolute;
                            top:@page-edge*2;
                            right: @page-edge*1;
                            padding: 6px 12px;
                            border: 1px solid #fff;
                            border-radius: 50%;
                            color:#fff;
                        }
                        .item-content {
                            min-height: 24px;
                            .item-inner {
                                min-height: 24px;
                            }
                        }
                        .text-main {

                            background-color: @cl_flat_blue;
                            color: #fff;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                            .item-inner:after {
                                background-color: transparent;
                            }
                        }
                        .title-text {
                            background-color: #fff;
                            color: @cl_flat_blue2;
                            border-radius: 8px;
                            padding:@page-edge/2 0;
                            .item-inner:after {
                                background-color: transparent;
                            }
                            a{
                                font-size: 0.8rem;
                                color: @cl_flat_blue2;
                                padding:0 @page-edge ;

                                .icon {
                                    font-size: 0.8rem;
                                }
                            }
                        }
                        .title-next {
                            background-color: #fff;
                            color: @cl_flat_gray;
                            border-radius: 8px;
                            padding:@page-edge/2 0;
                            a {
                                font-size: 0.8rem;
                                color: @cl_flat_gray;
                                padding:0 @page-edge ;
                                .icon {
                                    font-size: 0.8rem;
                                }
                            }
                        }
                        .title-next + div {
                            border-bottom-left-radius: 8px;
                            border-bottom-right-radius: 8px;
                        }
                    }
                    .text-main:nth-child(2n+1){
                        .header {
                            background-color: @cl_flat_yellow;
                        }
                        .text-title{
                            background-color: @cl_flat_yellow;
                        }
                        .font-style{
                            background-color: @cl_flat_yellow;
                            b{
                                font-size: 1rem;
                                padding-left:@page-edge ;
                            }
                        }
                        .title-text{
                            color: @cl_flat_yellow ;
                            a {
                                color: @cl_flat_yellow;
                            }
                        }
                        .bo-lang{
                            border: 4px dotted @cl_flat_yellow;
                        }

                    }
                }

            }
        }
        .page-content{
            .content-block{
                margin: 0;
                padding: 0;
            }
            .unheader{
                background-color: #fff;
                margin: 0;
                height: calc(~"75vh" - (@page-edge + @top-bar-height));
                padding-top: 25vh;
                p{
                    text-align: center;
                    .icon{
                        display: flex;

                        font-size: 4rem;
                        -ms-flex-align: center;
                        align-items: center;
                        -webkit-justify-content:center;
                        justify-content:center;
                        color: @cl_flat_gray4;

                    }
                }

            }

        }

    }


</style>




