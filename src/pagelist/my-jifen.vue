<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的积分
            f7-nav-right
                f7-link(icon="i-wenhao",@click="routeTo(`/jifen-regular/${id}/`)")
        .card-list
            .xinhuan
                f7-list(v-if="score")
                    f7-list-item.jifenhj {{_get(score,"totalScore","0") - _get(score,"loseScore","0")}}
                f7-list(v-if="!score")
                    f7-list-item.jifenhj  0
            .icon-grid
                .icon-cell
                    p
                        //i(class="icon i-dingdan")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-denglu")
                    p(v-if="score") 登录({{_get(score,"loginScore","0")}})
                .icon-cell
                    p
                        //i(class="icon i-qiandao1")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-qiandao2")
                    p(v-if="score") 签到({{_get(score,"signScore","0")}})
                .icon-cell.right-border
                    p
                        //i(class="icon i-shoucang")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-shoucang4")
                    p(v-if="score") 收藏({{_get(score,"collectScore","0")}})
                .icon-cell.bottom-border
                    p
                        //i(class="icon i-pinglun1")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-pinglun5")
                    p(v-if="score") 评论({{_get(score,"commentScore","0")}})
                .icon-cell.bottom-border
                    p
                        //i(class="icon i-jiaoyi")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-jiaoyi2")
                    p(v-if="score") 交易({{_get(score,"dealScore","0")}})
                .icon-cell.right-border.bottom-border
                    p
                        //i(class="icon i-fenxiang")
                        svg.iconfont(aria-hidden="true")
                            use(xlink:href="#i-fenxiang3")
                    p(v-if="score") 分享({{_get(score,"shareScore","0")}})
            .integral-card(v-if="list.length")
                h3.jfdh 积分兑换
                f7-list(v-for="item in list")
                    f7-list-item.contacts
                        .item-media
                            //f7-link(icon="i-youhuiquan1")
                            f7-link(v-if="item.type==0",icon="i-zhekou")
                            f7-link(v-if="item.type==1",icon="i-xianjin")
                        .content-dail
                            h3 {{item.name}}
                            p(v-if="item.type==0")
                                span 使用价{{item.usePrice}}元 打{{item.discountRate}}折
                            p(v-if="item.type==1")
                                span 使用价{{item.usePrice}} 优惠价{{item.discountedPrice}}元
                            p.flex-content
                                span.flex-left 有效期 {{item.expireTime|formatDate("YYYY-MM-DD")}}
                                span.relative(:data-id="item.id")
                                    f7-button.button-fill(@click="listClick",:class="conversionClass") 兑换({{item.score}})

            .no-card(v-if="!list.length")
                h3.jfdh 积分兑换
                .no-product
                    p
                        i(class="icon i-jifenduihuan")
                    p 无积分兑换活动


