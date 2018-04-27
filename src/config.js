import $ from "jquery"
import mo from "moment";

import "native-toast/dist/native-toast.css";
import nativeToast from 'native-toast'


import lockr from "lockr";
lockr.prefix = "qy-";

import thunks from "thunks";
var thunk = thunks();
import _ from "lodash"
import Vue from "vue";

let jq = $;
let null_img;
!function () {
    null_img = "data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAQAAAAAAAAAAAAAAAAAAAAAA8J8HasaIBWRZAAAAAElFTkSuQmCC";
}()

import defaultGeoFunc from "./assets/default-geo"
import defaultWeather from "./assets/default-weather"

let defaultGeo = defaultGeoFunc();

Vue.mixin({
    mounted:function(){
        var m = this;
        vars.comp[m.name] = m;
    }
})

const vars = {
    comp:{},
    Vue,
    $,
    thunk,
    /**
     * 启动画面停留时间
     */
    startup_sreen_dura:3600,

    app_name:"全域旅游-金丝峡",
    startup_sreen_adv_dura:6000,
    varsionPrefix:(function(){
        // return ".tr";
        return ".zj";
    })(),
    // startup_sreen_dura:0,
    server_url_base:(function(){
        var u = lockr.get("server_url_base");
        if(u) {
            return u;
        }
        return "http://192.168.1.123:8080/qyly/app/";           //刘力
        return "http://117.34.70.41:16005/app/";                //tr正式
        return "http://192.168.1.123:80/qyly/app/";             //刘力
        return "http://117.34.70.41:16004/app/";                //zj正式
        return "http://117.34.70.41:16003/app/";                //自己测试
        return "http://192.168.1.2:8080/qyly/app/";             //内部测试
        return "http://trgis.amx.viphk.ngrok.org/qyly/app/";    //.2内部测试
        return "http://117.34.70.41:16002/app/";                //中际线上
        return "http://trgis.amx.viphk.ngrok.org/qyly/app/";    //.2内部测试
        return "http://192.168.1.2:8080/qyly/app/";             //内部测试
        return "http://117.34.70.42:16001/app/";                //中际app-store线上
        return "http://trgis.juvenile.ngrok.cc/qyly/app/";
        return "http://c5dac6a5.ngrok.io/qyly/app/";
        return "http://192.168.1.222/qyly/app/";
        return "http://192.168.1.222:80/";
    })(),


    /**
     * 定位失败重新定位的间隔
     */
    locatFailtRetryDuration:8000,


    debugResPrefix:"http://10.168.1.10:9002/",
    cordovaJsPrefix:"http://10.168.1.10:9102/",


    /**
     * 天气信息刷新间隔
     */
    weatherFreshDuration:2*60*60*1000,

    /**
     * 到景点距离小于改数字（米），就认为到达该景点
     */
    subViewScale:2000,

    /**
     * 位置信息更新间隔
     */
    positionFreshDuration:10 * 1000,

    /**
     * 默认位置，在定位失败时候使用该位置
     */
    defaultGeo,

    /**
     * 默认天气
     */
    default_weather:defaultWeather(),


    dateTody:function(){
        return new Date();
    },

    dateTomorrow:function(){
        return new Date(new Date()*1 + 24*60*60*1000)
    },

    //条目共有的字段
    itemCommData:{
        id:"",
        mark:""
    },


    oss_url_base:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/",

    weather_url_base:"http://apicloud.mob.com/v1/weather/query?key=1c9d0c3aabd38",


    /**
     * 加载初始化的数据
     * @returns {*}
     */
    loadStartUpData:function(){
        return new Promise(function(resolve,reject){
            net("pagegroup/label",{pageNum:1,pageSize:30})
                .then(resolve)
                .catch(function(){

                    //给一次重试的机会
                    setTimeout(function(){
                        net("pagegroup/label",{pageNum:1,pageSize:30}).then(resolve,reject)
                    },2000)
                })
            ;
        })

    },

    /**
     * 启动数据缓存
     */
    startupData:"",

    /**
     * 对地图的一些封装
     */
    maptool:{
        _geocoderPromise:null,
        geocoder:function(){
            if(!vars._geocoderPromise) {
                vars._geocoderPromise = new Promise(function(resolve,reject){
                    AMap.service('AMap.Geocoder',function(){//回调函数
                        resolve(
                            new AMap.Geocoder({
                                //city: "010"//城市，默认：“全国”
                            })
                        )
                    })
                })
            }
            return vars._geocoderPromise;
        },
        /**
         * 获取一个marker
         * @param position
         * @param icon_class
         * @param map
         * @returns {AMap.Marker}
         */
        getMaker:function(position,icon_class,map){
            var opt = { offset: new AMap.Pixel(0,0)}

            if(typeof icon_class == "string") {
                opt.content = "<i class='mapicon "+ icon_class +"'><\/i>"
            }else if(icon_class){
                opt.icon = icon_class;
            }

            if(position) {
                opt.position = position;
            }

            if(map) {
                opt.map = map;
            }

            var mk = new AMap.Marker(opt);
            if(opt.content) {
                mk.__default_icon_class = icon_class;
            }
            return mk;
        },

        /**
         * 修改marker的class
         * @param marker
         * @param icon_class
         */
        setMarkerIcon:function(marker,icon_class){
            marker.setContent("<i class='mapicon "+ icon_class +"'><\/i>")
        },

        resetMarkerIcon:function(marker){
            console.log(marker.__default_icon_class);
            vars.maptool.setMarkerIcon(marker,marker.__default_icon_class)
        },

        iconBlue:function(){
            var m = this;
            if(!m._iconBlue) {
                m._iconBlue =  new AMap.Icon({image:require("./assets/markicon/mark_bs.png")})
            }
            return m._iconBlue;
        },
        iconRed(){
            var m = this;
            if(!m._iconRed) {
                m._iconRed =  new AMap.Icon({
                    image:require("./assets/markicon/mark_rs.png"),
                    size:new AMap.Size(36,36),
                    imageSize:new AMap.Size(38,63)
                })
            }
            return m._iconRed;
        }
    },


    //通过geo生成的默认地址
    defAddr:{},

    geoToAddr(geo,type="city"){
        var ret = {
            type,
            provinceName            :   geo.province,
            provinceId              :   geo.adCode||geo.adcode,
            cityName                :   geo.city,
            cityId                  :   geo.adCode||geo.adcode,
            countyId                :   "",
            countyId                :   "",
            //name                    :   geo[type+"Name"],
            //id                      :   geo,
        }


        if(type=="city") {
            ret.cityId = (~~(geo.adCode/100))*100;
        }else if(type=="province") {
            ret.provinceId = (~~(geo.adCode/10000))*10000;
        }

        ret.name = ret[type+"Name"];
        ret.id = ret[type+"Id"];

        return ret;
    },


    _dicMark2actions:{
        expand:false,
        "jingdian,jiudian,meishi,techan,xinalu":{
            filterList:"classify/classifySearch",
            list:"list",
            type:"1",
            listSortData:(function(){
                return _.merge({},{
                    instance:"select",
                    displayLabel:"排序",
                    label: "排序",
                    type: "sorttype",
                    value: 0,
                    options: [
                        {name: "距离优先", value: "1"},
                        {name: "好评优先", value: "2"},
                        // {name: "热门优先", value: "3"},
                    ]
                })
            })(),
            filterData:function(odata){
                var list = odata.list;
                list.forEach(el=>{
                   el.values = [];          //记录选择状态
                   el.valuesOld = [];       //取消过滤时还原数据
                   el.childrenClassify.forEach(el=>{ el.checked = false; })
               })
                return {
                    instance:"filter-gp",
                    data:{ list, value: []}
                }
            }
        },
        "default":{
            filterList:"classify/otherclassify",
            list:"list",
            type:"0",
            listSortData:(function(){
                return _.merge({},{
                    instance:"checkButton",
                    field:"recommend",
                    label: "推荐",
                    value: "",
                    normalValue:"",
                    checkedValue:1
                })
            })(),
            filterData:function(odata){
                var list = odata.list;
                var cataObj = {
                    values:[],
                    valuesOld:[],
                    countList:[],
                    parentClassify: {
                        type:1,
                        name:"分类"
                    },
                    childrenClassify: []
                }
                list.forEach(el=>{
                    cataObj.childrenClassify.push({
                        id:el.id,
                        name:el.name,
                        checked:false,
                    })
                })

                return {
                    instance:"filter-gp",
                    data:{ list:[cataObj], value: [], field:"type"}
                }
            }
        }
    },

    //
    mark2actions:function(mark) {
        var dic = vars._dicMark2actions;
        if(!dic.expand) {
            dic.expand = true;
            _.each(dic,function(el,k){
                k.split(",").forEach(function(k1){
                    dic[k1.toUpperCase()]=el;
                })
            })
        }
        return dic[mark]||dic.default;
    },


    getCordovaObject:function(){
        return vars.deviceready().then(function(){
            return cordova;
        })
    },


    _requestAndroidPermissionsPromiseDic:{},

    //请求权限
    requestAndroidPermissions:function(permission){
        var dic = vars._requestAndroidPermissionsPromiseDic;

        if(dic[permission]) {
            return dic[permission];
        }

        var p = vars.deviceready()
            .then(function(){
                if(cordova.platformId!="android"){
                    return "noNeedRequest"
                }else{
                    return cordova.plugins.permissions;

                }
            })
            .then(function(permissions){
                if(!permissions){
                    //throw "权限请求插件获取失败"
                    throw("权限获取失败")

                }else if(permissions == "noNeedRequest") {
                    return Promise.resolve();
                }else{
                    return new Promise(function(resolve,reject){
                        permissions.requestPermission(permission,resolve,reject)
                    })
                }
            })
        ;

        return dic[permission] = p;
    },



    /**
     * deviceready判定
     */
    __deviceReadyPromise:null,
    deviceready:function(){
        if(vars.__deviceReadyPromise) {
            return vars.__deviceReadyPromise;
        }

        if(window.DEVICE_READYED) {
            return vars.__deviceReadyPromise = Promise.resolve();
        }else{
            return vars.__deviceReadyPromise = new Promise(function(resolve,reject){
            document.addEventListener("deviceready", function(){
                    resolve();
            }, false);
                setTimeout(function(){
                    reject("deviceReady超时")
                },1000)
            })
        }
    },


    /**
     * 生成一个f7日历组件
     * @param config
     */
    getCalendar:($=>{
        var dateFormaterMoment = "YYYY-M-D";
        var monthArray = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二"];
        var dayArray = ["周日","周一","周二","周三","周四","周五","周六"];
        return config=>{
            return f7.calendar(_.merge({
                monthNames:monthArray,
                monthNamesShort:monthArray,
                dayNames:dayArray,
                dayNamesShort:dayArray
            },config))
        }
    })(),


    //缓存当前的mark:JINGDIAN,JIUDIAN...
    currentMark:"",
    __getCuurentMarkByMerchId:function(merchId){
        if(vars.currentMark) {
            return Promise.resolve(vars.currentMark);
        }
        return net("pagegroup/merchanttype",{id:merchId})
            .then(function(data){
                var mark = _.get(data,"list.0.mark")
                if(mark) vars.currentMark = mark;
                return vars.currentMark;
            })
            .catch(function(err){
                console.log("获取商户类型失败:",err);
            })
        ;
    },


    //酒店订单信息缓存
    jiudian_order_cache:{
        dateIn:0,
        dateOut:0,
        merchantId:0,
        orderObject:{}
    },
    //线路订单信息缓存
    xianlu_order_cache:{
        orderLine:{}
    },

    /**
     * app mounted完成后，自动路由到的地址
     */
    defalut_router_link:"/home/",

    lockr,

    null_img,

    colors:["#01BF9D","#5BABE6","#1FCF6D","#9C56B9","#334960","#F59C00","#C43926","#7E8C8D"],

    getColor(index){
        var leng = vars.colors.length;
        return vars.colors[index%leng];
    },


    validator:{
        phone:function(phone,m){
            return /^1(3|4|5|7|8)\d{9}$/.test(phone);
        },
        identify:function(string){
            return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(string);
        }
    },

    /**
     * 播放声音，声音的地址
     * @returns {*|jQuery}
     */
    playSound: function () {
        vars.stopSound();
        var callback = arguments[1];
        return $(
            '<audio class="sound-player" autoplay="autoplay" style="display:none;">'
            + '<source src="' + arguments[0] + '" />'
            + '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>'
            + '</audio>'
        ).appendTo('body').each(function(i){
            var me=$(this);
            me.on("canplaythrough",callback);
            me.data().playCallback = callback;
        });
    },

    /**
     * 停止播放
     */
    stopSound: function () {
        $(".sound-player").each(function(i){
            var me=$(this);
            me.off("canplaythrough",me.data().playCallback);
        }).remove();
    },


    __media:"",
    playAudio:function(src,onPlayCallback){
        vars.stopAudio();
        if(!window.Media) {
            return vars.playSound.apply(vars,arguments);
        }else{
            vars.__media = new Media(
                src,
                function(success){
                    console.log();
                },
                function(error){
                    console.log("声音播放失败",err);
                }
            )
            vars.__media.play();
        }
    },
    stopAudio:function(){
        if(!window.Media) {
            vars.stopSound();
        }else{
            if(vars.__media) vars.__media.stop();
        }
    },


    tts:function(text){
        var text = html2text(text)
        return "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=" + encodeURIComponent(text);
    },

    /**
     * 是否播放中
     * @returns {boolean}
     */
    isPlayingSound:function(){
        return !!$(".sound-player").length;
    },

    /**
     * 一些字典
     */
    dic:{
        //分类id到分类信息
        type_id2type:{},

        //列表页到各分类入口的页映射
        type2routeName:{
            default         :           "common-index-page",
            JINGDIAN        :           "jingdian-index-page",
            JIUDIAN         :           "jiudian-index-page",
            WENHUA          :           "wenhua-index-page",
            MEISHI          :           "meishi-index-page",
            ZIXUN           :           "zixun-index-page",
            HUODONG         :           "huodong-index-page",
            JIAOTONG        :           "jiaotong-index-page",
            QIYU            :           "qiyu-index-page",
            DIANGU          :           "diangu-index-page",
            TECHAN          :           "techan-index-page",
            DAOYOU          :           "daoyou-index-page",
            XIANLU          :           "xianlu-index-page",

        },

        _idMark2Item:{},
        idMark2Item:function(id,mark,item){
            if(item === undefined) {
                return vars.dic._idMark2Item[id+"_"+mark];
            }else{
                vars.dic._idMark2Item[id+"_"+mark]=item;
            }
        },

    },


    html2text,

    /**
     * 地址对象完善
     * @param address
     */
    fixAddressObject(address){
        if(address.type=="province"){
            address.level = 3;
            if(!address.provinceId) {
                address.provinceId = address.id;
                address.provinceName = html2text(address.name);
            }

            if(!address.provinceName) {
                address.provinceName = html2text(address.name);
            }
        }else  if(address.type=="city"){
            address.level = 2;
            if(!address.cityId) {
                address.cityId = address.id;
                address.cityName = html2text(address.name);
            }

            if(!address.cityName) {
                address.cityName = html2text(address.name);
            }

        }else  if(address.type=="county"){
            address.level = 1;
            if(!address.countyId) {
                address.countyId = address.id;
                address.countyName = html2text(address.name);
            }

            if(!address.countyName) {
                address.countyName = html2text(address.name);
            }
        }
    },


    getProvince(){
        return net(`position/province::get`)
            .then(resp=>{
                if(!resp.list)  return resp;
                resp.list.forEach(el=>{
                    el.type="province"
                    vars.fixAddressObject(el);

                })
                return resp;
            });
    },

    getCity(provinceCode){
        return net(`position/getCity?code=${provinceCode}::get`)
            .then(resp=>{
                if(!resp.list)  return resp;
                resp.list.forEach(el=>{
                    vars.fixAddressObject(el);
                })
                return resp;
            })
        ;
    },

    getCounty(cityCode){
        return net(`position/getCounty?code=${cityCode}::get`)
            .then(resp=>{
                if(!resp.list)  return resp;

                resp.list.forEach(el=>{
                    vars.fixAddressObject(el);
                })
                return resp;
            })
        ;
    },

    mixin_1:{
        activated:function(){
            console.log("actived");
        },

        deactivated:function(){
            console.log("deactived");
        },

        mounted:function(){

        },
        directives:{
            /**
             * 页面内的loading效果
             */
            lodingInView:(function(){
                return {
                    inserted:function(el){
                        $(el).addClass("ball-clip-rotate-multiple loading-in-view").append("<div></div><div></div>")
                    }
                }
            })(),
            /**
             * 更换page背景指令
             */
            pageContentBg:(function(){

                var change_page_bg = function(el,bd){


                    if(!bd.value)    return;

                    var imgurl = bd.value;
                    if(imgurl.substr(0,1) != "/") {
                        imgurl = vars.oss_url_base + imgurl;
                    }
                    $(el).parents(".page:first").find(">.page-content").css({
                        backgroundImage:"url(" + imgurl + ")"
                    });
                }

                return {
                    inserted:change_page_bg,
                    update:change_page_bg
                }
            })()
        }
    },

    mixin_2:{
        methods:{

            /**
             * 根据id查找列表中的对象
             * @param id
             * @param item_data_field
             * @param id_field
             */
            getItem:function(id,item_field,list){
                var m = this;
                return _.find(list,[item_field,id]);
            }
        }
    },

    /**
     * 时间格式化
     */
    dateFormaterMoment:"YYYY-M-D",

    monthArray:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二"],
    dayArray:["周日","周一","周二","周三","周四","周五","周六"],

    /**
     * 获取一个f7日历
     */
    getCalendar:function(config){
        var monthArray = []
        return f7.calendar(_.merge({
            monthNames:vars.monthArray,
            monthNamesShort:vars.monthArray,
            dayNames:vars.dayArray,
            dayNamesShort:vars.dayArray
        },config))
    },


    /**
     * 转换callbak到promise形式
     * 使用方法
     * callbackToPromise.call(transFunction,param1,param2...,"|",param-1,param-2...):Promise
     * @returns {Promise}
     */
    callbackToPromise:function(){
        var args = Array.prototype.slice.call(arguments);
        var func = this;
        return new Promise(function(resolve,reject){
            var splitIndex = _.indexOf(args,"|");
            if(splitIndex==-1) {
                splitIndex=args.length;
            }
            args.splice(splitIndex,1,resolve,reject)
            if(!func) {
                reject("调用的方法不存在")
            }

            if(typeof func == "function") {
                func.apply(null,args);
            }else if(func.callback){
                func.callback.apply(func.scope,args)
            }
        })
    },

    /**
     * 用来停止then chian链
     */
    stopPromiseChian:function(){
        throw "stop-promise-chain";
    },


    /**
     * 在promise里的提示
     * @param err
     * @param title
     */
    trimErrorMessage:function(err,title){
        if(err == "stop-promise-chain") return "";
        if(!err) return "";
        return err.message || err.msg || err.text || err.title||err.statusText || err.toString()
    },


    share:function(type,title,url,image,description){
        type            =   type||"qq";
        title           =   title||"全域旅游APP";
        url             =   url||"http://117.34.70.41:16003/assets/data/share/index.html";
        image           =   image||vars.oss_url_base + "MERCHANT/0e93e9cbcbd7440aa06b9e060b12f3dc/201708021418544263.jpg";
        description     =   description||"全域旅游描述";
        if(/^qq/.test(type)) {
            return Promise.resolve()
                .then(function(){
                    return vars.callbackToPromise.call(
                        QQSDK.checkClientInstalled,
                        "|",
                        {client:QQSDK.ClientType.QQ}
                    )
                })
                .catch(function(){
                    f7.alert("未安装QQ客户端")
                    vars.stopPromiseChian();
                })
                .then(function(){
                    var args = {
                        client:QQSDK.ClientType.QQ,
                        scene:/zone/.test(type)?QQSDK.Scene.QQZone:QQSDK.Scene.QQ,       //QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
                        url,title,image,description
                    };
                    return vars.callbackToPromise.call(QQSDK.shareNews,"|",args)
                })
            ;
        }else if(/^weixin/.test(type)){
            return Promise.resolve()
                .then(function(){
                    return vars.callbackToPromise.call(Wechat.isInstalled);
                })
                .catch(function(err){
                    f7.alert("微信客户端未安装");
                    vars.stopPromiseChian();
                })
                .then(function(){
                    return vars.callbackToPromise.call(Wechat.share,{
                        scene: /timeline/.test(type)?Wechat.Scene.TIMELINE:Wechat.Scene.SESSION,   // share to Timeline
                        message:{
                            title, description,
                            thumb: image,
                            media: {
                                type: Wechat.Type.WEBPAGE,
                                webpageUrl: url
                            }
                        }
                    })
                })
            ;

        }else if(/weibo/.test(type)) {
            return Promise.resolve()
                .then(function(){
                    return vars.callbackToPromise.call(WeiboSDK.checkClientInstalled)
                })
                .catch(function(){
                    f7.alert("微博客户端未安装");
                    vars.stopPromiseChian();
                })
                .then(function(){
                    var args = {};
                    args.url = url;
                    args.title = title;
                    args.description = description;
                    args.image = image;



                    // args.url = "http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/config/share/index.html";
                    // args.title = "全域旅游APP";
                    // args.description = "全域旅游描述";
                    //args.image = "qyly-shangnan.oss-cn-beijing.aliyuncs.com/MERCHANT/0e93e9cbcbd7440aa06b9e060b12f3dc/201708021418544263.jpg";


                    return Promise.resolve()
                        .then(function(){
                            return vars.getCordovaObject()
                        })
                        .then(function(cdv){

                            //todo:iso平台微博分享如果带有有效图片路径，会触发不了分享
                            //todo:信息补充，有可能图片地址过长会发起分享失败
                            if(cdv.platformId!="android"){
                                args.image = "http://trgis.com/trgis/html/news/images/tx_big_CLASSIC-CASE.png";
                                //delete args.image;
                            }

                            return vars.callbackToPromise.call(WeiboSDK.shareToWeibo,"|",args);
                        })
                    ;

                })
            ;

        }
    },

    toast:function(msgOrConfig,delay){
        if(typeof msgOrConfig == "string") {
            msgOrConfig = {
                message: msgOrConfig,
                timeout: delay||2000
            }
        }
        nativeToast(msgOrConfig)
    },



    mathAdd(n1,n2){
        return (n1 * 1000 + n2 *1000)/1000;
    }
}

