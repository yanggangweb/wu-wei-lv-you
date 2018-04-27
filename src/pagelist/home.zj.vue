<template type="text/html">
    <f7-page :class="[name]">
        <f7-navbar sliding>
            <f7-nav-left>
                <!--<f7-link icon="i-dingwei1"></f7-link>-->
            </f7-nav-left>
            <f7-nav-center>
                {{vars.app_name}}
            </f7-nav-center>
            <f7-nav-right>
                <f7-link icon="i-iconziti17" open-panel="right"></f7-link>
            </f7-nav-right>
        </f7-navbar>
        <span v-page-content-bg="pageBg"></span>
        <f7-block>
            <f7-tabs animated>
                <f7-tab id="tab1" active>
                    <search-bar cancel-link="清除" placeholder="搜索" @dosearch="onSearch" ref="searchBar"></search-bar>
                    <div class="weather-warpper">
                        <span class="addr">{{geo.poiName}}</span>
                        <span v-show="weather_day" class="weather-container">
                            {{weather_day.dayTime}} <template v-if="weather_day.dayTime && weather_day.night">/</template> {{weather_day.night}}
                            <template v-if="weather_day.dayTime && weather_day.night"><br></template>
                            <template v-if="weather_day.temperature">{{weather_day.temperature}}</template>
                        </span>
                    </div>
                    <div class="swiper-container-wrapper" v-if="cata_list_data_picked.length">
                        <f7-swiper pagination  :params="{speed:500, slidesPerView: 1, spaceBetween: 15}">
                            <f7-swiper-slide v-for="list in cata_list_data_picked">
                                <f7-grid>
                                    <f7-col class="catalog-ins" width=25 v-for="item in list" :class="{placeholder:item.placeholder}">
                                        <f7-link :href="item.link" v-if="!item.placeholder" @click="labelClick($event,item)">
                                            <lmg :src="vars.oss_url_base + item.thumb" :style="{backgroundColor:item.bgColor}"></lmg>
                                            <b>{{item.label}}</b>
                                        </f7-link>
                                    </f7-col>
                                </f7-grid>
                            </f7-swiper-slide>
                        </f7-swiper>
                    </div>
                </f7-tab>
                <f7-tab id="tab2">
                    资讯内容
                </f7-tab>
                <f7-tab id="tab3">
                    游记内容
                </f7-tab>
                <f7-tab id="tab4" class="full-width">
                    <div style="display: none">
                        <f7-button v-show="!$store.getters.ut" fill color="green" @click="do_login()"
                                   style="margin-left:3em; margin-right:3em;">去登录
                        </f7-button>
                        <div v-show="$store.getters.ut">
                            当前用户{{$store.getters.user.phone}}
                            <f7-link color="red" @click="logout()">注销</f7-link>
                        </div>
                    </div>
                    <div style="display: block" class="my-page">
                        <f7-list contacts>
                            <f7-list-group>
                                <f7-link href="/personal-information/" class="item-content item-img">
                                    <div class="item-media">
                                        <!--<img class="tuxiang-img" :src="vars.oss_url_base + _get(account,'headImg')">-->
                                        <img class="tuxiang-img" :src="vars.null_img" v-if="!account.headImg">
                                        <img class="tuxiang-img" :src="vars.oss_url_base + _get(account,'headImg')" v-if="account.headImg">
                                    </div>
                                    <div class="item-inner">
                                        <div class="item-title-row">
                                            <div class="item-title">{{ _get(account,'name')}}</div>
                                            <div class="item-title font-size">签名：{{_get(account,'sign')}}</div>
                                        </div>
                                    </div>
                                </f7-link>
                            </f7-list-group>
                        </f7-list>
                        <f7-list media-list>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-qiandao" @click="routeTo(`/my-qiandao/${_get(account,'id')}/`)">
                                        签到
                                        <i class="icon i-lp_speaker right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon ifont i-iconfontshoucang1" @click="routeTo(`/my-shoucang/${_get(account,'id')}/`)">
                                        收藏
                                        <i class="icon i-lp_speaker ifont right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                        </f7-list>
                        <f7-list media-list>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-21" @click="routeTo(`/my-dingdan/${_get(account,'id')}/`)">
                                        订单
                                        <i class="icon i-lp_speaker right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item >
                                <h3>
                                    <f7-link icon="icon i-qiabao" @click="routeTo(`/my-kabao/${_get(account,'id')}/`)">
                                        卡包
                                        <i class="icon i-lp_speaker ifont right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-qiaquan" @click="routeTo(`/my-jifen/${_get(account,'id')}/`)">
                                        积分
                                        <i class="icon i-lp_speaker ifont right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                        </f7-list>
                        <f7-list media-list>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-tupian" @click="routeTo(`/my-tuku/${_get(account,'id')}/`)" >
                                        图片
                                        <i class="icon i-lp_speaker right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item class="you-ji">
                                <h3 >
                                    <f7-link icon="icon i-youji1" @click="routeTo(`/my-youji/${_get(account,'id')}/`)" >
                                        游记
                                        <i class="icon i-lp_speaker right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-pinglun" @click="routeTo(`/my-pinglun/${_get(account,'id')}/`)">
                                        评论
                                        <i class="icon i-lp_speaker right">
                                        </i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                            <f7-list-item>
                                <h3>
                                    <f7-link icon="icon i-icon02" href="/my-shezhi/">
                                        设置
                                        <!-- <i class="icon ifont i-lp_speaker right">
                                         </i>-->
                                        <i class="icon i-lp_speaker right"></i>
                                    </f7-link>
                                </h3>
                            </f7-list-item>
                        </f7-list>
                    </div>
                    <!--<f7-button fill color="green" @click="do_login()" style="margin-left:3em; margin-right:3em;">去登录</f7-button>-->
                </f7-tab>
            </f7-tabs>
        </f7-block>
        <f7-toolbar bottom labels tabbar :key="'home'">
            <f7-link icon="i-shouye_shouye"     text="首页" tab-link="#tab1"          active></f7-link>
            <f7-link icon="i-xiaoxi"            text="资讯" tab-link="#tab2"          @click.stop.prevent="toZixun"></f7-link>
            <!--<f7-link icon="i-youji"             text="游记" tab-link="#tab3"          ></f7-link>-->
            <f7-link icon="i-wode"              text="我的" tab-link="#tab4"          @click.stop.prevent="tabToPersion"></f7-link>
        </f7-toolbar>
    </f7-page>
