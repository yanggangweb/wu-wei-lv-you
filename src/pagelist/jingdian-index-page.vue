<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white 景点
            f7-nav-right
                f7-link(@click="collectToggle(data,mark)")
                    i.icon(:class="{'i-fill85':!data.collected,'i-iconfontshoucang1':data.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")

        .body.shortcut-class
            .banner
                img(:src="vars.oss_url_base + got('elem.backGround')")

        f7-block
            div.phone-link-cont
                phone-call-icon(:phone="got('data.merchantInfo.mobile') || got('data.merchantInfo.phone')")


            h4.item-name {{elem.name}}
                i.icon.i-renzheng(v-if="elem.authState==5")
            h4.item-addr
                span.addr.flex-addr(v-show="elem.address")
                    i.icon.i-dingwei2.upfloat-2
                    b.bs {{elem.address}}
                .split-line
                div
                    f7-button.directTo(fill,color="blur",@click="directTo(elem)") 导航

            f7-grid.button-line
                f7-col
                    f7-link.inn(:href='`/jingdian-intro/${id}/${mark}`')
                        i.icon.i-introduction
                        | 景点介绍
                f7-col
                    f7-link.inn(:href='`/jingdian-products/${id}/${mark}`')
                        i.icon.i-chanpin
                        | 产品预订

                f7-col
                    f7-link.inn(:href='`/jingdian-comment-list/${id}/${mark}`')
                        i.icon.i-pinglun
                        | 评论

                f7-col
                    f7-link.inn(:href='`/common-albumn/${id}/${mark}`')
                        i.icon.i-tupian
                        | 商家图库

            f7-grid.button-line-tab
                f7-col
                    f7-link(:class="{active:swiper_index == 0}",@click="swiper_index = 0")
                        i.icon.i-ditu
                        | 自助导游
                f7-col
                    f7-link(:class="{active:swiper_index == 1}",@click="swiper_index = 1")
                        i.icon.i-ditu
                        | 周边

                f7-col
                    f7-link(:class="{active:swiper_index == 2}",@click="swiper_index=2")
                        i.icon.i-quanjing
                        | 360全景


            .swiper-wrapper
                f7-swiper(:params="{onInit:sw_init}")
                    f7-swiper-slide
                        .el-box.swiper-no-swiping(@click="mapClick")
                            i.map-icon.icon.i-laba
                            div.amap-container(ref="amap")
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
                name: "jingdian-index-page",
                pageBg:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/BEIJINGTU/201703150947480679.jpg",
                swiper_index: 0,
                defaultImg,
                elem:{},
                data:{},
                ...vars.itemCommData
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
            },
            mapClick:function(){
                var m = this;
                m.routeTo(`/jingdian-map/${m.id}/${m.mark}/`)
            }
        },

        watch: {
            swiper_index: _.debounce(function (v,oldv) {
                var m = this;
                var pan =m.got("elem.panorama");
                if(/^(1|2)$/.test(v)) {
                    debugger;
                    if(v == 2 && pan) {
//                        vars.root.bro.open("http://720yun.com/t/e6c21qa8jyw?from=singlemessage&isappinstalled=0&pano_id=857999","全景视图");
//                        vars.root.bro.open(pan,"全景视图");
                        open(pan, "_system")
                    }else if(v==1) {
                        m.routeTo(`/map-around/周边-${m.elem.name}/${m.elem.longitude},${m.elem.latitude}/`)
                    }

                    m.swiper_index = oldv;
                    m.swiper.slideTo(oldv);
                    return;

                }
                m.swiper.slideTo(v);
            },180)
        },
        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            f7.showPreloader()
            m.req("detail", {id:m.id,mark:m.mark}).then(
                function (data) {
                    f7.hidePreloader()
                    if(data.resCode) {
                        f7.alert(data.message)
                    }

                    m.data = data;
                    var mer = data.data;
                    m.setBg(mer.backGround);
                    m.elem = mer;
                    setTimeout(function(){
                        m.map = new AMap.Map(
                            m.$refs.amap,
                            {
                                center: new AMap.LngLat(mer.longitude, mer.latitude)
                            }
                        );
                        m.map.setZoom(12);
                        new AMap.Marker({
                            map:m.map,
                        })
                    },120)
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


    @name:jingdian-index-page;

    .toolClass();

    .@{name}{
        .amap-container{
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


                .map-icon{
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9;
                    ._size_lh(@page-edge *4);
                    color: @main-color;
                }


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
            .i-renzheng{
                font-size: 1.2rem;
                padding: @page-edge/4;
                color: @cl_flat_yellow;
            }
        }
        .item-addr{
            display: flex;
            padding: 0 5%;
            align-items: center;
            justify-content: center;
            .flex-addr{
                /*flex: 1;*/
                //background-color: @cl_flat_yellow;
                border-radius: 2rem; display: flex;
                -ms-flex-align: center;
                align-items: center;
            }

            .split-line{
                margin: 0 0.75em;
                width: 1px;
                height: 2.6em;
                background-color: @cl_bd_light-2;
            }
            .directTo{
                ._size_lh(3em);
                padding: 0;
                font-size: 0.9rem;
                border-radius: 50%;
            }
            .addr{
                //font-size: 0.8rem;
                margin-top: 0.5em;
                text-align: center;
                color: #ffffff;
                text-shadow: @dark-shaow;

                /*white-space: nowrap;*/
                /*overflow: hidden;*/
                b{
                    padding-bottom: 5px;
                   // border-bottom: 1px solid #fff;
                }
                .icon{
                   // font-size: 1.2rem;
                    color: @cl-red;
                    margin-right: 0.25em;
                }
                .i-icon_gaodedaohang{
                    color:@cl_flat_blue1;
                }
                .bs{
                    padding-bottom: 5px;
                    flex-wrap: wrap;
                    display: inline-flex;
                    text-align: left;
                    margin-top: 5px;
                    font-size: 14px;
                    line-height: 24px;
                }
                .to-addr{
                    font-size: 1.2rem;
                   // color: #fff;
                    margin-right: 0.25em;
                }
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
                display: block;
                color: #ffffff;
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
