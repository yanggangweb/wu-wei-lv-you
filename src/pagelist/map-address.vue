<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                search-bar.no-bgcolor.no-h-padding#tipinpu(:placeholder="'搜索'",@dosearch="doGlobalSearch", :inNavbar="true")
            f7-nav-right
                f7-link(v-if="currentPoi",@click="choosePoi") 完成　

        .map-wrapper
            i.map-cursor
            .map-container(@click="aroundTypeVisible=jdlistVisible=false")
                .map-el(ref="mapEl" ,:vid="'amap-vue'")

        .map-list(ref="aroudList",@click="itemClick")
</template>

<script type="text/ecmascript-6">
    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import searchBar from "../components/search-bar.vue";
    import _ from "lodash";
    import $ from "jquery";
    import ElInput from "../../node_modules/element-ui/packages/input/src/input";

    export default {
        mixins: [vars.mixin_1],
        data(){
            return {
                name: "map-address",


                itemDataList:[],
                currentPoi:"",

                //关键字
                searchbar_value: "",

                //搜索结果列表
                searchResult: [],

                placeSearch: ""
            }
        },

        computed: {
            geo: function () {
                var m = this;
                return m.$store.getters.geo
            },

            currentLonlat:function(){
                var m = this;
                return new AMap.LngLat(m.geo.longitude, m.geo.latitude);
            }
        },

        methods: {
            choosePoi:function(){
                var m = this;
                vars.root.$emit("pio-choosed",{poi:m.currentPoi});
                m.goback();
            },
            itemClick:function(e){
                var m = this;
                var tar = $(e.target);
                var li
                if(tar.is("li")) {
                    li = tar;
                }else{
                    li = tar.parents("li:first");
                }
                if(li && li.length) {
                    m.currentPoi = m.itemDataList[li.index()]
                    console.log(m.currentPoi);
                }

            },

            doGlobalSearch:function(key){
                var m = this;
                if(!m.globalSearch) {
                    m.globalSearch = new AMap.PlaceSearch({
                        pageSize: 5,
                        pageIndex: 1,
                        //city: "010", //城市
                        map: m.map,
                        //panel: "result"
                    });
                }
                m.globalSearch.search(key,function (status, result) {

                })


            },

            /**
             * 点击地图后，周边搜索
             **/
            doAroundSearch:function(){
                var m = this;
                if(!m.aroundSearch) {
                    m.aroundSearch = new AMap.PlaceSearch({
                        pageSize:20,
                        pageIndex: 1,
                        type:"商务住宅|风景名胜|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业",
                        //city: "010", //城市
                        map: m.map,
                        panel: m.$refs.aroudList
                    });
                }

                m.currentPoi = "";
                var lnglat = m.map.getCenter()
                m.aroundSearch.searchNearBy("",[lnglat.lng, lnglat.lat], 500,function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        m.itemDataList = result.poiList.pois;

                    }
                })
            },



            initSearch: function (key) {
                var m = this;
                var geo = m.geo;
                m.key = key;


                m.placeSearch = new AMap.PlaceSearch({
                    pageSize: 5,
                    pageIndex: 1,
                    city: "010", //城市
                    map: map,
                    panel: "result"
                });

                return;
            },

        },

        watch: {

        },

        mounted: function () {
            var m = this;

            var mapOption = { resizeEnable: true}
            m.map = new AMap.Map(m.$refs.mapEl, mapOption);


            m.debounceDoAroundSearch = _.debounce(m.doAroundSearch,360);
            m._on_moveend = function(){
                m.debounceDoAroundSearch();
            }

            m.map.on("dragend",m._on_moveend)

            m.$watch("geo",function(){
                var m = this;
                if(!m.currentMark) {
                    m.currentMark = vars.maptool.getMaker(undefined,"i-location center",m.map);
                    m.map.setCenter(m.currentLonlat);
                    m.doAroundSearch();
                }
                m.currentMark.setPosition(m.currentLonlat);
            },{immediate:true})

        },

        //实例被销毁之前
        beforeDestroy: function () {
            var m = this;



            m.map.off("dragend",m._on_moveend)

            //销毁地图
            //m.map.destroy();
        },

        components: {
            ElInput,
            searchBar
        },
        directives: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();

    @name: jingdian-map-page;
    .map-address {

        .poi-more{
            transform:scale(0);
            position: absolute;
            top: -1000px;
        }

        .map-list{
            height: 38vh;
            overflow-y: auto;
        }
        .map-wrapper{

            .map-container{
                height: 60vh;
            }
            .map-el{
                position: absolute;
                &:extend(.expandin);
                //height: 600px;
            }
            position: relative;

        }
        .map-cursor{
            font-family: ifont;
            &:after{
                content: "\e61e";
            }

            position: absolute;
            left: 50%;
            top: 50%;
            font-size: 2rem;
            color: @main-color;
            transform: translate(-50%,-50%);
            z-index: 99;
        }
        .searchbar {
            width: 120px;
            padding: 0;
            margin-right: 10px;
            input[type="search"] {
                width: 100%;
                padding: 0;
                padding-left: 25px;
            }
        }

    }


</style>
