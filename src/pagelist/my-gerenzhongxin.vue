<template type="text/html" lang="jade">
    f7-page(:class="[name]")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的

        f7-list.list-group.no-before-border
            f7-list-group
                f7-link.item-img(href="/personal-information/")
                    .item-title-row
                        img.tuxiang-img(:src="vars.null_img",v-if="!_get(account,'headImg')")
                        img.tuxiang-img(:src="vars.oss_url_base + _get(account,'headImg')",v-if="_get(account,'headImg')")
                    .item-title-row
                        .item-title( v-if="_get(account,'name')") {{ _get(account,'nick')}}
                        .item-title( v-if="!_get(account,'name')") 请输入昵称
                    .item-title-row
                        .item-title.font-size( v-if="_get(account,'sign')") 签名：{{_get(account,'sign')}}
                        .item-title.font-size(v-if="!_get(account,'sign')") 签名：请输入签名

        .main-box
            f7-list.list-top
                f7-list-item
                    .coupons-money(@click="routeTo(`/my-shoucang/${_get(account,'id')}/`)")
                        .enshrine
                            p   {{_get(category,'collectNum','0')}}
                            p.flex-icon
                                //i.icon.i-shoucang
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-shoucang3")
                                b 收藏
                        .divide-line
                        .coupons(@click="routeTo(`/my-jifen/${_get(account,'id')}/`)")
                            p {{_get(category,'totalScore','0')}}
                            p.flex-icon
                                //i.icon.i-qiaquan
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-jifen2")
                                b 积分
                        .divide-line
                        .enshrine(@click="routeTo(`/my-pinglun/${_get(account,'id')}/`)")
                            p {{_get(category,'merchantNum','0')}}
                            p.flex-icon
                                //i.icon.i-pinglun2
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-pinglun4")
                                b 评论

            f7-list(media-list)
                f7-list-item
                    h3
                        f7-link(@click="routeTo(`/my-qiandao/${_get(account,'id')}/`)")
                            span
                                //i.icon.i-qiandao1
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-qiandao2")
                                b 签到

                            i.icon.i-lp_speaker
            f7-list(media-list)
                f7-list-item
                    h3
                        f7-link(@click="routeTo(`/my-dingdan/${_get(account,'id')}/`)")
                            span
                                //i.icon.i-dingdan
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-dingdan1")
                                b 订单
                            i.icon.i-lp_speaker
                f7-list-item
                    h3
                        f7-link(@click="routeTo(`/my-kabao/${_get(account,'id')}/`)")
                            span
                                //i.icon.i-qinabao-youka
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-qiabao1")
                                b 卡包
                            i.icon.i-lp_speaker
            f7-list(media-list)
                f7-list-item
                    h3
                        f7-link(@click="routeTo(`/my-tuku/${_get(account,'id')}/`)" )
                            span
                                //i.icon.i-tupian5
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-tupian7")
                                b 图片
                            i.icon.i-lp_speaker
                f7-list-item.you-ji
                    h3
                        f7-link(@click="routeTo(`/my-youji/${_get(account,'id')}/`)")
                            span
                                //i.icon.i-youjigonglv
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-youji2")
                                b 奇遇
                            i.icon.i-lp_speaker
                f7-list-item
                    h3
                        f7-link(href="/my-shezhi/")
                            span
                                //i.icon.i-shezhi1
                                svg.iconfont(aria-hidden="true")
                                    use(xlink:href="#i-shezhi2")
                                b 设置

                            i.icon.i-lp_speaker





