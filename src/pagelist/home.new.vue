<template type="text/html">
    <f7-page :class="[name]">
        <f7-navbar sliding class="navbar-black-text">
            <f7-nav-left>
                <span v-if="vars.varsionPrefix=='.tr'" class="navbarFont" :class="{small:addr.name.length>6}" @click="routeTo(`/address-picker/4545445/`)">&nbsp;&nbsp;{{addr.name}} <i class="inline icon i-drop-down"></i></span>
                <span v-if="vars.varsionPrefix=='.zj'" ></span>
            </f7-nav-left>
            <f7-nav-center>
                <search-bar class="list-page-searchbar no-bgcolor no-h-padding" :inNavbar="true" cancel-link="清除" placeholder="搜索" @dosearch="onSearch" ref="searchBar"></search-bar>
            </f7-nav-center>
            <f7-nav-right>
                <f7-link icon="i-iconziti17" open-panel="right"></f7-link>
            </f7-nav-right>
        </f7-navbar>


        <f7-block>
            <f7-tabs animated>
                <!--home-->
                <f7-tab id="tab1" active>

                    <div class="banner new-banner" v-if="bannerImageList.length" :style="{height:recommendList.length?'auto':0}">
                        <f7-swiper class="swiper-bullet-custom" pagination  :params="{speed:500, slidesPerView: 1, spaceBetween: 15, autoplay:3000, autoplayDisableOnInteraction:false}">
                            <f7-swiper-slide v-for="ban in bannerImageList">
                                <img :src="vars.oss_url_base + ban.pictureUrl" alt="">
                            </f7-swiper-slide>
                        </f7-swiper>

                        <svg class="svg" width="100" height="18">
                            <circle cx="9" cy="9" r="9" fill="#fff"></circle>
                        </svg>
                        <div class="weather-warpper" @click="routeTo(`/weathers`)">
                            <span v-show="geo.longitude">{{geo.city}}</span>
                            <span v-show="weather_day" class="weather-container">
                            {{weather_day.dayTime}} <template v-if="!!weather_day.night">/{{weather_day.night}}<br></template>
                            <template v-if="weather_day.temperature">{{weather_day.temperature}}</template>
                        </span>
                        </div>
                    </div>

                    <div class="icon-grid" :style="{opacity:recommendList.length?1:0}">
                        <a href="#" v-for="(ml,$index) in markList" @click="labelClick($event,ml)">
                             <label v-if="$index<10">
                                <span class="iconCont"><img :src="vars.oss_url_base + ml.url" alt=""></span>
                                <b>{{ml.name}}</b>
                            </label>
                            <label v-else-if="!xiashow">
                                <span class="iconCont"><img :src="vars.oss_url_base + ml.url" alt=""></span>
                                <b>{{ml.name}}</b>
                            </label>
                        </a>
                        <div v-if="markList.length>10" class="menuxiala" @click="menushow"><i :class="['icon',{'i-xiala':xiashow},{'i-xiangshang-copy':!xiashow}]"></i></div>
                    </div>


                    <div v-if="recommendList&&!recommendList.length">努力加载中...</div>
                    <div v-if="!recommendList" style="margin-top: 30px;">
                        <div class="blank-placeholder no-mt">
                            <i class="icon i-zhaobudao"></i>
                            <div class="label">暂无数据</div>
                        </div>
                    </div>

                    <div class="hot-item" v-for="rec in recommendList" v-if="rec">
                        <h3 class="item-title ">
                            <span><i class="icon" :class="[rec.icon]" :style="{color:rec.iColor}"></i>{{rec.name}}</span>
                            <a @click="routeTo(`/list-page/${rec.mark}/`)">更多 &gt;</a>
                        </h3>
                        <div class="item-grid">
                            <a class="item" v-for="it in rec.list" @click="routeTo(`/${rec.router}/${it.id}/${rec.mark}/`)">
                                <span class="thumb"><img :src="vars.oss_url_base + it.cover"></span>
                                <h4 class="title">{{it.name}}</h4>
                                <span class="add-info-row"  v-if="rec.mark!=='HUODONG'">
                                    <span><b class="red big">￥{{_get(it,"startPrice",1)}}</b> 起</span>
                                    <span class="right">{{_get(it,"commentNum",0)}}条评论</span>
                                </span>
                                <span class="add-info-row shortcut-class" v-if="rec.mark=='HUODONG'">
                                    <span class="right">时间: <b class="red">{{_get(it,"startTime")|formatDate('YY/M/D')}}-{{_get(it,"endTime")|formatDate('YY/M/D')}}</b></span>
                                </span>
                            </a>
                        </div>
                    </div>

                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </f7-tab>
                <f7-tab id="tab2">资讯内容</f7-tab>
                <f7-tab id="tab3">游记内容</f7-tab>
                <f7-tab id="tab4"></f7-tab>
            </f7-tabs>
        </f7-block>

        <f7-toolbar bottom labels tabbar :key="'home'" ref="botToolBar">
            <f7-link icon="i-shouye"            text="首页" tab-link="#tab1"          active></f7-link>
            <f7-link icon="i-qiyu"              text="奇遇" tab-link="#tab2"          @click.stop.prevent="routeTo(`/list-page/QIYU/`)"></f7-link>
            <f7-link icon="i-zixun"             text="资讯" tab-link="#tab3"          @click.stop.prevent="routeTo(`/list-page/ZIXUN/`)"></f7-link>
            <f7-link icon="i-wode1"             text="我的" tab-link="#tab4"          @click.stop.prevent="routeTo(`/my-gerenzhongxin/`,1)"></f7-link>
        </f7-toolbar>
        <picker-mask ref="pickerMask" :data="dataMark" :map="dataMarkMap">
        </picker-mask>
    </f7-page>

