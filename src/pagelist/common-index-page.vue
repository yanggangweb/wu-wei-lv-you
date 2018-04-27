<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white {{vars.app_name}}
            f7-nav-right
                f7-link(icon="i-fill85",@click="collectToggle(elem,mark)")
                f7-link(icon="i-iconziti17",open-panel="right")


        span(v-page-content-bg="pageBg")

        f7-block
            div.phone-link-cont
                f7-link(icon="i-dianhua",@click="phoneCall('10086')")

            h4.item-name {{elem.name}}
            span.addr(v-show="elem.address")
                i.icon.i-dingwei2.upfloat-2
                |{{elem.address}}

            f7-grid.button-line
                f7-col
                    .inn
                        i.icon.i-introduction
                        |景点介绍
                f7-col
                    .inn
                        i.icon.i-chanpin
                        |产品预订

                f7-col
                    .inn
                        i.icon.i-tupian
                        |商家图库
            f7-grid.button-line-tab
                f7-col
                    f7-link(:class="{active:swiper_index == 0}",@click="swiper_index = 0")
                        i.icon.i-ditu
                        | 地图导览
                f7-col
                    f7-link(:class="{active:swiper_index == 1}",@click="swiper_index = 1")
                        i.icon.i-youji1
                        | 旅游游记

                f7-col
                    f7-link(:class="{active:swiper_index == 2}",@click="swiper_index = 2")
                        i.icon.i-quanjing
                        | 360全景


            .swiper-wrapper
                f7-swiper(:params="{onInit:sw_init}")
                    f7-swiper-slide
                        .el-box.swiper-no-swiping
                            #amp_wrapper
                    f7-swiper-slide
                        .el-box.imgbox
                            img(:src="defaultImg")
                    f7-swiper-slide
                        .el-box 敬请期待



</template>

<script type="text/ecmascript-6">
    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import _ from "lodash";
    import defaultImg from "../assets/default.jpg";
    export default {
        mixins: [vars.mixin_1],
        data () {

            return {
                name: "item-index-page",
                pageBg:vars.null_img,
                swiper_index: 0,
                defaultImg,
                elem:{},
                mark:""
            }
        },

        computed: {},

        methods: {
            sw_init: function (swiper) {
                var m = this;
                m.swiper = swiper;
                swiper.on("slideChangeEnd", function () {
                    m.swiper_index = swiper.activeIndex;
                })
            }
        },

        watch: {
            swiper_index: function (v) {
                var m = this;
                m.swiper.slideTo(v);
            }
        },

        mounted: function () {
            var m = this;


            f7.showPreloader()
            m.req("web/business!showBusinessDetail.action", {code: m.$route.params.id}).then(
                function (data) {
                    f7.hidePreloader()

                    if(!data.success) {
                        f7.alert("数据出错")
                        return;
                    }

                    m.elem = data;

                    lazyAMapApiLoaderInstance.load().then(() => {
                        m.map = new AMap.Map(
                            'amp_wrapper',
                            {
                                center: new AMap.LngLat(data.longitude, data.latitude)
                            }
                        );

                        m.map.setZoom(12);

                        new AMap.Marker({
                            map:m.map,
                        })


                    });

                },
                function () {
                    f7.hidePreloader()

                }
            );

        },

        components: {},

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:item-index-page;

    .toolClass();

    .@{name}{

        #amp_wrapper{
            height: 100%;
        }

        .swiper-wrapper{
            margin-top:@page-edge;
            .swiper-container{
                width: 100%;
            }

            .el-box{
                width: 100%;
                .lineh(270px);
                background: @cl_flat_light;
                text-align: center;


                &.imgbox{
                    img{
                        display: block;
                        &:extend(.expandin);
                        object-fit: cover;
                    }
                }
            }
        }

        .phone-link-cont{

            text-align: right;
            >a{
                ._size_lh(3em);
                display: inline-block;
                background-color: rgba(51, 73, 96, 0.79);
                border-radius: 50%;
                color: #ffffff;
                text-align: center;
            }
        }

        .item-name{
            text-align: center;
            color: @main_color_light;
            font-size: 1.2rem;
            text-shadow: @dark-shaow;
            margin-bottom: @page-edge/2;
        }

        .addr{
            display: block;
            text-align: center;
            color: #ffffff;
            text-shadow: @dark-shaow;
            .icon{
                font-size: 1.5em;
                color: @cl-red;
                margin-right: 0.25em;
            }
        }

        .button-line{
            margin-top:@page-edge*3;
            text-align: center;
            color: #ffffff;
            font-size: 0.8rem;
            .icon{
                display: block;
                color: #22D73C;
                margin-bottom: -0.25rem;

                margin-top: -2rem;
            }
            .inn{
                padding:@page-edge/4;
                position: relative;
                padding-top: 50%;
                &:after{
                    content: "";
                    position: absolute;
                    top: 0;
                    width: 100%;
                    padding-top: 100%;
                    z-index: -1;
                    left: 0;
                    background-color: #555;
                    min-height: 66px;
                    box-sizing: border-box;
                    opacity:0.6;

                }
            }
        }

        .button-line-tab{
            text-align: center;
            margin-top:@page-edge * 3;
            text-shadow: @dark-shaow;
            a{
                font-size: 0.9rem;
                color: #fff;
                padding-bottom: 0.25em;
                cursor: default !important;
                &.active{
                    color: @main_color_light;
                    border-bottom: 1px solid @main_color_light;
                }
            }
            .icon{
                font-size: 0.9rem;
                margin-right: 0.5em;
            }
        }
    }



</style>
