<template type="text/html">
    <f7-page class="jifen-regular">
        <f7-navbar back-link="" color="block" sliding>
            <f7-nav-left>
                <f7-link icon="i-fanhui" back=""></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                积分规则
            </f7-nav-center>
        </f7-navbar>
        <f7-list media-list>
            <f7-list-item>
                <p class="left-line-blue">
                    积分能给我们带来什么？
                </p>
            </f7-list-item>
            <f7-list-item>
                <h5 class="gray-font">
                    &nbsp;&nbsp;&nbsp;&nbsp;小小的积分可以为你在购买商品时赢得大大的福利，通过积分可以兑换平台内各商家推出的优惠券（包括折扣券和现金券）。当你在平台内购买商品时如果订单价格满足优惠券的使用价格，那么你所提交订单将会为你减免相应的费用。
                </h5>
            </f7-list-item>
        </f7-list>
        <f7-list>
            <f7-list-item>
                <p class="left-line-yellow">
                    那我该如何赚取积分？
                </p>
            </f7-list-item>
            <f7-list-item>
                <h5 class="gray-font">
                    以下是在平台内的各种行为和相应积分对照表:
                </h5>
            </f7-list-item>
            <f7-list-item>
                <div class="coupons-regular">
                    <div class="enshrine">
                        <p>
                            <i class="icon i-pinglun3"></i>
                        </p>
                        <p class="gray-font">
                            登录+<span class="font-red" v-html="_get(integral.scorerule,'0','0')"></span>分
                        </p>
                    </div>
                    <div class="divide-line"></div>
                    <div class="enshrine">
                        <p>
                            <i class="icon i-shoucang2"></i>
                        </p>
                        <p class="gray-font">
                            收藏+<span class="font-red" v-html="_get(integral.scorerule,'1','0')"></span>分
                        </p>
                    </div>
                    <div class="divide-line"></div>
                    <div class="enshrine">
                        <p>
                            <i class="icon i-pinglun"></i>
                        </p>
                        <p class="gray-font">
                            评论+<span class="font-red" v-html="_get(integral.scorerule,'2','0')"></span>分
                        </p>
                    </div>
                </div>
            </f7-list-item>
            <f7-list-item>
                <div class="coupons-regular">
                    <div class="enshrine">
                        <p>
                            <i class="icon i-jiaoyiguanli"></i>
                        </p>
                        <p class="gray-font">
                            交易+<span class="font-red" v-html="_get(integral.scorerule,'3','0')"></span>分
                        </p>
                    </div>
                    <div class="divide-line"></div>
                    <div class="enshrine">
                        <p>
                            <i class="icon i-iconziti17"></i>
                        </p>
                        <p class="gray-font">
                            分享+<span class="font-red" v-html="_get(integral.scorerule,'4','0')"></span>分
                        </p>
                    </div>
                    <div class="divide-line"></div>
                    <div class="enshrine">
                        <p>
                            <i class="icon i-youji"></i>
                        </p>
                        <p class="gray-font">
                            发表游记+<span class="font-red" v-html="_get(integral.scorerule,'5','0')"></span>分
                        </p>
                    </div>
                </div>
            </f7-list-item>
            <f7-list-item>
                <div class="coupons-regular width-regular">
                    <div class="enshrine">
                        <p>
                            <i class="icon i-tupian1"></i>
                        </p>
                        <p class="gray-font">
                            上传图片+<span class="font-red" v-html="_get(integral.scorerule,'6','0')"></span>分
                        </p>
                    </div>
                    <div class="divide-line"></div>
                </div>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import defaulticonfont from "../assets/iconfont/iconfont.js";

    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "jifen-regular",
                data: {},
                scorerule: {},
                integral: {},
                signList: {},
            }
        },
        methods: {
            //界面初始化
            init: function (data) {
                var m = this;
                m.req("score/scorerule", {})
                    .then(function (integral) {
                        m.integral = integral;
                        if (integral.resCode == 1) {
                            throw integral.message;
                        }
                    })
                    .catch(function (err) {
                    })
                ;

            },
        },
        mounted: function () {
            var m = this;
            m.init();
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .jifen-regular{

        .list-block {
            margin: 0;
        }
        .sign-title {
            background-color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: @page-edge 0;
            .icon {
                display: inline-block;
                font-size: 1.4rem;
                width: 3rem;
                height: 2rem;
                text-align: center;

            }
        }

        .coupons-regular{
            display: flex;
            display:-webkit-flex;
            align-items: center;
            -webkit-justify-content:space-around;
            justify-content:space-around;
            padding: @page-edge/2;
            width: 100%;
            .divide-line {
                width: 1px;
                height: 3rem;
                background-color: #efefef;
            }
            .enshrine{
                width: calc(~"100%/3" - (1px));
            }

            p{
                font-size: 0.9rem;
                text-align: center;
                &:first-child{
                    font-size: 1rem;
                    color:@cl_flat_green1;
                }
                i.icon, i.mapicon {
                    font-size: 1.2rem;
                    margin-right: @page-edge/2;
                    &.i-shoucang {
                        color: @cl_flat_yellow;
                        fill: currentColor;
                    }
                    &.i-qiaquan {
                        color: @cl_flat_red;
                    }
                    &.i-pinglun2{
                        color: @cl_flat_orange;
                    }
                    &.i-wode {
                        color: @cl_flat_orange;
                    }
                    &.i-qiandao {
                        color: @cl_flat_blue;
                    }
                    &.i-iconfontshoucang1 {
                        color: @cl_flat_yellow;
                    }
                    &.i-tupian1 {
                        color: @cl_flat_yellow;
                    }
                    &.i-pinglun {
                        color: @cl_flat_yellow;
                    }
                    &.i-jiaoyiguanli {
                        color: @cl_flat_blue;
                    }
                    &.i-youji {
                        color: @cl_flat_green1;
                    }
                    &.i-iconziti17 {
                        color: @cl_flat_orange;
                    }
                    &.i-jifen {
                        color: @cl_flat_orange;
                    }

                }
            }
            &.width-regular{
                justify-content: flex-start;
            }

        }
        .gray-font{
            color: #7f7f7f;
            .font-red{
                color: @cl_flat_red;
            }
        }
        .left-line-blue{
            border-left: 2px solid #26b0f8;
            padding-left: @page-edge;
        }
        .left-line-yellow{
            border-left: 2px solid #f18b5a;
            padding-left: @page-edge;
        }


    }

</style>


