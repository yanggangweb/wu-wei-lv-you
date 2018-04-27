import Vue from 'vue'
import Vuex from "vuex"
import Framework7 from './libs/framework7/dist/js/framework7'
import Framework7Vue from 'framework7-vue'
import $ from "jquery"
import {vars,mixin} from "./config"
import App from './App'
import {routes,path_map_transparent_navbar} from './routes'
import store_factory from "./store.js"
import "./libs/jquery.simulate"

import "assets/iconfont/vue.component";


import dataAnalytical from "./dataAnalytical";
vars.dataAnalytical = dataAnalytical;

// Import F7 iOS Theme Styles
import Framework7Theme from './libs/framework7/src/less/ios/framework7.ios.less'
// import Framework7ThemeColors from './libs/framework7/src/less/ios/framework7.ios.colors.less'
import Framework7ThemeColors from './libs/framework7/src/less/material/framework7.material.colors.less'

/* OR for Material Theme:
 import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
 import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
 */
Vue.directive("lodingInView",vars.mixin_1.directives.lodingInView)
import "./libs/loaders.min.css";

import "./styles/global.less";

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

import moment from "moment"

moment.locale("zh-cn")


Vue.use(Vuex);
//Vue.use(Framework7Vue);
Vue.component("lmg",require("./components/lmg.vue"))
Vue.component("phone-call-icon",require("./components/phoneCallIcon.vue"))

import Amap from "vue-amap";
Vue.use(Amap);
Amap.initAMapApiLoader({
    key: '99b349a84a01d1bc8163a95d79932796',
    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType','AMap.CitySearch','AMap.Autocomplete','AMap.PlaceSearch',"AMap.Geocoder"]
})

/**
 * 全局注入
 */
Vue.mixin(mixin);
Vue.component("starList",require("./components/start-list.vue"))
Vue.component("picker",require("./components/picker.vue"))
var $ht = $("html");


var store = store_factory();
vars.store = store;

import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper);

/**
 * 加载启动数据
 */
var dataLoadPromise  = vars.loadStartUpData().then(
    function (showIndexData) {

        //缓存初始化数据
        vars.startupData = Array.prototype.slice.call(arguments);
        showIndexData.list.forEach(function (item, index) {
            var element = {
                label: item.name,
                item,
                thumb: item.url,
                link: "/list-page/" + item.mark,
                bgColor:vars.getColor(index),
                router:vars.dic.type2routeName[item.mark] || vars.dic.type2routeName.default
            }
            vars.dic.type_id2type[item.mark] = _.merge({},element);
        });
        return showIndexData;
    },
    function(err){
        vars.toast("网络监测失败，app即将退出！")
        if(_.get(navigator,"app.exitApp")){
            setTimeout($=>{
                navigator.app.exitApp()
            },2000)
        }
    }
)



/**
 * 启动界面
 * @type {Vue}
 */
var startupVue = new Vue({
    data:{
        show:true,
    },
    el:"#startup",
    template:"" +
        '<transition name="fade-scale-zoom-out">' +
        "   <startup-layer v-show='show' ref='face'/>" +
        '</transition>'
    ,
    components:{
        startupLayer:require("./pagelist/startup-layer.vue")
    },
    mounted:function(){
        var m = this;

        dataLoadPromise
            .then(function(showIndexData){
                return vars.cacheImageToBase64(showIndexData.firstImg,"cover");
            })
            .then(function(images){
                m.$refs.face.showImages(images);
            })
            .catch(function(err){
                console.log("封面图缓存失败:",err);
                m.$refs.face.showImages(null);
            })
        ;
    },
    methods:{
        hide:function(){
            var m = this;
            m.show = false;
        },

        /**
         * 强制结束倒计时
         */
        timeDownForceEnd:function(){
            var m = this;
            if(m._timeDownResolve) {
                setTimeout(m._timeDownResolve,500)
            }
        },

        //开始倒计时
        timeDown:function(){
            var m = this;
            return new Promise(function(resolve){
                m._timeDownResolve = resolve;

                var counter = Math.ceil(vars.startup_sreen_adv_dura/1000);
                m.$refs.face.timeCounter = counter;
                var stv = setInterval($=>{
                    if(counter<=0) {
                        clearInterval(stv)
                        resolve();
                    }
                    m.$refs.face.timeCounter = counter;
                    counter--;
                },1000)
                //setTimeout(resolve,vars.startup_sreen_adv_dura)
            })
        }
    }
})



