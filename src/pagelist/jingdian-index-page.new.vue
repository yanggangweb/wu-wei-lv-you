<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span 景点详情
            f7-nav-right
                f7-link(@click="collectToggle(data,mark)")
                    i.icon(:class="{'i-fill85':!data.collected,'i-iconfontshoucang1':data.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")

        .body.shortcut-class
            .banner
                img(:src="vars.oss_url_base + got('elem.backGround')")
            .box
                .page-title {{elem.name}}
                .address-row.row.between
                    span.row.red.fx1
                        i.icon.i-dingwei2.size-icon-small
                        span.row.fx1 {{elem.address}}
                    span.row
                        i.icon.i-daohang1.cl-blue.size-icon-small(@click="directTo(elem)")
                        i.v-split
                        |   &nbsp;
                        i.icon.i-dianhua1.grayphone.size-icon-small(@click="phoneCall(got('data.merchantInfo.phone') || got('data.merchantInfo.mobile'))",:class="{'cl-black':got('data.merchantInfo.phone') || got('data.merchantInfo.mobile')}")
                .func-grid-row
                    span(@click="routeTo(`/jingdian-intro/${id}/${mark}`)")
                        .inner
                            i.icon.i-tuijianjingdian.green
                            b 景点介绍
                    span(@click="routeTo(`/jingdian-products/${id}/${mark}`)")
                        .inner
                            i.icon.i-chanpin1.cl-blue
                            b 产品预定
                    span(@click="routeTo(`/jingdian-comment-list/${id}/${mark}`)")
                        .inner
                            i.icon.i-pinglun3.yellow
                            b 评论
                    span(@click="routeTo(`/common-albumn/${id}/${mark}`)")
                        .inner
                            i.icon.i-tupian6.cl-pp
                            b 商家图库


                .amap-container
                    .btn-cont
                        a(@click="routeTo(`/jingdian-map/${id}/${mark}/`)")
                            i.icon.i-zizhudaoyou
                            b   自助导游
                        a(@click="routeTo(`/map-around/周边-${elem.name}/${elem.longitude},${elem.latitude}/`)")
                            i.icon.i-zhoubian
                            b   周边
                        a.liteIcon(v-show='got("elem.panorama")',@click='open360(got("elem.panorama"))')
                            i.icon.i-shipingquanjing
                            b   360全景
                    .amap(ref="amap")


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
            open360(url){
                var m = this;
                open(url,"_system")
            }
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
    .shortcut-class .grayphone{
        color: #d0d0d0;
    }
    .shortcut-class .grayphone.cl-black{
        color: #3A3A3A;
    }

    .@{name}{
        .amap-container{
            height: 100%;
        }

        .banner{
            height: 27vh;
            /*background-color: #e0e0e0;*/
            img{
                display: block;
                &:extend(.expandin);
                object-fit: fill;
            }
        }

        .box{
            padding:@page-edge;
        }

        .page-title{
            color: #4BAD96;
            padding: 1em;
            font-size: 1rem;
            text-align: center;
            border-bottom:1px solid #dcdcdc;
            margin-bottom:@page-edge/2;
        }


        .func-grid-row{
            margin-top:@page-edge;
            font-size: 0;
            b{
                font-size: 0.7rem;
            }
            >span{
                display: inline-block;
                width:25%;
                position: relative;
                padding:@page-edge/2;
                box-sizing: border-box;

                .inner{
                    position: absolute;
                    &:extend(.expandin);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }


                &:after{
                    content:"";
                    display: block;
                    padding-top: 100%;
                    background-color: #F9F9F9;
                }
            }
        }


        .amap-container{
            position: relative;
            margin-top:@page-edge;
            >.amap{
                height: 33vh;
            }
        }


        .btn-cont{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            background-color: #4bad95;
            border-radius: 5px;
            a{
                display: inline-block;
                padding:0 @page-edge/2;

                color: #ffffff;

                .icon{
                    transform: scale(0.8);
                }

                &.liteIcon{

                    .icon{
                        font-size: 1.5rem;
                        position: relative;
                        top: -6px;
                    }
                }

                text-align: center;
                b{
                    display: block;
                    font-size: 0.7rem;
                    margin-top: -0.5em;
                    padding-bottom: 0.2em;
                }
            }
        }

        .page-content{
            background-color: #ffffff;
        }

        .intro-tx-title{
            border: 1px solid #dcdcdc;
            border-left:none;
            .margin_h(@page-edge);
            padding: @page-edge/2 0 ;
            border-right: none;
            color: @main_color_light;
            border-top:0.8rem solid #f9f9f9;
            >a,.rt{
                float: right;
                i{
                    color: #fff;
                }
                &.active i{
                    color: @main-color;
                }
            }

            .rt{
                position: relative;
                top: 14px;
                font-size: 0.8rem;
            }

            >.icon{
                margin-right: @page-edge/2;
            }

            i.icon,&{
                color: #4bad96;
            }


            &.flex{
                justify-content: space-between;
                align-items: center;
                .rt{
                    position: static;
                }
            }
            .star{
                position: relative;
                top: -2px;
                .icon{
                    color: #E3E3E3;
                }
            }
        }

        .address-row{
            margin-bottom: -@page-edge/2;
        }




        //旧版
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

    }



</style>
