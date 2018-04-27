import _ from "lodash";

var list = [
    //{ path: "/home/",                                                       component: require(`./pagelist/home${vars.varsionPrefix}.vue`)},
    { path: "/home/",                                                       component: require(`./pagelist/home.new.vue`)},


    //{path: '/list-page/:typeid',                                            component: require('./pagelist/list-page.vue')},
    {path: '/list-page/:typeid',                                            component: require('./pagelist/list-page.new.vue')},
    {path: '/common-index-page/:id/:mark',                                  component: require('./pagelist/common-index-page.vue')},
    {path: '/wenhua-index-page/:id/:mark',                                 component: require('./pagelist/wenhua-index-page.vue')},
    {path: '/diangu-index-page/:id/:mark',                                  component: require('./pagelist/diangu-index-page.vue')},
    {path: '/zixun-index-page/:id/:mark',                                   component: require('./pagelist/zixun-index-page.vue')},
    {path: '/huodong-index-page/:id/:mark',                                 component: require('./pagelist/huodong-index-page.vue')},
    {path: '/jingdian-index-page/:id/:mark',                                component: require('./pagelist/jingdian-index-page.new.vue')},
    {path: '/jingdian-intro/:id/:mark',                                     component: require('./pagelist/jingdian-intro.vue')},
    {path: '/jingdian-products/:id/:mark',                                  component: require('./pagelist/jingdian-products.vue')},
    {path: '/jingdian-comment-list/:id/:mark',                              component: require('./pagelist/jingdian-comment-list.vue')},
    {path: '/jingdian-products-detail/:merId/:mark/:id',                    component: require('./pagelist/jingdian-products-detail.vue')},
    {path: '/common-albumn/:id/:type',                                      component: require('./pagelist/common-albumn.vue')},

    {path: '/jiudian-index-page/:id/:mark',                                 component: require('./pagelist/jiudian-index-page.vue')},
    {path: '/xianlu-index-page/:id/:mark',                                 component: require('./pagelist/xianlu-index-page.vue')},
    {path: '/qiyu-index-page/:id/:mark',                                    component: require('./pagelist/qiyu-index-page.vue')},
    {path: '/meishi-index-page/:id/:mark',                                  component: require(`./pagelist/meishi-index-page.vue`)},
    {path: '/techan-index-page/:id/:mark',                                  component: require(`./pagelist/techan-index-page.vue`)},
    {path: '/jiaotong-detail/:id/:mark',                                    component: require('./pagelist/jiaotong-detail.vue')},
    { path: "/my-gerenzhongxin/",                                           component: require("./pagelist/my-gerenzhongxin.vue")},
    { path: "/jiaotong/",                                                   component: require("./pagelist/jiaotong-cata-index.vue")},
    { path: "/my-qiandao/:id",                                                 component: require("./pagelist/my-qiandao.vue")},
    { path: "/my-jifen/:id",                                                   component: require(`./pagelist/my-jifen.vue`)},

    null,

    //导游
    { path: "/daoyou-index-page/:id/:mark",                                 component: require("./pagelist/daoyou-index-page.vue")},

    //个人定制列表
    { path: "/personalCustoization-list/",                         component: require("./pagelist/personalCustoization-list.vue")},



    //添加评论
    {path: '/comment-create/:id/:mark/:parent',                             component: require('./pagelist/common-comment-create.vue')},
    {path: '/comment-create/:id/:mark/',                                    component: require('./pagelist/common-comment-create.vue')},
    {path: '/reply-create/:id/:mark/:pid/:accountid',                                    component: require('./pagelist/reply-comment-create.vue')},
    { path: "/huodong-bao/:id/",                                            component: require("./pagelist/huodong-bao.vue")},
    { path: "/my-kabao/:id",                                                   component: require("./pagelist/my-kabao.vue")},


    { path: "/my-dingdan/:id",                                                 component: require("./pagelist/my-dingdan.vue")},
    { path: "/my-pinglun/:id",                                                 component: require("./pagelist/my-pinglun.vue")},
    { path: "/my-tuku/:id",                                                    component: require("./pagelist/my-tuku.vue")},
    { path: "/my-shoucang/:id",                                                component: require("./pagelist/my-shoucang.vue")},
    { path: "/dingdan-detail/:id/:pid/",                                           component: require("./pagelist/dingdan-detail.vue")},
    { path: "/xianlu-detail/:id/",                                           component: require("./pagelist/xianlu-detail.vue")},
    { path: "/my-shezhi/",                                                      component: require("./pagelist/my-shezhi.vue")},
    { path: "/my-youji/:accountId",                                             component: require("./pagelist/my-youji.vue")},
    { path: "/add-youji/:id/:isadd",                                                   component: require("./pagelist/add-youji.vue")},
    { path: "/my-guanyu/",                                                  component: require("./pagelist/my-guanyu.vue")},
    { path: "/my-bangzhu/",                                                 component: require("./pagelist/my-bangzhu.vue")},
    { path: "/fankui/",                                                 component: require("./pagelist/fankui.vue")},
    { path: "/my-shengming/",                                                 component: require("./pagelist/my-shengming.vue")},
    { path: "/my-tuisong/",                                                 component: require("./pagelist/my-tuisong.vue")},
    { path: "/jifen-regular/:id/",                                                 component: require("./pagelist/jifen-regular.vue")},

    //个人信息
    { path: "/personal-information/",                                       component: require("./pagelist/personal-information.vue")},
    { path: "/personal-address/:id",                                           component: require("./pagelist/personal-address.vue")},
    { path: "/alter-address/:id/:aid/",                                           component: require("./pagelist/alter-address.vue")},
    // { path: "/alter-headImg/:Id",                                           component: require("./pagelist/alter-headImg.vue")},
    { path: "/alter-gender/:id/",                                           component: require("./pagelist/alter-gender.vue")},
    { path: "/alter-name/:id",                                           component: require("./pagelist/alter-name.vue")},
    { path: "/alter-nick/:id",                                           component: require("./pagelist/alter-nick.vue")},
    { path: "/alter-region/:id",                                           component: require("./pagelist/alter-region.vue")},
    { path: "/alter-sign/:id",                                           component: require("./pagelist/alter-sign.vue")},
    { path: "/alter-personal/:id",                                           component: require("./pagelist/alter-personal.vue")},
    { path: "/add-address/",                                                component: require("./pagelist/add-address.vue")},
    { path: "/add-address/flag/:flag",                                                component: require("./pagelist/add-address.vue")},
    { path: "/map-address/:id",                                                   component: require("./pagelist/map-address.vue")},
    { path: "/map-address/",                                                component: require("./pagelist/map-address.vue")},
    { path: '/techan-details/:id',                                             component: require('./pagelist/techan-details.vue')},
    //{ path: '/jingdian-comment-create/:id/',                              component: require('./pagelist/jingdian-comment-create.vue')},
    { path: '/jingdian-order/:id/',                                         component: require(`./pagelist/jingdian-order${vars.varsionPrefix}.vue`)},

    { path: '/xianlu-order/:id/:currPriceTime/:toPrice/:mark/:dataPriceId',                        component: require(`./pagelist/xianlu-order.vue`)},
    //{ path: '/meishi-order/:id/:mark/',                                     component: require(`./pagelist/meishi-order${vars.varsionPrefix}.vue`)},
    { path: '/jump-meishi-order/:id/:mark/',                                component: require(`./pagelist/jump-meishi-order.vue`)},
    { path: '/meishi-order/:id/:mark/:choosedData',                         component: require(`./pagelist/meishi-order.vue`)},
    { path: '/meishi-dishlist/:id/:mark/:dishid',                           component: require('./pagelist/meishi-dishlist.vue')},
    { path: '/techan-dishlist/:id/:mark/:dishid',                           component: require('./pagelist/techan-dishlist.vue')},
    { path: '/techan-order/:id/:mark/:choosedData',                         component: require(`./pagelist/techan-order.vue`)},
    { path: '/jingdian-map/:id/:mark',                                      component: require('./pagelist/jingdian-map.vue')},
    { path: '/form/',                                                       component: require('./pages/form.vue')},
    { path: '/about/',                                                      component: require('./pages/about.vue')},

    //登录
    { path: '/login/',                                                      component: require('./pagelist/login.vue')},
    { path: '/login/:phone',                                                component: require('./pagelist/login.vue')},
    { path: '/auto-login/:token',                                                component: require('./pagelist/login.vue')},

    //注册
    { path: '/register/',                                                   component: require('./pagelist/register.vue')},
    //忘记密码(携带手机号/不携带手机号)
    { path: '/lost-password/:phone',                                        component: require('./pagelist/register.vue')},
    { path: '/lost-password/',                                              component: require('./pagelist/register.vue')},
    //第三方账号注册，完善资料(携带用户id什么的)
    { path: '/attach-phone/:userinfo',                                      component: require('./pagelist/register.vue')},
    { path: '/attach-phone/',                                               component: require('./pagelist/register.vue')},

    //设置密码
    { path: '/set-password-register/:phone/:safecode',                      component: require('./pagelist/set-password.vue')},
    //修改密码
    { path: '/set-password-modify/:phone/:safecode',                        component: require('./pagelist/set-password.vue')},
    //第三方账号注册，绑定手机,设置密码
    { path: '/set-password-attach/:phone/:safecode/:userinfo',              component: require('./pagelist/set-password.vue')},



    //周边搜索
    {path: '/common-around-search/:id/:mark',                               component: require('./pagelist/common-around-search.vue')},
    {path: '/common-payment/:orderCode',                                    component: require('./pagelist/common-payment.vue')},
    {path: '/xianlu-payment/:orderCode',                                    component: require('./pagelist/xianlu-payment.vue')},
    {path: '/dingdan-payment/:id',                                          component: require('./pagelist/dingdan-payment.vue')},

    //搜索结果
    {path: '/search-result/:key',                                           component: require('./pagelist/search-result.vue')},

    {path: '/jingdian-map/:id/:mark',                                       component: require('./pagelist/jingdian-map.vue')},
    {path: '/jingdian-sub-desc/:id/:title/:content',                        component: require('./pagelist/jingdian-sub-desc.vue')},

    {path: '/jiudian-detail/:id/:mark',                                     component: require('./pagelist/jiudian-detail.vue')},
    {path: '/jiudian-order/:pid/:mid',                                      component: require(`./pagelist/jiudian-order${vars.varsionPrefix}.vue`)},

    {path: '/form/',                                                        component: require('./pages/form.vue')},
    {path: '/login/',                                                       component: require('./pagelist/login.vue')},
    {path: '/about/',                                                       component: require('./pages/about.vue')},
    {path: '/login/:phone',                                                 component: require('./pagelist/login.vue')},
    {path: '/register/',                                                    component: require('./pagelist/register.vue')},
    {path: '/lost-password/:phone',                                         component: require('./pagelist/register.vue')},
    {path: '/lost-password',                                                component: require('./pagelist/register.vue')},
    {path: '/set-password/:phone/:safecode',                                component: require('./pagelist/set-password.vue')},
    {path: '/change-password/:id/',                                         component: require('./pagelist/change-password.vue')},
    {path: '/map-around/:title/:lnglat',                                    component: require('./pagelist/map-around.vue')},
    {path: '/address-picker/:code',                                          component: require('./pagelist/address-picker.vue')},
    //天气
    {path: '/weathers',                                          component: require('./pagelist/weathers.vue')},
]


var index = _.indexOf(list,null);

list = _.remove(list,null);

var transparent_navbar_router_map = new Map();
for(var i =0; i<index; i++) {
    var rt = list[i];
    transparent_navbar_router_map[rt.path.replace(/^(\/.+?\/).*/,"$1")] = 1;
}

export var routes = list;
export var path_map_transparent_navbar = transparent_navbar_router_map;