var fastStartup = location.hash.replace(/#/g,"") != "";


Promise.resolve()

    //初始数据完成
    .then($=>dataLoadPromise)

    //启动画面完成
    .then($=>{
        return fastStartup?Promise.resolve():startupVue.$refs.face.startupFaceShowCompletePromise
    })

     //广告图片处理完成，初始化app
    .then($=>{
        return fastStartup?Promise.resolve():startupVue.timeDown()
    })

    //开始初始化app
    .then(function(data){

        startupVue.hide();

        //use过早，f7会出问题。需要同时use和new Vue
        Vue.use(Framework7Vue);

        /**
         * 初始化
         */
        var vur_root_app = new Vue({
            el: '#app',
            store,
            framework7: {
                modalTitle: "提示",
                modalButtonOk: "确定",
                modalButtonCancel: "取消",
                modalPreloaderTitle: "加载中...",
                modalUsernamePlaceholder: "用户名",
                modalPasswordPlaceholder: "密码",

                pushState:true,
                pushStateSeparator:"#",
                root: '#app',

                routes,

                onPageBeforeAnimation:function(app,page){

                    store.commit("changeRouterLink",page.url+":animating");
                    var path = (page.url || "").replace(/^(\/.+?\/).*/,"$1");

                    $ht.attr("router",path);
                    if(path_map_transparent_navbar[path]) {
                        $ht.attr("trans-navbar",1)
                    }else{
                        $ht.removeAttr("trans-navbar")
                    }
                    page_content_scroll_spy.unbind();
                },

                onPageAfterAnimation:function(app,page){
                    store.commit("changeRouterLink", page.url);
                    page_content_scroll_spy.rebind();

                    if(
                        !/jingdian-sub-desc/.test(page.url) &&
                        !/jingdian-map/.test(page.url)
                    ) {
                        vars.stopAudio()
                    }
                }
            },
            components: {
                App
            },
            mounted:function(){
                var m = this;


                //从ls获取usertooken，如果存在认为登录，但不保证tooken有效
                var ut = vars.lockr.get("userTooken");
                if(ut) {
                    m.$store.commit("saveUserTooken",ut);
                }

                vars.app = f7;
                var mv = f7.mainView;
                vars.mainView = mv;

                //当前无导航的情况下才跳转到首页
                if((!f7.mainView.activePage || f7.mainView.activePage.url == "#null") && vars.defalut_router_link) {
                    mv.router.load({
                        url:vars.defalut_router_link,
                        //pushState:false,
                        animatePages:false
                    })
                    mv.history.splice(0,1)
                }


                //device ready
                vars.deviceready()
                    .then(function(){
                        //浏览器相关
                        try{
                            window.open = cordova.InAppBrowser.open;
                        }catch(err){
                            throw("InAppBrowser:浏览器插件获取失败");
                        }

                        window.AliPay  = cordova.plugins.AliPay;

                        if(/\d+\.\d+\.\d+\.\d+/.test(location.hostname)){
                            m.$store.commit("debugShowing",true)
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
                ;


                //定位相关
                Promise.resolve()
                    .then(function() {
                        return vars.requestAndroidPermissions("android.permission.ACCESS_COARSE_LOCATION")
                    })
                    .catch(function(){
                        f7.alert("定位失败！")
                    })
                    .then(function(){
                        //------------
                        function readlocation(){
                            if(typeof AMapNavi!=="undefined"){
                                AMapNavi.getLocation(success,fail)
                            }else{
                                plugins.aMapLocationPlugin.getCurrentPosition(success,fail)
                            }
                        }

                        function success(geo){
                            if(!geo.adcode) {
                                vars.maptool.geocoder().then(function(geocoder){
                                    geocoder.getAddress([geo.longitude,geo.latitude], function(status, result) {
                                        if (status === 'complete' && result.info === 'OK') {
                                            var addr=result.regeocode.addressComponent;
                                            var fullAddr = result.regeocode.formattedAddress;


                                            if(!geo.poiName)    geo.poiName = fullAddr.split(addr.township)[1]||addr.township;
                                            if(!geo.city)       geo.city = addr.city;
                                            if(!geo.province)   geo.province = addr.province;
                                            if(!geo.full)       geo.full = fullAddr;
                                            geo.adcode = addr.adcode;
                                            success(geo);


                                            //如果登录着
                                            if(store.state.userTooken) {
                                                dataAnalytical.start();
                                            }else{
                                                dataAnalytical.stop();
                                            }
                                        }else{
                                            fail("地址转换失败")
                                        }
                                    });
                                })
                                return;
                            }
                            vars.store.commit("setGeo",geo);
                            console.log(geo,"新的geo获取到了");
                            setTimeout(readlocation,vars.positionFreshDuration)
                        }
                        function fail(err){
                            f7.alert("定位失败！")
                            vars.store.commit("setGeo",{
                                ...vars.defaultGeo,
                                error:err
                            });

                            /*if(err.message == "plugins is not defined") {
                                console.log("位置信息获取失败(插件没有访问到):",err);
                            }else{
                                console.log("位置信息获取失败:",err);
                                setTimeout(readlocation,vars.locatFailtRetryDuration)
                            }*/
                        }
                        readlocation();
                    })
                    .catch(function(err){
                        vars.toast("定位权限获取失败:" + err)
                        console.log("定位权限获取失败:" ,err)
                    })
                ;


                //尝试获取用户信息
                if(m.isLogined()) {
                    m.req("account/accountinfo",{noTryLogin:true})
                        .then(function(data){
                            if(data.resCode) {
                                throw data.message;
                            }
                            m.$store.commit("saveUser",data.account)
                        })
                        .catch(function(err){
                            console.log(vars.trimErrorMessage(err),"无效登录");
                            m.$store.commit("clearUserTooken")
                            //f7.alert(err,"登录已失效")
                        })
                    ;
                }
            }
        })
        page_content_scroll_spy.init(f7.mainView.container);

    })
    .catch(function(err){
        console.error(err);
        alert("网络连接失败")
        //强制退出，或者刷新重新联网什么的
    })
;

vars.root = new Vue({
    el:"#root",
    components:{
        broswer:require("./components/lite-broswer.vue")
    },
    methods:{},
    mounted:function(){
        var m = this;
        m.bro = m.$refs.mainBroswer;
    }
})



/**
 * page-content 滚动监控
 */
var page_content_scroll_spy = ({

    valid_value:50,

    init:function(view){
        var m = this;
        m.el = $(view);
        m.nav = m.el.find(".navbar:first");

        m.__current_page_handler = function(e){
            var scroll = m.__current_page_content.prop("scrollTop");
            var ret = 0;
            if(scroll<m.valid_value) {
                ret = scroll/m.valid_value;
            }else{
                ret = 1;
            }
            ret = ((ret*10)>>0)/10;
            m.nav.attr("data-opacity",ret);
            return m.__current_page_handler;
        }

        return m;
    },

    rebind:function(){
        var m = this;
        Vue.nextTick(function(){
            m.__current_page_content = m.getContent();
            m.__current_page_content.on("scroll",m.__current_page_handler);
            m.__current_page_handler();
        })
    },

    unbind:function(){
        var m = this;
        if(m.__current_page_content) {
            m.nav.attr("data-opacity",0);
            m.__current_page_content.unbind("scroll",m.__current_page_handler);
            m.__current_page_content = null;
        }
    },

    __current_page_content:"",
    getContent:function(){
        var m = this;
        return m.el.find(".page-on-center>.page-content")
    }
});




// document.getElementByTagName('body')[0].addEventListener('touchstart', function(e) {e.preventDefault();}, false)