window.vars = vars;

vars.defAddr = vars.geoToAddr(defaultGeo);


Array.prototype.step = function(callback){
    var m = this;
    if(typeof m.__point == "undefined") {
        m.__point = 0;
    }

    var next = function(){
        callback(m[m.__point],m.__point,m.__point<m.length?next:null);
        m.__point++;
    }
    next();
}

/**
 * 把图片转换为base64编码
 * @param url
 * @returns {Promise}
 */
vars.image2dataUri = function(url,maxWidth,ratio){
    var img = new Image();
    maxWidth = maxWidth || 950;
    ratio = ratio||0.9;

    return new Promise(function(resolve,reject){
        img.addEventListener("load", function () {
            var canvas = document.createElement("canvas");
            var imgContext = canvas.getContext("2d");

            var width = img.width;
            var height = img.height;
            if(width>maxWidth) {
                height = height * maxWidth / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            try{
                imgContext.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg",0.8));
            }catch(err){
                reject(err);
            }
        }, false);

        img.addEventListener("error",function(err){
            reject(err);
        },false)
        img.src = url;
    })
}

/**
 * 根据url缓存并且获取图片
 * @param url
 * @param gpName
 * @param maxWidth
 * @returns {*}
 */
vars.cacheImageToBase64 = function(url,gpName,maxWidth){
    if(typeof url === "string") {
        url = [url]
    }

    var nameUrl = gpName + "Url";
    var imageUrl = gpName + "Image";

    var cachedUrl = lockr.get(nameUrl);

    //存在旧缓存，并且新旧相同，返回缓存
    if(cachedUrl && cachedUrl.join(",") == url.join(",")) {
        return Promise.resolve(lockr.get(imageUrl));
    }

    //缓存并返回
    var tks = url.map(function(el){
        return function(callback){
            thunk(vars.image2dataUri(vars.oss_url_base + el,maxWidth))(callback)
        }
    })

    return new Promise(function(resolve,reject){
        thunk.all(tks)(function(err,value){
            if(err) {
                reject(err);
            }
            resolve(value);
            lockr.set(nameUrl,url);
            lockr.set(imageUrl,value);
        })
    })
}





import net_cache from "./libs/ReqestCache"

/**
 * 进行网络操作
 * @param option
 * @param params
 * @param custom_url    可以使用自定的url
 */
var net = function(action,params,custom_url){
    var method = "POST";
    params = params||{};

    //todo:关闭缓存
    //params.noCache = true;

    if(/(.*)::(\w+)$/.test(action)) {
        action = RegExp["$1"];
        method = RegExp["$2"];
    }


    return new Promise(function(resolve,reject){

        var cachedata = net_cache.get(action,params);

        if(cachedata && !params.noCache) {
            resolve(cachedata);
            return;
        }
        delete params.noCache
        !function(){
            if(method == "static") {
                return new Promise(function(resolve,reject){
                    try{
                        require(["./static-data/" + action  + ".json"],function(data){
                            resolve(data)
                        })
                    }catch(e){
                        reject(e)
                    }
                })
            }else{
                var dataType = "json";
                if(params.dataType) {
                    dataType = params.dataType;
                    delete params.dataType;
                }
                return $.ajax({
                    method:method,
                    url:/^http/.test(action)?action:((custom_url||vars.server_url_base)+ action),
                    dataType:dataType,
                    data:_.merge({
                        token:vars.store.getters.ut
                    },params),
                    //jsonp,
                })
            }
        }().then(
            function(data){
                if(data.resCode) {
                    console.log("err:net",data);
                }else{
                    net_cache.cache(action,params,data)
                }
                resolve(data)
            },
            function(err){
                console.log(err);
                reject(err);
            }
        )
    })
}

vars.net = net;
let mixin = {
    data(){

        var vvv = {};
        [
            "app_name",
            "varsionPrefix",
            "null_img",
            "server_url_base",
            "oss_url_base"
        ].forEach(el=>vvv[el]=vars[el]);
        return {
            vars:vvv,
            __inited:false
        }
    },

    methods:{
        $,
        /**
         * 打电话
         * @param no
         */
        phoneCall:function(no){
            if(!no) {
                return f7.alert("无电话信息")
            }
            return vars.requestAndroidPermissions("android.permission.CALL_PHONE")
                .then(function () {
                    return new Promise(function (resovle, reject) {
                        window.PhoneCaller.call(no, resovle, function (err) {
                            f7.alert("拨号失败：" + no);
                            console.log(err);
                            reject(err)
                        })
                    })
                })
            ;

        },
        $dom:function(){
            var m = this;
            if(!m._$el) {
                m._$el = $(m.$el);
            }
            return m._$el;
        },
        find:function(selector){
            var m = this;
            return m.$dom().find(selector);
        },

        _set:_.set,
        _get:function(object,path,defaultValue){
            var ret = _.get(object,path,defaultValue);
            return ret||defaultValue;
        },
        got:function(path,def){
            var ret = _.get(this,path,"")
            return ret||def;
        },
        _size:_.size,

        req(action,req_data){
            var m = this;

            req_data=req_data||{};

            var noTryLogin = !!req_data.noTryLogin;
            delete req_data.noTryLogin;

            return new Promise(function(resolve,reject){
                return net(action,req_data)
                    .then(function(data){
                        var res = data.resCode;

                        //无效tooken
                        if((res==-1 || res ==-2 || res==-3) && !noTryLogin) {

                            var tk = vars.store.state.userTooken;
                            vars.store.commit("clearUserTooken");

                            if(res==-3) vars.toast(vars.trimErrorMessage(data));

                            //json无效强制登录，登录成功后重新请求一次
                            m.__try_login()
                                .then(function(){
                                    return m.req(action,req_data);
                                })
                                .then(resolve)
                                .catch(reject)
                            ;
                            return;
                        }

                        //续签tooken
                        if(res==-2) {

                            return;
                        }
                        resolve(data);
                    })
                    .catch(function(err){
                        reject(err)
                    })
            })
        },
        logout:function(){
            var m = this;
            m.$store.commit("clearUserTooken");
            m.$store.commit("saveUser",{});

            vars.dataAnalytical.stop();
            //f7.mainView.loadPage("/home/");
        },

        //设置页面背景
        setBg:function(imgurl,className){
            var m = this;
            if(!/^\/|http/.test(imgurl)){
                imgurl = vars.oss_url_base + imgurl;
            }
            className=className||"black-mask";
            jq(m.$el).append("<div class='page-bg-img " +className+ "'><img src='"+ imgurl +"' alt=''></div>")
        },

        /**
         * 收藏
         */
        collectAdd:function(objectId,mark){
            var m = this;
            return m.req("collect/add",{ objectId, mark, noCache:true})
        },

        collectCancel:function(objectId){
            var m = this;
            return m.req("collect/cancel",{objectId, noCache:true})
        },

        collectToggle:function(object,mark){
            var m = this;
            var id = object.id || object.data.id;

            return  m.__try_login()
                .then(function(){
                    return  m.req("detail",{id,mark,noCache:true})
                })
                .then(function (data){
                    if(data.collected) {
                        return m.collectCancel(id).then(function(){
                            object.collected = false;
                        })
                    }else{
                        return m.collectAdd(id,mark).then(function(){
                            object.collected = true;
                        })
                    }
                })
            ;
            return
        },


        /**
         * 登录并且返回promise，以跟踪登录是否成功或者取消
         * @return {Promise}
         */
        openLogin:function(){
            var m = this;
            m.pureOpenLogin();
            return new Promise(function(resolve,reject){
                m.$store.commit("saveLoginPromise",{resolve,reject})
            })
        },

        pureOpenLogin:function(){
            var m = this;
            $("#login-screen").show().removeClass("modal-out modal-in").addClass("modal-in");
            f7.openModal("#login-screen");
            // f7.loginScreen();
        },
        closeLogin:function(){
            var m = this;
            f7.closeModal("#login-screen");
        },
        isLogined:function(){
            var m = this;
            return !!m.$store.state.userTooken;
        },
        /**
         * 页面动画之前会进入
         * @param e
         * @param page
         */
        ______beforeanimation:function(e,page){
            var m = this;

            var args = Array.prototype.slice.call(arguments)

            if(!m.isLogined()) {
                var promise = m.openLogin();
                args.push(promise);
                promise.then(
                    function(){
                        console.log("成功");
                        _init();
                    },
                    function(err){
                        console.log("失败");
                        m.$router.back();
                    }
                )
            }else{
                console.log("成功");
                _init();
            }

            if(m.__beforeanimation) {
                m.__beforeanimation.apply(m,args)
            }

            function _init(){
                if(m._init){
                    m._init();
                }
            }
        },


        /**
         * login-panel页面跳转（比如从登陆页跳转到注册页，在跳回来）之后直接调用m.$router.back会失效
         * @param config
         * @private
         */
        __routerBack:function(config){
            f7.router.back(f7.mainView,config)
        },

        __try_login:function(){
            var m = this;
            return new Promise(function(resolve,reject){
                if(m.isLogined()) {
                    resolve()
                }else{
                    m.openLogin().then(resolve,reject);
                }
            })
        },

        /**
         * 跳转到目标地址，如果第二个参数true，则验证登录，若登录着才跳转
         * @param url 目标地址
         * @param verifyLogin
         */
        routeTo:function(url,verifyLogin){
            var m = this;

            if(verifyLogin) {
                !function(m,url){
                    m.__try_login()
                        .then($=>{
                            m.routeTo(url);
                        })
                        .catch($=>{})
                    ;
                }(m,url);
            }else{

                m.getF7Router().load({url:url})
            }
        },

        getF7Router(){
            var m = this;
            return m.getF7View().router;
        },

        getF7View(){
            var m = this;

            if(m.f7View) {
                return m.f7View;
            }

            var viewName = Dom7(m.$el).parents(".view").attr("id");

            if(!f7.__name2view) {
                f7.__name2view = {};
            }

            var view = f7.__name2view[viewName];

            if(view) {
                return view;
            }

            for(var i = 0; i < f7.views.length; i++) {
                var el = f7.views[i];
                if(el.container.getAttribute("id") == viewName) {

                    m.f7View = el;
                    f7.__name2view[viewName] = el;
                    return el;
                }
            }
        },

        /**
         * 导航到
         */
        directTo(point){
            var m = this;
            var geo = m.$store.state.geo;

            if(typeof AMapNavi == "undefined") {
                vars.toast("导航失败:导航插件未找到");
                return;
            }

            return vars.callbackToPromise.call(
                AMapNavi.navigation,
                {
                    lng:geo.longitude,
                    lat:geo.latitude
                },
                {
                    lng:point.longitude,
                    lat:point.latitude
                },
                0
            ).catch(function(err){
                f7.toast("导航失败");
                console.log("导航失败",err);
            })
        },

        /**
         * 由于f7框架的bug比较多,上面的route方法偶会失灵
         */
        routeToMethod2:function(url,f7View){
            var m = this;
            f7View.loadPage(url)
        },

        getView:function(viewId){
            return _.find(f7.views,(v=>v.container.id == viewId));
        },

        goback:function(noAnimate){
            var m = this;
            f7.mainView.back({ animatePages: !noAnimate});
        }
    },

    filters:{

        /**
         * 默认单位米，如果大于1k显示公里
         * @param length
         */
        length:function(length){

            if(!length) {
                return "0米"
            }

            if(length<1000) {
                return length + "米"
            }else{
                return (~~(length/1000 * 100))/100 + "千米"
            }
        },

        strleng:function(value,n){
            return (value||"").strleng(n);
        },

        //时间格式化
        formatDate:function(v,formater){
            return mo(v).format(formater)
        },

        html2text:function(html){
            return html2text(html);
        },

        ossResize:function(url,width,height){
            var endfix;
            if(height===undefined) {
                endfix = `?x-oss-process=image/resize,w_${width},m_fill`
            }else{
                endfix = `?x-oss-process=image/resize,h_${height},w_${width},m_fill`;
            }
            return url.split("?")[0]+endfix;
        },
        interceptionWord:function (value) {
            var valueWord="";
            valueWord=value
            return valueWord.slice(0,18);
        }
    },
    

};


function html2text(html){
    if(!html) {
        return "";
    }
    html = html.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    html = html.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    html = html.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    html = html.replace(/&nbsp;/ig,'');//去掉&nbsp;
    return html;
}

function strleng(str,n,more_sign){
    more_sign = more_sign || "..."
    var strReg=/[^\x00-\xff]/g,  _str=str.replace(strReg,"**"),  _len=_str.length;
    if(typeof n == "string")    n=n*2;
    if(_len>n){
        var _newLen=Math.floor(n/2),_strLen=str.length
        for(var i=_newLen;i<_strLen;i++){
            var _newStr=str.substr(0,i).replace(strReg,"**");
            if(_newStr.length>=n) return str.substr(0,i) + more_sign;
        }
    }else   return str;
}


String.prototype.strleng = function(n){
    return strleng(this,n)
}

/**
 * 是否在视图内可见
 * @param dom
 * @returns {boolean|*|jQuery}
 */
vars.visibleOnStage = function(dom){
    var rect = dom.getBoundingClientRect();
    var rectd = document.body.getBoundingClientRect();

    return (
        true
        && $(dom).is(":visible")
        && rect.top + rect.height>0
        && rect.top + rect.height<rectd.height
        && rect.left + rect.width>0
        && rect.left + rect.width<rectd.width
    )
}


//免费包邮件数
//net("merchant/freePiece").then(resp=>{vars.cfgFreePiece = resp.freePiece||2}).catch($=>vars.cfgFreePiece=2)

export {
    vars,
    mixin,
    net
}