</template>
<script type="text/ecmascript-6">

    import null_img from "../assets/tuxiang.jpg";
    import _ from "lodash";
    import defaultImage from "../assets/default.jpg";
    import defaulticonfont from "../assets/iconfont/iconfont.js";

    export default {
        data () {
            return {
                name: "my-gerenzhongxin",
                data: {},
                null_img,
                category:{},
            }

        },
        computed: {
            account(){return this.$store.state.user;}
        },
        methods: {},
        mounted: function () {
            var m = this;

            m.__try_login()
                .then(function(){
                    m.req("account/relatedInfo",{noCache:true,})
                        .then(function (category) {
                            if (category.resCode) {
                                //列表信息获取失败
                                throw category.message;
                            }
                            m.category =category;
                            vars.root.$on("comment-fresh",m.category.merchantNum);

                        })
                        .catch(resp=>{
                            //vars.toast(vars.trimErrorMessage(resp));
                        })
                    ;
                })

                .catch(resp=>{
                    m.goback();
                })
            ;
        },
        beforeDestroy:function(){
            var m = this;
            vars.root.$off("comment-fresh",m.category.merchantNum);
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();
    .my-gerenzhongxin{


        .page-content{
            display: flex;
            flex-direction: column;
            background-color: @cl_flat_yellow2;


            .main-box{
                background-color: #f6f6f6;
                flex: 1;
            }
        }


        overflow: auto;
        height: 100%;
        border-left: none;
        border-right: none;
        box-sizing: border-box;
        text-align: justify;
        .item-title{
            font-size: 1rem;
            line-height: 1.6rem;
        }
        .font-size{
            font-size: 0.8rem;
        }
        .list-block {
            margin: 15px 0;
            .item-inner:after {
                width: 96%;
                background-color: #efefef;
            }
        }
        .contacts-block{
            margin:0 ;
        }
        .list-block-group{

            ul{
                padding:@page-edge;
                background-color: @cl_flat_yellow2;

                .item-title-row{
                    display: flex;
                    display:-webkit-flex;
                    -webkit-justify-content:center;
                    justify-content:center;
                    .tuxiang-img{
                        width: 4rem;
                        height:4rem;
                        border-radius: 50%;
                        margin-bottom: @page-edge ;


                        .item-inner:after{
                            background-color:#fff;
                        }
                    }
                }
                .item-inner:after {
                    background-color: transparent;
                }

            }
        }
        .list-top{
            margin-top: 0;
        }
        .coupons-money{
            display: flex;
            display:-webkit-flex;
            align-items: center;
            -webkit-justify-content:space-around;
            justify-content:space-around;
            padding: @page-edge/2;
            width: 100%;
            color:#656565;
            .divide-line {
                width: 1px;
                height: 3rem;
                background-color: #efefef;
            }
            p{
                font-size: 0.9rem;
                text-align: center;
                &:first-child{
                    font-size: 1rem;
                    color:@cl_flat_green1;
                }
                .iconfont{
                    width: 1.6rem;
                    height: 1.6rem;
                    font-size: 1rem;
                    vertical-align: middle;
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

                }
                &.flex-icon{
                    display: flex;
                    align-items: center;
                    align-content: center;
                }
            }
        }
        .item-inner {
            padding: 0;

            h3 {
                margin: 0;
                a {
                    color: @cl_flat_black;
                    display: flex;
                    align-items: center;
                    .iconfont{
                        width: 3rem;
                        height: 2rem;
                        font-size: 1.4rem;
                        vertical-align: middle;
                    }
                    span{
                        flex: 1;
                        vertical-align: middle;


                        i{
                            display: inline-block;
                            text-align: left;
                            font-size: 1.4rem;
                            width: 3rem;
                            text-align: center;
                            &.i-qiandao1 {
                                color: @cl_flat_green;
                            }
                            &.i-dingdan{
                                color: @cl_flat_blue;
                            }
                            &.i-qinabao-youka {
                                color: @cl_flat_blue;
                            }
                            &.i-tupian5{
                                color: @cl_flat_green;
                            }
                            &.i-youjigonglv{
                                color: @cl_flat_orange;
                            }
                            &.i-pinglun{
                                color: @cl_flat_yellow;
                            }
                            &.i-shezhi1{
                                color: #3f5c6e;
                            }
                        }
                        b{
                            /*vertical-align:text-top;*/
                            color:#666;
                            font-size: 1rem;
                        }

                    }
                    > i {
                        font-size: 1.2rem;
                        text-align: center;
                        color: @cl_flat_light;


                    }

                }
            }
        }
        .list-group{
            margin: 0;
        }


    }
    [router="/my-gerenzhongxin/"]{
        #main-view {
            > .navbar:before{
                background-color: transparent;
            }
        }
    }
</style>