</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-jifen",
                null_img: vars.null_img,
                data:{
                },
                score:"",
                listclick:"",
                list:"",
                conversionClass:{
                    conversion_false:false,
                    //conversion_true:true,
                },
            }
        },
        methods: {
            listClick:function (e) {
                var m=this;
                var li =m.$(e.target).parents(".relative");
                var id = li.attr("data-id");
                var para = {accountId:m.id, couponId:id,noCache:true};
                m.req("scoreexchange/exchange",para).then(
                    function (data) {
                        m.data = data;
                        vars.root.$emit("comment-fresh",{accountId:m.id, couponId:id,noCache:true});
                        if(data.resCode) {
                            throw data.message;
                        }
                        m. _init();
                        f7.alert("积分兑换成功")
                    },
                    function (err) {
                    },

                );
            },
            //界面初始化
            init: function () {
                var m = this;
                m.req("score/score",{noCache:true}).then(
                    function (score) {
                        m.loginScore = score.loginScore;
                        m.score = score.score;
                        m.collectScore =score.collectScore;
                        m.hotelService = score.hotelService;
                        vars.root.$emit("score-fresh", {noCache: true});
                        m.setBg(score.score);
                        if (score.resCode) {
                            //列表信息获取失败
                            throw data.message;
                        }
                        return m.score;
                    },
                    function (err) {
                    }
                );
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
                m.req("coupon/list",{ noCache:true,...m._pg.getPara()}).then(
                    function (data) {
                        m.data = data;
                        m.list=data.list;

                        m.list.forEach(function (item) {
                            if(m.score.totalScore-m.score.loseScore >= item.score){
                                m.conversionClass.conversion_false=false
                            }else {
                                m.conversionClass.conversion_false=true
                            };

                        });

                        m._get(data,"list.productId");
                        if (data.resCode) {
                            //列表信息获取失败
                            f7.alert("列表信息获取失败")
                        }
                    },
                    function (err) {
                    })
                ;
            }
        },
        mounted: function () {
            var m = this;
            m.id=m.$route.params.id;
            m.init();
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    @import "../styles/tool";
    @import "../styles/vars";

    .my-jifen{
        background-color: #0AB70E;
        .card-list{
            > .integral-card {
                background-color: @cl_flat_light;
                margin: 0;
                padding-bottom: 1px;
                .list-block{
                    margin: @page-edge/2 0;


                }
                &:last-child .list-block{
                    margin-top: 0;

                }
                &:last-child :last-child{
                    margin-bottom: 0;

                }



            }
            .item-media{
                .icon{
                    display: block;
                    object-fit: cover;

                    height: 60px;
                    font-size: 60px;
                    vertical-align: middle;
                    line-height: 60px;
                    &.i-xianjin{
                        color:@cl_flat_yellow;
                    }
                    &.i-zhekou{
                        color: @cl_flat_blue2;
                    }
                }

            }
            .content-dail{
                word-break: break-all;
                word-wrap:break-word;
                white-space: normal;
                margin-left: @page-edge;
                padding: 0;
                width: 100%;
                h3{
                    font-size: 1rem;

                }
                p{
                    display: flex;
                    -ms-flex-align: center;
                    align-items: center;
                    font-size: 0.8rem;
                    line-height: 25px;
                    color:@cl_flat_gray1;
                    b{
                        color: @cl_flat_red1;
                    };
                }
                .flex-content{
                    display: flex;
                    -ms-flex-align: center;
                    align-items: center;
                    .flex-left{
                        flex: 1;
                    }
                    .conversion_false{
                        background-color: #8a8a8a;
                    }
                    .button{
                        background-color: @cl_flat_blue2;
                        padding: 0 5px;
                    }
                }
            }
        }
        .jfdh{
            font-size: 1rem;
            padding: @page-edge 0 @page-edge @page-edge;
            background-color: @cl_flat_gray3;
            height: 1.4rem;
            line-height: 1.4rem;

        }
        .jifenhj{
            background-color: #ffa62e;
            color:#fff;
            padding: @page-edge*2 0;
            justify-content: center;
            display: flex;
        }
        .xinhuan{
            margin: 0;

            .list-block{
                margin: 0;
            }
            .item-inner{
                font-size: 2rem;
            }
        }
        .icon-grid{
            background-color: #fff;
            padding:0 @page-edge/2;
            display: flex;
            display:-webkit-flex;
            flex-flow:row wrap;

            .iconfont{
                width: 2rem;
                height: 2rem;
                font-size: 1rem;
                vertical-align: middle;
            }

            i{
                display: block;
                text-align: center;
                font-size: 1.2rem;
                &.i-qiandao1{
                    color: @cl_flat_green;
                }
                &.i-dingdan{
                    color: @cl_flat_blue1;
                }
                &.i-shoucang{
                    color: @cl_flat_yellow;
                }
                &.i-pinglun1{
                    color: @cl_flat_yellow;
                }
                &.i-jiaoyi{
                    color: @cl_flat_red;
                }
                &.i-fenxiang{
                    color: @cl_flat_blue1;
                }

            }

            .icon-cell{
                padding: @page-edge 0;
                font-size: 1rem;
                border-bottom: 1px solid @cl_flat_gray2;
                border-right: 1px solid @cl_flat_gray2;
                -webkit-flex-basis:calc(~"100%/3 " - 1px);
                flex-basis:calc(~"100%/3" - 1px);
                text-align: center;
                -webkit-justify-content:space-around;
                justify-content:space-around;
                p{
                    padding: @page-edge/2 0;
                }


            }
            .right-border{
                border-right:none;
            }
            .bottom-border{
                border-bottom: none;
            }
        }

        .no-card{
            background-color: @cl_flat_gray3;
            height: calc(~"50vh" - (@top-bar-height) );
            .jfdh{
                font-size: 1rem;
                padding: @page-edge 0 @page-edge @page-edge;
                height: 1.4rem;
                line-height: 1.4rem;
                border-bottom: 1px solid @cl_flat_gray2;
            }
            p{
                text-align: center;
                font-size: 1.4rem;
                color: @cl_flat_gray;
                .icon{
                    margin-top: @page-edge;
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
        .page-content{
            background-color: #ffa62e;
        }


    }
    [router="/my-jifen/"]{
        #main-view {
            > .navbar:before{
                background-color: transparent;
            }
        }
    }
</style>