</template>
<script type="text/ecmascript-6">
    import {vars} from "../config";
    import _ from "lodash";
    import searchBar from "../components/search-bar.vue";
    export default {
        name: 'home-page',
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "home-vue",
                cata_list_data: [],
                pageBg:"",
                searchKey:"",
                account:"",
                items: (function () {
                    var it = [];
                    for (var i = 0; i < 100; i++) it.push(i+1);
                    return it;
                })(),
                weather:{}
            }
        },
        computed: {
            "user":function(){
                return m.$store.state.user;
            },
            weather_day:function(){
                var m = this;
                if(!m.weather.future || !m.weather.future.length) return "";
                return m.weather.future[0];
            },
            geo:function(){
                var m = this;
                return m.$store.state.geo;
            },
            cata_list_data_picked: function () {
                var m = this;
                if (!m.cata_list_data.length) return [];
                var ret_list = [[]];
                var sub_list = ret_list[0];
                var gp = 8;
                var gp_ = gp / 2;
                var cl = m.cata_list_data;
                if (cl.length % (gp / 2) != 0) {
                    var tar_n = ((cl.length / gp_ >> 0) + 1) * gp_;
                    for (var i = tar_n - cl.length; i > 0; i--) {
                        cl.push({
                            placeholder: true
                        })
                    }
                }
                var ret_list = [];
                var sub_list = [];
                m.cata_list_data.forEach(function (el, i,arr) {
                    sub_list.push(el);
                    if(sub_list.length==8 || i==arr.length-1) {
                        ret_list.push(sub_list);
                        sub_list = [];
                    }
                })
                return ret_list;
            }
        },
        methods: {
            tabToPersion(){
                var m = this;
                m.__try_login()
                    .then(function(){
                        f7.showTab('#tab4');
                        m.req("account/accountinfo",{})
                            .then(function(data){
                                m.data = data;
                                m.account=data.account;
                                m.id=data.id;
                                if(data.resCode) {
                                    throw data.message;
                                }
                            })
                            .catch(function(err){
                            })
                        ;
                    })
                ;
            },
            toZixun:function(){
                var m = this;
                m.routeTo(`/list-page/ZIXUN`)
            },
            broswer:function(){
                var m = this;
                vars.root.bro.open("http://720yun.com/t/e6c21qa8jyw?from=singlemessage&isappinstalled=0&pano_id=857999","全景西安");
            },
            onSearch:function(query){
                var m = this;
                if(!query)  return;
                m.$refs.searchBar.onClearClick();
                m.$refs.searchBar.ip.val("");
                m.routeTo(`/search-result/${query}`);
            },
            doo: function () {
                var m = this;
                console.log(m.$router);
                // m.$router.loadPage("/about/")
            },
            do_login: function () {
                var m = this;
                m.__try_login().then(
                    function () {
                        //登录成功 个人界面
                    }, function () {
                        //取消登录
                    }
                )
            },
//            页面跳转
            my_kabao:function(e){
                var m = this;
                console.log(this);
                var dic = vars.dic.type2routeName;
                var router_name = dic[name] || dic["default"];
                m.$router.loadPage(`/${router_name}/`)
            },
            /**
             * 查询天气信息
             */
            req_weather:function(){
                var m = this;
                var geo = m.geo;
                if(geo.error) {
                    console.log("地理位置获取失败，无法获得天气信息");
                    //return;
                }
                var para = {
                    city:geo.city.replace(/市$/,""),
                    province:geo.province.replace(/省$/,"")
                }
                vars.net("::get",para,vars.weather_url_base).then(
                    function(data){
                        if(!data.result || !data.result.length) {
                            m.weather = vars.default_weather
                        }else
                            m.weather = data.result[0];
                    },
                    function(err){
                        m.weather = vars.default_weather;
                    }
                )
            },
            /**
             * 刷新天气
             */
            throttle_weather:_.throttle(function(m){
                m.req_weather();
            },vars.weatherFreshDuration),

            labelClick:function(e,item){
                if(item.item.mark == "ZHIBO") {
                    e.preventDefault();
                    e.stopPropagation();
                    try{
                        if(typeof ZhiBo != "undefined"){
                            ZhiBo.index();
                        }else{
                            CDVZhibo.show()
                        }
                    }catch(err){
                        f7.alert("直播调用失败");
                        console.log("直播调用失败",err);
                    }
//
                }
            }
        },
        watch:{
            "geo":function(v){
                var m = this;
                m.req_weather();
                if(m.weather.error) {
                }else{
                    m.throttle_weather(m);
                }
            }
        },
        mounted: function () {
            var m = this;
            (function(showIndexData) {
                m.pageBg = showIndexData.background;
                var catalog = [];
                showIndexData.list.forEach(function (item, index) {
                    var element = {
                        label: item.name,
                        item,
                        thumb: item.url,
                        link: "/list-page/" + item.mark,
                        bgColor:vars.getColor(index)
                    }
                    catalog.push(element);
                });
                m.cata_list_data = catalog;
                if(!m.weather.feature) {
                    m.req_weather();
                }
            }).apply(m,vars.startupData)
        },
        components:{
            searchBar,
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();
    .home-vue{

        #tab1{
            padding: 0 @page-edge;
            box-sizing: border-box;
            margin-top:@page-edge;
        }
        .page-content{
            overflow: hidden;
        }
        .content-block{
            margin: 0;
            padding: 0;
        }
        .page-content{
            .__icon;
            background-size: cover;
        }
        .navbar{
            .icon{
                color: @cl-black;
            }
        }
        &.embed-in-app{
            .page-content{
                padding-top:@top-bar-height + @page-edge;
            }
        }
        .tabs{
            height: 100%;
            .tab{
                position: relative;
                height: calc(~"100vh" - (@top-bar-height * 2 + @page-edge*2.5));
            }
            .ios &{
                .tab{
                    height: calc(~"100vh" - (@top-bar-height * 3 + @page-edge));
                }
            }
        }
        .swiper-slide{
            >.row{
                //justify-content: flex-start;
            }
        }
        .swiper-container-wrapper{
            position: absolute;
            left:@page-edge;
            right:@page-edge;
            bottom: 0;
            .swiper-pagination{
                bottom: 0 !important;
                .swiper-pagination-bullet{
                    background-color: @cl_flat_light;
                    box-shadow: @light-shaow;
                    &.swiper-pagination-bullet-active{
                        background-color: @main-color;
                    }
                }
            }
            .catalog-ins{
                /*width: 70px;*/
                .link{}
                .lmg{
                    border-radius: 50%;
                    background-color: @cl_flat_red;
                    position: relative;
                    ._size(61px);
                }
                img{
                    position: absolute;
                    &:extend(.expandin);
                }
            }
        }
        .catalog-ins{
            text-align: center;
            i{
                display: block;
                height: 5rem;
                background-color: #f0f0f0;
                /*margin-top: 1rem;*/
            }
            b{
                padding-top: 0.5rem;
                display: block;
                color: #fff;
                margin-bottom: 1rem;
                text-shadow: @dark-shaow;
            }
            &.placeholder{
                //opacity: 0;
            }
        }
        .searchbar{
            position: relative;
            z-index: 9;
            padding: 0;
            background-color: transparent;
            &:after{
                display: none;
            }
            .searchbar-input{
                .lineh(2.2rem) !important;
                input{
                    background-color: rgba(255, 255, 255, 0.80);
                }
            }
            &.searchbar-active{
                background-color: #ffffff;
                border-radius: 3px;
            }
            .searchbar-clear{
                top: 4px;
            }
            .searchbar-cancel{
                position: relative;
                left:-@page-edge/2;
            }
        }
        .weather-warpper{
            display: flex;
            justify-content: space-between;
            margin-top:@page-edge;
            text-shadow: @dark-shaow;
            color: @cl_flat_light;
            >span{
                white-space: nowrap;
                &:first-child{
                    flex: 1;
                }
                &.addr{
                    white-space: normal;
                    margin-right: 1em;
                }
            }
            .weather-container{
                text-align: right;
            }
        }
        #tab2,#tab3,#tab4{
            padding-top: 33vh;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.6);
        }
    }
    .home-vue #tab4 {
        overflow-y: scroll;
        height: calc(~"100vh" - 94px);
        padding: 0;
        background-color: @cl_flat_light;
        .list-block.media-list .item-inner {
            padding: 0;
        }
    }
    .my-page {
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
        .item-img{
            padding: 1rem 0;
            .item-inner:after {
                background-color: transparent;
            }
            .tuxiang-img{
                width: 3rem;
                height:3rem;
                border-radius: 50%;
                .item-inner:after{
                    background-color:#fff;
                }
            }
        }
        .list-block {
            margin: 15px 0;
            .item-inner:after {
                width: 96%;
            }
        }
        .item-inner {
            padding: 0;
            h3 {
                margin: 0;
                a {
                    color: @cl_flat_black;
                    font-size: 1rem;
                    display: block;
                    /*i{
                        color:@cl_flat_blue;
                    }*/
                    i {
                        &.i-qiandao {
                            color: @cl_flat_blue;
                        }
                        &.i-iconfontshoucang1 {
                            color: @cl_flat_yellow;
                        }
                        &.i-21 {
                            color: @cl_flat_blue;
                        }
                        &.i-qiabao {
                            color: @cl_flat_orange;
                        }
                        &.i-qiaquan {
                            color: @cl_flat_pink;
                        }
                        &.i-tupian{
                            color: @cl_flat_green;
                        }
                        &.i-youji1{
                            color: @cl_flat_orange;
                        }
                        &.i-pinglun{
                            color: @cl_flat_yellow;
                        }
                        &.i-icon02{
                            color:@cl_flat_blue;
                        }
                    }
                }
                .right {
                    float: right;
                    color: @cl_flat_light1;
                    margin-top: 7px;
                    font-size: 1.6rem;
                }
                .icon {
                    margin-right: @page-edge/2;
                }
            }
        }
        .you-ji{
             // 隐藏游记
             display: none;
         }

    }
</style>