</template>

<script type="text/ecmascript-6">
    import {vars} from "../config";
    import $ from "jquery";
    import _ from "lodash";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    import searchBar from "../components/search-bar.vue";
    import pickerMask from "../components/picker-mark"
    var noCache=true;

    //@click="routeTo(`/map-around/${geo.longitude},${geo.latitude}`)"

    var recommendListData = [
        {name:"推荐景点"    ,mark:"JINGDIAN"    ,icon:"i-tuijianjingdian"   ,iColor:"#4BAD95"},
        {name:"推荐美食"    ,mark:"MEISHI"      ,icon:"i-tuijianmeishi"     ,iColor:"#FCAE04"},
        {name:"推荐活动"    ,mark:"HUODONG"     ,icon:"i-tuijianhuodong"    ,iColor:"#FC5261"},
        {name:"推荐特产"    ,mark:"TECHAN"      ,icon:"i-tuijiantutechan"   ,iColor:"#FFAE6A"},
    ]

    recommendListData.forEach(el=>{
        el.router = vars.dic.type2routeName[el.mark];
    })


    export default {
        name: 'home-page',

        mixins: [vars.mixin_1],

        data () {
            return {
                name: "home-vue",
                bannerImageList: [],
                markList:[],
                pageBg:"",
                searchKey:"",
                account:"",

                //推荐列表数据
                recommendList:[false],
                //菜单下拉显示
                xiashow:true,
                weather:{},
                dataMark:[],
                dataMarkMap:[],
            }
        },

        computed: {
            "user":function(){
                return m.$store.state.user;
            },
            geo:function(){
                var m = this;

                return m.$store.state.geo;
            },

            addr(){return this.$store.getters.address;},

            weather_day:function(){
                var m = this;

                if(!m.weather.future || !m.weather.future.length) return "";
                return m.weather.future[0];
            }
        },

        methods: {
            loadBanner(){
                var m = this;
                return m.req("picture/adpicture?sliderKey=INDEXGG::get")
                    .then(resp=>{
                        if(resp.resCode) {
                            throw resp.message;
                        }

                        m.bannerImageList = resp.list;
                    })
                    .catch(resp=>{
                        vars.toast(vars.trimErrorMessage(resp))
                    })
                ;
            },



            loadIndexData(){
                var m = this;
                m.recommendList=[];
                var promiseList = recommendListData.map((el,index)=>{
                    var url = "merchant/list::get";
                    if(el.mark=="HUODONG") {
                        url="activity/list::get"
                    }

                    var ret =
                        (function(){

                            var i = index;
                            return m.req(url,{
                                mark:el.mark,
                                longitude:m.geo.longitude,
                                latitude:m.geo.latitude,
                                pageNum:1,
                                pageSize:2,
                                code:m.addr.id,
                                //code:611023000000,
                                sorttype:0,
                                recommend:1
                            })
                                .then(resp=>{
                                    if(resp.resCode) {
                                        throw resp.message;
                                    }

                                    return {
                                        list:resp.list,
                                        ...recommendListData[i]
                                    };
                                })
                            ;
                        })()
                    ;

                    return ret;
                })


                Promise.all(promiseList)
                    .then(respList=>{
                        //都完成了

                        respList = respList.filter(el=>el.list.length)
                        if(!respList.length) {
                            m.recommendList="";
                            return;
                        }

                        m.recommendList = respList;
                    })
                    .catch(resp=>{
                        vars.toast(vars.trimErrorMessage(resp))
                    })
                ;

            },

            onSearch:function(query){
                var m = this;
                if(!query)  return;
                m.$refs.searchBar.onClearClick();
                m.$refs.searchBar.ip.val("");
                m.routeTo(`/search-result/${query}`);
            },


            labelClick:function(e,item){
                var m = this;
                if(item.mark == "ZHIBO") {
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
                    return
                }else if(item.mark=="JIAOTONG") {
                    return m.routeTo(`/jiaotong/`)
                }else if(item.mark=="DINGZHI"){
                    return m.routeTo(`/personalCustoization-list/`)
                }else if(item.mark=="FANKUI") {
                    return m.routeTo(`/fankui/`)
                }


                m.routeTo(`/list-page/${item.mark}/`)
            },
            jpush_init:function() {
                var m=this;

                if(!m._get(window,"plugins.jPushPlugin")){
                    console.log("并没有安装jpush");
                    return;
                }

                document.addEventListener('jpush.receiveRegistrationId', function (event) {
                    console.log("最新registrationId")
                    console.log(event.registrationId)
                }, false)


                var localStorage = window.localStorage;
                if(localStorage.jpushToggle=="true"||localStorage.jpushToggle==undefined||localStorage.jpushToggle==null){

                    console.log("开始极光推送");
                    var onDeviceReady = function() {
                        console.log("JPushPlugin:Device ready!");
                        initiateUI();
                    };
                    var getRegistrationID = function() {
                        console.log("进入onGetRegistrationID ")
                        window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
                    };
                    console.log("未进入onGetRegistrationID ")
                    var onGetRegistrationID = function(data) {
                        console.log("以获取onGetRegistrationID ")

                        console.log("onGetRegistrationID"+data);
                        try {
                            console.log("JPushPlugin:registrationID is " + data);
                            if (data.length == 0) {
                                var t1 = window.setTimeout(getRegistrationID, 1000);
                            }
                        } catch (exception) {
                            console.log(exception);
                        }
                    };
                    var onTagsWithAlias = function(event) {
                        try {
                            console.log("onTagsWithAlias");
                            var result = "result code:" + event.resultCode + " ";
                            result += "tags:" + event.tags + " ";
                            result += "alias:" + event.alias + " ";
                        } catch (exception) {
                            console.log(exception)
                        }
                    };
                    var onOpenNotification = function(event) {
                        try {
                            var alertContent;
                            if (device.platform == "Android") {
                                alertContent = event.alert;
                            } else {
                                alertContent = event.aps.alert;
                            }
                            console.log("event_2"+event);
                            //alert("open Notification:" + alertContent);
                            console.log("event:"+event);
                            console.log("event:"+event.extras);
                            console.log("event:"+event.extras.id);
                            console.log("event:"+event.extras.merchantId);
                            console.log("event:"+event.extras.mark);
                            var mark=event.extras.mark;
                            console.log(mark == "JIUDIAN");
                            if( mark== "JIUDIAN"){

                                console.log(mark  + "1")
                                m.routeTo(`/jiudian-index-page/${event.extras.merchantId}/${event.extras.mark}`);

                            }else if(mark == "JINGDIAN"){
                                console.log(mark  + "2")
                                m.routeTo(`/jingdian-products/${event.extras.merchantId}/${event.extras.mark}`)
                            }else if(mark == "MEISHI"){
                                console.log(mark  + "3")
                                m.routeTo(`/meishi-index-page/${event.extras.merchantId}/${event.extras.mark}`)

                            }else if(mark =="TECHAN"){
                                console.log(mark  + "4")
                                m.routeTo(`/techan-index-page/${event.extras.merchantId}/${event.extras.mark}`)

                            }else if(mark =="HUODONG"){
                                console.log(mark  + "5")
                                m.routeTo(`/huodong-index-page/${event.extras.id}/${event.extras.mark}`)
                            }else if(mark =="ZIXUN"){
                                console.log(mark  + "6")
                                m.routeTo(`/zixun-index-page/${event.extras.id}/${event.extras.mark}`)
                            }

                        } catch (exception) {
                            console.log("JPushPlugin:onOpenNotification" + exception);
                        }
                    };
                    var onReceiveNotification = function(event) {
                        try {
                            var alertContent;
                            if (device.platform == "Android") {
                                alertContent = event.alert;
                            } else {
                                alertContent = event.aps.alert;
                            }

                        } catch (exception) {
                            console.log(exception)
                        }
                    };
                    var onReceiveMessage = function(event) {
                        try {
                            var message;
                            if (device.platform == "Android") {
                                message = event.message;
                            } else {
                                message = event.content;
                            }
                            console.log("event_3"+event);
                        } catch (exception) {
                            console.log("JPushPlugin:onReceiveMessage-->" + exception);
                        }
                    };

                    var initiateUI = function() {

                        var tags="ddds";
                        var alias="dfsdfasa";
                        window.plugins.jPushPlugin.setTagsWithAlias(tags, alias, function () {
                            // Success callback
                            console.log(tags + ' - ' + alias)
                        });
                    };
                    getRegistrationID();

                    document.addEventListener("deviceready", onDeviceReady, false);
                    document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
                    document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
                    document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
                    document.addEventListener("jpush.openNotification", onOpenNotification, false);
                }else if(localStorage.jpushToggle=="false"){
                    console.log("停止极光推送");
                    window.plugins.jPushPlugin.clearAllNotification();
                }

            },
            hideMark:function(){
                var m=this;
                m.$refs.pickerMask.show();
            },
            dataMarkScreen:function () {
                var m=this;
                m.$refs.pickerMask.show();
                m.req("advertisement/data",{noCache:true})
                    .then(function(advertisement){
                        if(advertisement.resCode) {
                            throw advertisement.message
                        }
                        m.advertisement=advertisement;
                        m.dataMark = advertisement.data;
                        m.dataMarkMap = advertisement.map;
                        // m.advertisement.map=advertisement.map;

                        /*m.dataMark= advertisement.data.map(el=>{
                            return {
                                img:vars.oss_url_base+ el.picture,
                            }
                        });*/

                    })
                    .catch(function(err){
                        f7.alert(err.toString(),"获取失败");
                    })
                ;


            },
            menushow(){
                //下来菜单显示隐藏
                var m = this;
                if(m.markList.length>10){
                    m.xiashow = !m.xiashow;
                }
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
            },vars.weatherFreshDuration)
        },
        watch:{
            "geo":function(v){
                var m = this;
                m.throttle_weather(m);
            }
        },

        mounted: function () {
            var m = this;
            m.markList = _.get(vars,"startupData.0.list",[]).filter(el=>{
                return !/QIYU|ZIXUN/.test(el.mark)
            })
            m.jpush_init();
            m.dataMarkScreen();

            m.loadBanner();

            m.$watch("addr",addr=>{
                m.loadIndexData();
            },{immediate:true})


             if(!m.weather.feature) {
                m.req_weather();
            }
        },

        components:{searchBar,pickerMask}

    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();

    .home-vue{

        .new-banner{
            position: relative;
            .svg{
                @s:18px;
                background-color: #ffffff;

                //top: 50%;
                position: absolute;
                left: 0;
                width: 100%;
                z-index: 999;
                border-radius: 50%;
                bottom: 0;
                margin-bottom:-@s * 0.55;
            }

            .swiper-pagination{
                bottom: 10px;
            }
        }

        .icon-grid{
            font-size: 0;

            @w:100vw;

            width:@w;

            margin-left:-@page-edge;

            //margin-left:-@w + 100vw;

            a{
                display: inline-block;
                font-size: 1rem;
                width: 20%;
                text-align: center;
                margin-top:0;

                &:nth-child(n+5) {
                    margin-top:@page-edge*0.0;
                }

                b{
                    display: block;
                    font-size: 0.7rem;
                    margin-top: -1em*0.25;
                }
                label>span,>span{
                    display: block;
                    position: relative;
                    transform:scale(0.76);

                    &:after{
                        display: block;
                        content:"";
                        padding-top: 80%;
                    }
                    img{
                        &:extend(.expandin);
                        position: absolute;
                        object-fit: contain;
                    }
                }
            }
            .menuxiala{
                height: 23px;
                text-align: center;
                i{
                    font-size: 2rem;
                }
            }
        }


        .hot-item{
            margin-top:@page-edge*0.75;
            &:before{
                height:@page-edge * 0.618;
                display: block;
                width: 100vw;
                margin-left:-@page-edge;
                background-color: #f6f6f6;
                content:"";
            }
            .item-title{
                font-size: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding:@page-edge/2 0;
                align-items: center;
                .icon{
                    font-size: 1.2em;
                    transform: scale(1.3);
                    margin-right: @page-edge/2;
                }
                a{
                    font-size: 0.8em;
                }
            }
            .item-grid{


                font-size: 0;
                .item{
                    font-size: 0.8rem;
                    display: inline-block;
                    vertical-align: top;
                    width: calc(~"50%" - @page-edge/2);
                    //background-color: #f0f0f0;
                    min-height: 4em;
                    &:nth-child(2n){
                        margin-left:@page-edge;
                    }
                    .thumb{
                        position: relative;
                        background-color: #f0f0f0;
                        display: block;
                        margin-bottom: 0.5em;
                        img{
                            &:extend(.expandin);
                            position: absolute;
                        }
                        &:after{
                            content:"";
                            display: block;
                            padding-top: 60%;
                        }
                    }
                    .title{
                        padding:@page-edge/4 0;
                        line-height: 1.2em;
                    }
                    .add-info-row{
                        margin-top: -0.25em;
                        display: flex;
                        align-items: flex-end;
                        justify-content:space-between;
                        .red{
                            color: #FD5263;
                        }
                        .big{
                            font-size: 1.2em;
                        }
                    }
                }
            }
        }

        #tab1{
            padding: 0 @page-edge;
            box-sizing: border-box;
            overflow-y: auto;
            //margin-top:@page-edge;
        }

        .page-content{
            overflow: hidden;
            background-color: #ffffff;
        }

        .content-block{
            margin: 0;
            padding: 0;
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
                height: calc(~"100vh" - (@top-bar-height * 2));
            }

            .ios &{
                .tab{
                    height: calc(~"100vh" - ((@top-bar-height * 2) + @ios-status-bar-height));
                }
            }
        }


        .banner{
            overflow: hidden;
            width: 100vw;
            margin-left: -@page-edge;
            .swiper-container{
                height: 18vh;
            }

            .swiper-slide{
                background-color: #25cca5;
                img{
                    display: block;
                    &:extend(.expandin);
                    object-fit:cover;
                }
            }

            .weather-warpper{
                display: flex;
                justify-content: space-between;
                margin-top:@page-edge;
                position: absolute;
                right: 12px;
                z-index: 99999;
                top: -5px;
                color: #fff;

                .weather-container{
                    text-align: right;
                }
            }


        }


        #tab2,#tab3,#tab4{
            padding-top: 33vh;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.6);
        }
    }
    .home-vue{

        #tab4 {
            overflow-y: scroll;
            height: calc(~"100vh" - 94px);
            padding: 0;
            background-color: @cl_flat_light;
            .list-block.media-list .item-inner {
                padding: 0;
            }
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
    }





</style>
