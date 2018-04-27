<template type="text/jade" lang="jade">
    f7-page.map-around
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",@click="goback()")
            f7-nav-center {{$route.params.title||"周边"}}
        div.full-container()
            el-amap(:zoom="12",:events="{init:mapInit}")
            .around-type-wrapper
                .btn-cont
                    transition-group(name="slide")
                        a.btn(@click="$refs.resultPanel.open()",v-show="searching && !resultPanel.visible",key="1")
                            i.icon.i-guanbi
                            |   展开<br>列表

                        a.btn(@click="clearSearchResult",v-show="searching",key="2")
                            i.icon.i-guanbi
                            |   清除<br>搜索

                f7-grid
                    f7-col(v-for="it in searchTypeList")
                        i.icon(:class="it.icon",@click="typeSearch(it)")
                        b(@click="shortSearch(it)") {{it.label}}

        picker.mapSearchResult(ref="resultPanel",:title="resultPanelTitle")
            .list(ref="resultListCont")



</template>

<script type="text/ecmascript-6">
    import defaut_img from "../assets/default.jpg";

    import { AMapManager } from 'vue-amap';

    var noCache = true;


//    POI搜索类型共分为以下20种：
//    汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|
//    医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|
//    交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施

    var defaultSearchType = "商务住宅|风景名胜|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业"


    var searchTypeList = [
        {label:"美食",        icon:"i-meishi",        poiString:"餐饮服务"},
        {label:"酒店",        icon:"i-jiudian",       poiString:"住宿服务"},
        //{label:"娱乐",        icon:"i-unie60a",       poiString:"生活服务|购物服务|体育休闲服务|科教文化服务|公共设施"    },
        {label:"景点",        icon:"i-unie60a",       poiString:"风景名胜"    },
        {label:"交通",        icon:"i-jiaotong",      poiString:"交通设施服务"},
        //{label:"周边游",      icon:"i-zhoubianyou"}
    ]

    export default {
        name:"map-around",
        data () {
            return {
                _map:"",
                _aroundSearch:"",

                //中心点
                _point:"",
                searchTypeList,

                //搜索结果标题
                resultPanelTitle:"",


                searching:false,
            }
        },

        computed: {},

        methods: {
            mapInit:function(map){
                var m = this;
                var lnglatArray = m.$route.params.lnglat.split(",")

                m._point = new AMap.LngLat(lnglatArray[0]*1,lnglatArray[1]*1);

                m._map = map;
                m._map.setCenter(m._point);


                let marker = new AMap.Marker({
                    position: lnglatArray
                });

                marker.setMap(map);

                m._aroundSearch = new AMap.PlaceSearch({
                    pageSize:20,
                    pageIndex: 1,
                    type:defaultSearchType,
                    //city: "010", //城市
                    map: m._map,
                    panel: m.$refs.resultListCont
                });

            },
            clearSearchResult(){
                var m = this;
                m._aroundSearch.clear();
                m.searching = false;
                m._map.setCenter(m._point);
            },
            typeSearch(typeIns){
                var m = this;
                m._aroundSearch.setType(typeIns.poiString);
                m.resultPanelTitle = typeIns.label + "-搜索结果";
                m.doSearch();

            },
            doSearch:function(){
                var m = this;

                m._aroundSearch.searchNearBy("",[m._point.lng, m._point.lat], 500, function (status, result) {
                    if(status == "no_data") {
                        return vars.toast("周围未找到该类型数据")
                    }
                    if (status === 'complete' && result.info === 'OK') {
                        //m.itemDataList = result.poiList.pois;

                        setTimeout($=>{
                            //m.$refs.resultPanel.show();
                        },333)
                        m._aroundSearch.setType(defaultSearchType);
                        m.searching = true;
                    }
                })

            }

        },

        computed:{
            resultPanel(){
                return this.$refs.resultPanel
            }
        },

        mounted: function () {
            var m = this;

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();

    @search-type-height:140px;

    .map-around{

        .el-vue-amap{
            height: calc(~"100vh - @{search-type-height} - @{top-bar-height}");

            .poi-more{
                display: none;
            }
        }


        .around-type-wrapper{
            bottom:0;
            background-color: #ffffff;
            border-top:1px solid @cl_bd_light;
            box-sizing: border-box;
            height:@search-type-height;
            text-align: center;
            padding:@page-edge;

            position: relative;


            .btn-cont{
                position: absolute;
                //            ._size()
                font-size: 0.6rem;
                top: 0;
                right: 1em;
                transform:translate(0,-100%);
            }

            .btn{
                display: block;
                background-color: #33BA78;
                color: #ffffff;

                text-align: center;

                ._size(4em);

                display: flex;
                justify-content: center;
                border-radius: 50%;

                margin-bottom: 1em;

                align-items: center;
                //padding:@page-edge/2 @page-edge;
                .icon{
                    position: relative;
                    top: -1px;
                    font-size: 1em;
                    display: none;
                }

                &:nth-child(2) {
                    background-color: @cl_flat_red;
                }
            }

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



        .animate(){
            transition:transform 0.9s @ExpoEaseInOut,opacity 0.9s @ExpoEaseInOut;
            transition-delay:0.05s;
            &:last-child{
                transition-delay:0.25s;
            }
        }

        .slide-enter{
            transform:scale(0.6);
            opacity: 0;
        }
        .slide-enter-active{
            .animate;

        }
        .slide-enter-to{}

        .slide-leave{

        }
        .slide-leave-active{.animate}
        .slide-leave-to{
            transform:scale(0.6);
            opacity: 0;

        }

    }

    .mapSearchResult{
        .list{
            max-height:33vh;
            overflow: auto;
            
            .amap_lib_placeSearch{
                border-color: #f3f3f3;
            }

            .poi-more{
                display: none;
            }

        }
    }
</style>
