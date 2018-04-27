<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
                search-bar.no-bgcolor.no-h-padding(
                    :placeholder="'搜索'",
                    :inNavbar="true",
                    @dosearch="doSearch",
                    :value="searchbar_value"
                )
        f7-button.auto-voice-play-btn(icon="i-laba",@click="autoPlay=!autoPlay",:class="{live:autoPlay}")


        .map-container(@click="aroundTypeVisible=jdlistVisible=false")
            .map-el(ref="mapEl")
        f7-grid.bot-bar
            .col-auto.item(@click="jdlistVisible=!jdlistVisible;aroundTypeVisible=false",       :class="{active:jdlistVisible}")
                i.icon.i-list
                |景点列表
            .col-auto.item(v-if="false",@click="aroundTypeVisible=!aroundTypeVisible;jdlistVisible=false",   :class="{active:aroundTypeVisible}")
                i.icon.i-sousuo-sousuo
                |搜索周边

        transition(name="slide-down")
            .jd-list-warpper(v-show="jdlistVisible",ref="jdListWrapper")
                f7-list
                    f7-list-item(
                        ref="jdListItem",
                        v-for="(sub,index) in subList" ,
                        :class="{active:index==subIndex,'no-voice':!sub.voice}",
                        @click="jdlistClick(sub,index)"
                    )
                        i.icon.i-laba(slot="media")
                        h3
                            b   {{sub.name}}
                            f7-button(fill="", color="orange", @click.stop.prevent="look_detail(sub)") 详情
                        p.desc {{sub.introduction | strleng('30')}}

        transition(name="slide-down")
            .around-type-wrapper(v-show="aroundTypeVisible",:vv="aroundTypeVisible")
                f7-grid
                    f7-col(v-for="it in searchTypeList")
                        i.icon(:class="it.icon",@click="shortSearch(it)")
                        b(@click="shortSearch(it)") {{it.label}}


</template>

