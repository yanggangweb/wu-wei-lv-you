<template type="text/jade" lang=jade>
    #home
        swiper(:options="swiper_option" ref="main_slider")
            swiper-slide(v-for="item in slider_items")
                img(:src="item.src")
            .swiper-pagination(slot="pagination")
        .v-gutter
        div.home_sort
            .flex
                mu-flat-button.item(v-for="it in sort_items")
                    i.icon(v-bind:class="it.class")
                    |   {{it.name}}
        .v-gutter

        mu-row.indexlist
            mu-col(width="50",v-for="i in 6")
                mu-flat-button
                    h3 保洁小时工
                    p 首单立减，20元/小时


        .v-gutter

        cc-subtitle-bar(title="今日推荐",icon=":i-naozhong")
            a(slot="right")  更多

        .grid_list_1.col_3
            .item(v-for="it in tody_server_item")
                .inner
                    .img
                        img(:src="it.img")
                    .bot
                        h2 {{it.name}}
                        .other
                            span.price ￥{{it.price}}
                            |   {{it.unit}}


        .v-gutter
        cc-subtitle-bar(title="名师一对一",icon=":i-iconfeature01")
            a(slot="right")  更多

        .grid_list_1.col_3
            .item(v-for="it in tody_server_item")
                .inner
                    .img
                        img(:src="it.img")
                    .bot
                        h2 {{it.name}}
                        .other
                            span.price ￥{{it.price}}
                            |   {{it.unit}}


</template>

<script type="text/ecmascript-6">
    import ccSubtitleBar from "../components/subtitleBar.vue"
    import demoimg from "../assets/b_1.jpg"
    import demoimg_server from "../assets/server.jpg"



    export default {
        name: 'hello',
        data () {
            return {
                swiper_option:{
                    pagination: '.swiper-pagination',
                    paginationClickable: true

                },
                slider_items: [
                    {
                        src: demoimg,
                        alt: 'images-1'
                    },
                    {
                        src: demoimg,
                        alt: 'images-2'
                    },
                    {
                        src: demoimg,
                        alt: 'images-3'
                    }
                ],
                sliderinit: {
                    currentPage: 0,//当前页码
                    thresholdDistance: 500,//滑动判定距离
                    thresholdTime: 100,//滑动判定时间
                    autoplay: 1000,//自动滚动[ms]
                    loop: true,//循环滚动
                    direction: 'vertical'//方向设置，垂直滚动
                },

                sort_items:[
                    {name:"家庭保洁",class:"jiazheng"},
                    {name:"维修",class:"weixiu"},
                    {name:"家电清洗",class:"jiadian"},
                    {name:"衣服洗护",class:"jiadian"},
                    {name:"搬家",class:"peisong"},
                    {name:"美容美妆",class:"meirong"},
                    {name:"保姆月嫂",class:"baomu"},
                    {name:"更多",class:"qita4"},
                ],

                tody_server_item:[
                    {
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    },
                    {
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    },{
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    },{
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    },{
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    },{
                        img:demoimg_server,
                        name:"家教服务",
                        price:32,
                        unit:"元/小时"
                    }
                ]


            }
        },
        components: {
            ccSubtitleBar
        },

        mounted: function () {

        },

        deactivated:function(){
            var m = this;

        },
        activated:function(){
            var m = this;

        },

    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass;
    .slider-arrow{
        display: none !important;
    }

    .swiper-container {
        border-bottom: 1px solid @cl_bd_light;

        .swiper-slide{
            img{
                .expandin;
                object-fit: cover;
                display: block;
            }
        }
    }

    .indexlist{
        border-top: 1px solid @cl_bd_light;
        background-color: #ffffff;


        .col{
            position: relative;
            border: 1px solid @cl_bd_light;
            border-top:none;
            border-left: none;
            &:nth-child(2n){
                border-right: none;
            }
            text-align: left;
            .mu-flat-button{
                height: auto;
                display: block;
                width: 100%;
                text-align: left;
                line-height: 1.8rem;
                .mu-flat-button-wrapper{
                    padding: @gap;
                    display: block;
                    &:after{
                        content: "";
                        position: absolute;
                        ._size_rever_margin(32px);
                        right:@g;
                        top: 50%;
                        &:extend(.__icon);
                        background-image: url(../assets/a.jpg);
                        background-size: cover;
                    }
                }
                .mu-ripple-wrapper{
                    z-index: 5;
                }
            }

            h3{
                font-size: 1.4rem;
                font-weight: 400;
                color: @blue;
            }

            p{
                font-size: 1.2rem;
            }


        }
    }

    .home_sort{
        text-align: center;
        .flex{
            text-align: center;
            font-size: 0;
            border-top: 1px solid @cl_bd_light;

            .item{
                min-width: 0;
                height: 88px;
                display: inline-block;
                width: 25%;
                font-size: 1rem;
                box-sizing: border-box;
                border-right: 1px solid @cl_bd_light;
                border-bottom: 1px solid @cl_bd_light;
                background-color: #ffffff;
                vertical-align: top;
                &:nth-child(4n){
                    border-right: none;
                }
                .mu-flat-button-wrapper{
                    display: block;
                    overflow: hidden;
                }

                i{
                    ._size(42);
                    background-size: contain;
                    display: block;
                    .center;
                    margin-top: 1rem;
                }
            }
        }
    }
</style>