<script type="text/ecmascript-6">

    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import searchBar from "../components/search-bar.vue";
    import _ from "lodash";
    import $ from "jquery";

    var searchTypeList = [
        {label:"美食",        icon:"i-meishi"},
        {label:"酒店",        icon:"i-jiudian"},
        {label:"娱乐",        icon:"i-unie60a"},
        {label:"车票",        icon:"i-jiaotong"},
        {label:"周边游",      icon:"i-zhoubianyou"}
    ]


    let markerClickHandler = function(e){
        var m = this;
        var marker = e.target;
        var data = marker.getExtData();

        //单击的景点icon
        if(data.jdIndex!==undefined) {
            if(m.subIndex!=data.jdIndex) {
                m.subIndex = data.jdIndex;
                m.autoPlay = false;
                m.jdlistVisible = true;
            }
        }
    }

    export default {
        mixins: [vars.mixin_1],

        name:"common-around-search",

        data () {
            return {

                name: "jingdian-map-page",

                //周边类型可视状态
                aroundTypeVisible:false,

                //经典列表可见状态
                jdlistVisible:false,

                autoPlay:true,
                //景点列表
                subList:[],
                //当前经典索引
                subIndex:-1,

                //关键字
                searchbar_value:"",

                //快捷搜索列表
                searchTypeList,

                //搜索结果列表
                searchResult:[]
            }
        },

        computed: {
            geo:function(){
                var m = this;
                return  m.$store.getters.geo
            }
        },

        methods: {//查看详情
            look_detail:function(item){
                var m = this;
                m.routeTo(`/jingdian-sub-desc/${item.id}/`)
            },

            //单击列表中的某个景点
            jdlistClick:function(jd,index){
                var m = this;
                if(m.subIndex!=index) {
                    m.autoPlay = false;
                }
                m.subIndex=index;
            },

            //快速收缩
            shortSearch:function(it){
                var m = this;
                m.searchbar_value = it.label;
                m.aroundTypeVisible = false;

            },

            doSearch:function(key){
                console.log(key);
            },

            findClostPoi:function(){
                var m = this;

                m.aroundTypeVisible = false;
                m.jdlistVisible = true;

                //寻找最近的点
                var distance = Number.MAX_VALUE;
                var closet = "";
                m.subList.forEach(function(el){
                    var cur_distance = el.lonLat.distance(m.lonLat);
                    if(cur_distance<distance) {
                        closet = el;
                        distance = cur_distance;
                    }
                })

                //到达某景点
                if(distance<vars.subViewScale) {
                    //到达el
                    m.subIndex = _.findIndex(m.subList,{id:closet.id})
                }
            }
        },

        watch: {
            "jdlistVisible":function (v) {
                var m = this;
//                if(v){
//                    m.$nextTick(function(){
//                        m.$refs.jdListWrapper.scrollTop = 0;
//                    })
//                }
            },
            "$store.getters.geo":function(geo){
                var m = this;
                m.lonLat = new AMap.LngLat(geo.longitude,geo.latitude);
                m.myMaker.setPosition(m.lonLat);

                if(m.autoPlay){
                    m.findClostPoi();
                }
            },

            /**
             * 选择不同的景点
             * @param index
             */
            "subIndex":function(index){
                var m = this;
                var jd = m.subList[index];

                m.subList.forEach(function(el,i){
                    if(i == index) {
                        vars.maptool.setMarkerIcon(el.marker,"i-dingwei6 bottom-center red")
                        m.map.panTo(el.marker.getPosition())
                    }else{
                        vars.maptool.resetMarkerIcon(el.marker)
                    }
                })


                //移动视窗到需要高亮的地方
                setTimeout(function(){
                    var cp = m.$refs.jdListItem[index];
                    var jj = m.$refs.jdListWrapper;
                    var $$$ = $(cp.$el);
                    $(jj).animate({
                        scrollTop: $$$.position().top + 9
                    })
                },333)
            },
            "autoPlay":function(v){
                var m = this;
                if(v) {
                    m.findClostPoi();
                }
            },

        },

        mounted: function () {
            var m = this;
            var geo = m.geo;

            lazyAMapApiLoaderInstance.load().then(() => {
                m.lonLat = new AMap.LngLat(geo.longitude,geo.latitude);
                m.map = new AMap.Map(
                    m.$refs.mapEl,
                    {
                        resizeEnable:true,
                        center: m.lonLat
                    }
                );

                m.map.setZoom(12);

                m.myMaker = vars.maptool.getMaker(undefined,"i-location center",m.map);
                m.req("jingdian.sub::static").then(
                    function(data){
                        data.result.forEach((el,index)=>{
                            el.lonLat = new AMap.LngLat(el.longitude,el.latitude);
                            el.marker = vars.maptool.getMaker(el.lonLat,"i-dingwei6 bottom-center",m.map);
                            el.marker.setExtData({jdIndex:index})
                            el.marker.on("click",markerClickHandler,m)
                        })
                        m.subList = data.result;

                        if(m.autoPlay) m.findClostPoi();
                    },
                    function(err){
                        //加载数据出错
                    }
                )
            });
        },

        //实例被销毁之前
        beforeDestroy:function(){
            var m = this;

            //各种事件解绑
            m.subList.forEach(el=> el.marker.off("click",markerClickHandler))

            //销毁地图
            m.map.destroy();
        },

        components: {
            searchBar
        },

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:common-around-search;

    .toolClass();

    .@{name}{
        .page-content{
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }


        .auto-voice-play-btn{
            position: absolute;
            top:@page-edge + @top-bar-height;
            right:@page-edge;
            z-index: 600;
            padding: @page-edge/2;
            height: auto;
            border-radius: 50%;
            border: 2px solid @cl-red;
            background-color: #FAF9F7;
            ._size(@page-edge*3);
            >i.icon{
                transition: color 0.6s @ExpoEaseInOut;
                position: absolute;
                top: 50%;
                left: 50%;
                color: #666;
                transform: translate(-50%,-50%);
                margin-left: 3px !important;
            }
            &:after{
                @ww:4px;
                content:"";
                height: @ww;
                width: 100%;
                position: absolute;
                z-index: 8;
                background-color: @cl_flat_red;
                top: 50%;
                left: 0;
                margin-top: -@ww/2;
                transform: rotate(45deg) scaleX(1);
                transition:all 0.6s @ExpoEaseOut,;
                opacity: 1;
            }

            &.live{
                border-color: @cl-orange;
                i.icon{
                    color: @cl-orange;
                }
                &:after{
                    transform: rotate(360deg) scaleX(0);
                    opacity: 0;
                }
            }
        }

        .map-container{
            flex: 1;
            background-color: @cl_flat_light;
            position: relative;
            display: flex;
            .map-el{
                flex: 1;
                //height: 600px;
            }
        }

        .jd-list-warpper,.around-type-wrapper{
            position: absolute;
            width: 100%;
            bottom:@top-bar-height + 1;
            background-color: #ffffff;
            z-index: 200;
            border-top:1px solid @cl_bd_light;
            box-sizing: border-box;
        }

        .jd-list-warpper{
            max-height:30vh;
            overflow: hidden;
            overflow-y: auto;
            padding:@page-edge;
            .list-block{
                margin: 0;
                li{
                    position: relative;
                    &:before{
                        content: "";
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        left: 0;
                        height: 1px;
                        background-color: #eeeeee;
                    }
                    &.active{
                        .item-content{
                            color: @main-color;
                        }

                        .item-inner{
                            display: block;
                        }
                        .desc{
                            display: block;
                        }

                        h3{
                            >a{
                                display: block;
                            }
                        }
                    }

                    &.no-voice{
                        .item-media{
                            display: none;
                        }
                        .item-inner{
                            margin-left: 0;
                        }
                    }
                }
            }

            .item-inner{
                padding-right: 0;
                &:after{
                    display: none;
                }

                h3{
                    margin: 0;
                    font-weight: 100;
                    display: flex;
                    align-items: center;
                    >b{
                        flex: 1;
                        font-size: 1rem;
                    }
                    >a{
                        display: none;
                        .lineh(1.2rem);
                        font-size: 0.7rem;
                    }
                }
                p{
                    margin: 0;
                }
            }

            .desc{
                display: none;
                font-size: 0.8rem;
            }


            .icon{
                font-size: 1.5rem;
                &:before{
                    position: relative;
                    top: 3px;
                }
            }
        }


        .around-type-wrapper{
            text-align: center;
            padding:@page-edge;

            b{
                display: block;
            }

            .col-auto{
                &:nth-child(1){ color: @cl_flat_orange; }
                &:nth-child(2){ color: @cl_flat_blue;}
                &:nth-child(3){ color: @cl-red; }
                &:nth-child(4){ color: @cl_flat_purple  }
                &:nth-child(5){ color: @cl_flat_green;}
                b{
                    color: #666;
                    margin-top:@page-edge/2;
                }

                i{
                    display: block;
                    &:after{
                        content:"";
                        display: block;
                        padding-top: 100%;
                        background-color: @cl_bd_light;
                        border-radius: 50%;
                        opacity: 0.5;
                        transform: scale(0.95);
                    }
                    &:before{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        z-index: 5;
                        transform: translate(-50%,-50%);
                    }
                }
            }
        }


        .bot-bar{
            position: relative;
            z-index: 600;
            border-top:1px solid @cl_bd_light;
            .lineh(@top-bar-height);
            text-align: center;
            background-color: #fff;
            position: relative;
            &:after{
                content: "";
                position: absolute;
                left: 50%;
                width: 1px;
                background-color: @cl_bd_light;
                height: 60%;
                top: 20%;

                display: none;
            }

            .item{
                &.active{
                    color: @main-color;
                }
            }

            .icon{
                color: @main-color;
                font-size: 1.2rem;
                padding-right: 0.25em;
            }

        }
    }



</style>
