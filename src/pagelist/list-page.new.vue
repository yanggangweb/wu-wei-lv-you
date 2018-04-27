<template type="text/html" lang="jade">
    f7-page(:class="[name,typeid]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                search-bar.list-page-searchbar.no-bgcolor.no-h-padding(:placeholder="'搜索' + typedata.label",@dosearch="onSearch", :inNavbar="true" )
            f7-nav-right
                template(v-if="/JINGDIAN|JIUDIAN|MEISHI|JIAOTONG/.test(typeid)")
                    f7-link(icon="i-zhoubian",@click="routeTo(`/map-around/周边/${geo.longitude},${geo.latitude}`)")
                template(v-else) &nbsp;

        .fixedSlot(slot="fixed")
            filter-bar(v-if="filter_list.length",:data-list="filter_list",@select="barSelect",@filter="barFilter",@button="barClick")

        transition(name="expand")
            .swiper-container-wrapper(v-if="top_img_list.length",v-show="bannerVisible")
                i.icon.i-guanbi.close-btn(@click="bannerVisible=false",v-show="!/JINGDIAN|MEISHI|TECHAN|JIUDIAN/.test(typeid)")
                f7-swiper.swiper-bullet-custom(pagination="",:params="{speed:500, slidesPerView: 1, spaceBetween: 0, autoplay:2500, loop:true, autoplayDisableOnInteraction:false}")
                    f7-swiper-slide(v-for="imgobj in top_img_list")
                        img(:src="imgobj.img")

        //当前位置
        .pos-row.shortcut-class(v-show="/JINGDIAN|MEISHI|TECHAN|JIUDIAN|XIANLU/.test(typeid)")
            .row
                i.icon.i-dingwei2.red.big
                |   您的位置:{{_get(geo,"poiName")}}


        f7-list.blank-list.no-after-border(v-show="!items.length && searched")
            f7-list-item
                .blank-placeholder.no-mt(style="margin-top:21px")
                    i.icon.i-zhaobudao
                    .label 暂无数据

        .list-warpper(@click="listClick",:class="[typeid,{listEnd:eof}]")
            .custom-list-item(v-for="(it,index) in items", media-item="", :data-id="it.id")
                .img
                    img(:src="it.img|ossResize(120)")

                .right.shortcut-class
                    .main-info
                        h5.title(v-html="it.name",:title-leng="it.name")
                        f7-button.label.thin.hide.green(v-for="el in _get(it,'classify',[])") {{el}}

                        //线路
                        .main-info.mark-middle-typeid.hide(v-if="/ZIXUN|XIANLU|WENHUA|SHIPIN|HUODONG|DIANGU|DIANGU/.test(typeid)")
                            //h5.title(v-html="it.introduction | ")
                            h5.title {{it.introduction|interceptionWord}}
                    //商户
                    .add-info.mark-merchant.hide
                        .row.hide.between.row-with-sell
                            span 已售 {{it.saledNum||0}}
                            span
                                |   ￥
                                b.red.big {{it.price||1}}
                                |   起
                        .tr.row-without-sell
                            |   ￥
                            b.red.big {{it.price||1}}
                            |   起
                        .distance.row.between
                            span.row
                                i.icon.i-dingwei2.big.red
                                | {{it.distance|length}}
                            star-list(:value="it.score||0", no-edit)
                    //-商户

                    //奇遇
                    .add-info.mark-qiyu.hide
                        .row.between
                            span.fx1
                                i.icon.i-wode.big.green
                                |   {{it.nick}}
                            span 发表于{{it.timeSlot}}

                    .add-info.mark-qiyu.hide
                        .row.between
                            span.row
                                i.icon.i-dingwei2.big.red
                                | {{it.distance|length}}
                            span.row
                                i.icon.i-msg.big.green
                                |   {{it.commentNum||0}} &nbsp;
                                i.icon.i-iconfontshoucang1.big.yellow
                                |   {{it.collectNum||0}}
                    //-奇遇


                    //活动
                    .add-info.mark-huodong.hide
                        .row.between
                            span.row
                                i.icon.i-dingwei2.big.red
                                | {{it.distance|length}}
                            span.row
                                star-list(:value="it.score||0", no-edit)
                                span.big.yellow &nbsp; {{it.score||0}}
                                span.small   分
                    //-活动

                    //-导游
                    .add-info.mark-daoyou.hide
                        .row
                            span 电话: {{it.phone}}
                        .row.pricerow
                            span 价格: {{it.price}}￥/天

                        f7-button.label.thin.hide.green(v-for="el in it.language.split(',')") {{el}}
                        f7-button.label.thin.hide.green(v-for="el in it.mainScene.split(',')") {{el}}


                    //其他
                    .add-info.mark-qita
                        .row.between
                            span &nbsp;
                            span.row
                                span
                                    i.icon.i-msg.green.big
                                    |   {{it.commentNum||0}}人 &nbsp;
                                span.shoucang-icon
                                    i.icon.i-iconfontshoucang1.yellow.big
                                    |   {{it.collectNum||0}}人 &nbsp;
                                //i.icon.i-zan.red.big
                                //|   +8
                    //-其他



</template>

<script type="text/ecmascript-6">
    import filterBar from "../components/filter-bar.vue"
    import searchBar from "../components/search-bar.vue";
    import $ from "jquery";
    let blk_img_list = [{img:vars.null_img}]
    import _ from "lodash";
    import Pg from "../libs/ClassPG";
    import defaultImage from "../assets/default.jpg";

    var item_height = 180;

    export default {
        mixins:[vars.mixin_1,vars.mixin_2],
        data () {
            var m = this;
            return {
                bannerVisible:true,
                item_height,
                items:[],
                name: "list-page",
                top_img_list: [],
                filter_list:[],
                typedata:{},

                //列表类型id
                typeid:"",

                key:"",

                para:{
                    sorttype:0,
                    classifyids:""
                },
                bulletVisible:false,
                searched:false,
                //过滤条件数组
                condation:[],

                eof:true,
                bulletData:[],
            }
        },

        computed: {
            geo(){return this.$store.state.geo},
            addr(){return this.$store.getters.address}
        },

        methods: {
            onInfiniteScroll:function(){
                var m = this;
                m.reqlist();
            },
            barClick:function(el){
                var m = this;
                m.para[el.field]=el.value;
                m.pg.reset();
                m.reqlist();
            },
            toggleBullet:function () {
                var m=this;
                if (!m.bulletVisible) {
                        m.$refs.bullet.forEach((item,index) => {
                            item.pauseAndHide();
                        });
                }else{
                    m.$refs.bullet.forEach((item,index) => {
                        item.playAndShow();
                    });
                }
            },
            barSelect:function(el){
                var m = this;
                m.para[el.type] = el.value||"";
                m.pg.reset();
                m.reqlist();
            },
            barFilter:function(el){
                var m = this;
                m.para[el.field || "classifyids"] = el.value.join(",");
                m.pg.reset();
                m.reqlist();
            },
            listClick:function(e){
                var m = this;

                var li =m.$(e.target).parents(".custom-list-item:first");

                if(!li.length) {
                    return;
                }

                var id = li.attr("data-id");
                var item = _.find(m.items,{id:id*1});

                if(m.typeid == "SHIPIN") {
                    vars.root.bro.open("http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/"+item.videoUrl,item.name)
                    return;
                }

                //缓存item
                vars.dic.idMark2Item(id,m.typeid,item);

                var mark = m.typeid;
                var dic = vars.dic.type2routeName;
                var router_name = dic[mark] || dic["default"];
                m.routeTo(`/${router_name}/${id}/${m.typeid}/`)
            },


            //顶部广告图
            _initPicList:function(){
                var m = this;
                m.req("picture/adpicture",{sliderKey:m.typeid}).then(function(pictureList){
                    if(pictureList.resCode) {
                        f7.alert(pictureList.message);
                    }else !function(){
                        var img_list = pictureList.list.map(el=>{
                            return {
                                img:vars.oss_url_base + el.pictureUrl
                            }
                        });
                        if(!img_list.length) {
                            img_list = blk_img_list
                        }

                        m.top_img_list = img_list;
                    }()
                })

            },

            //界面初始化
            __init:function(){
                var m = this;

                var typeid = m.typeid;
                var opt = vars.mark2actions(typeid);
                if(!typeid) {
                    f7.alert("没有获取到typeid")
                    return;
                }
                m._initPicList();

                m.req(opt.filterList,{mark:m.typeid})
                    .then(
                        function(filterList){
                            if(filterList.resCode) {
                                throw filterList.message;
                            }
                            m.filter_list = [
                                opt.listSortData,
                                opt.filterData(filterList)
                            ];
                            m.reqlist();
                        }
                    )
                    .catch(function(){

                        if(typeid == "QIYU") {
                            m.filter_list = [
                                opt.listSortData,
                                {
                                    instance:"select",
                                    displayLabel:"查询日期",
                                    label: "查询日期",
                                    type: "timeScope",
                                    value: 0,
                                    options: [
                                        {name: " 一天内", value: "1"},
                                        {name: "一周内", value: "2"},
                                        {name: "一月内", value: "3"},
                                    ]
                                }
                            ];
                        }

                        m.reqlist();
                    })
                ;
            },

            beforeanimation:function(){
                var m = this;
            },

            //过滤条上的按钮被单击
            filterClick:function(button){
                var m = this;
                console.log(button);
            },

            reqlist:function(){
                var m = this;

                if(!m.pg) {
                    m.pg = new Pg({
                        size:30,
                        pageField:"pageNum",
                        sizeField:"pageSize",
                        onEofStatusChange:function(flag){
                            m.eof=flag;
                        },
                        onReset:function(){
                            m.items = [];
                        },
                    });
                }

                var para = {
                    mark:m.typedata.item.mark,
                    keywords:m.key,
                    thirdId:"",                     //用户标识
                    hot:0,                          //1热门
                    longitude:m.geo.longitude,       //经度
                    latitude:m.geo.latitude,        //维度
                    ...m.pg.getPara(),
                    ...m.para,
                    code:m.addr.id
                }

                if(para.attr == 0) {
                    para.attr = "";
                }

                m.searched = false;
                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();
                m.req(vars.mark2actions(m.typeid).list,para).then(
                    function(data){

                        m.searched = true;
                        f7.hideProgressbar();
                        if(data.resCode) {
                            //列表信息获取失败
                            f7.alert("列表信息获取失败");
                            f7.hideProgressbar();
                            m.items = [];
                            return;
                        }
                        var newItems = data.list.map(el=>{

                            //视频的处理
                            if(el.picUrl){ el.cover = el.picUrl; }
                            return {
                                item_height,
                                img:(function(){
                                    var img = el.cover || el.headImg;
                                    if(img) {
                                        return vars.oss_url_base + img;
                                    }
                                    return defaultImage;
                                })(),
                                price:el.startPrice||el.price,
                                label:_.get(el,"classify.0")||"",
                                state:el.state,
                                list:_.get(el,"commentList",[]).map(em=>{
                                    return {
                                        text:em.content,
                                    }
                                }),
                                nick:el.nick,
                                headImg:el.headImg,
                                titleLeng:el.name.length,
                                commentNum:el.commentNum,
                                collectNum:el.collectNum,
                                ...(function(fields){
                                    var a = {}
                                    fields.split(",").forEach(function(f){
                                        a[f] = el[f]||"";
                                    })
                                    return a;
                                })("saledNum,id,address,code,minprice,name,score,classify,distance,introduction,videoUrl,nick,callApi,content,timeSlot,mainScene,language,phone")
                            }
                        })
                        m.items = m.items.concat(newItems);

                        if(!data.end) {
                            m.pg.step();
                            f7.attachInfiniteScroll(m.$pageContent);
                        }else{
                            m.pg.forceEof();
                        }


                    },
                    function(err){
                        m.searched = true;
                        f7.hideProgressbar();
                    }
                )
            },

            onSearch:function(key){
                var m = this;
                m.key = key;
                m.pg.reset();
                m.reqlist();
            }
        },

        watch:{
            key:function(v){
                var m = this;
                if(!v) {
                    m.pg.reset();
                    m.reqlist()
                }
            }
        },

        mounted:function(){
            var m = this;
            m.typeid = m.$route.params.typeid;
            m.$pageContent = m.find(".page-content")
            //缓存当前mark
            vars.currentMark = m.typeid;
            m.typedata = vars.dic.type_id2type[m.typeid];

            if(m.typedata.item.mark == "JINGDIAN") {
                m.typedata.label = "景点"
            }
            m.__init();
        },

        components:{
            filterBar,
            searchBar,
            bullet:require("../components/bulletScreen.vue")
        },

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    @name:list-page;

    .toolClass();

    .list-page{
        .fixedSlot{
            margin-top:@top-bar-height;
        }

        &.page{
            background-color: #ffffff;
            .page-content{
                padding-top: 0;
                height:calc(~"100vh" - (@top-bar-height*2));
                .ios &{
                    height:calc(~"100vh" - (@top-bar-height*2) + @ios-status-bar-height);
                }
            }


            //无过滤条件的高度
            &.DAOYOU{
                .page-content{
                    padding-top: 0;
                    height:calc(~"100vh" - (@top-bar-height*1));
                    .ios &{
                        height:calc(~"100vh" - (@top-bar-height*1) + @ios-status-bar-height);
                    }
                }
            }
        }


        .pos-row{
            padding-left:@page-edge;
            line-height:@page-edge*2;
        }

        @swiper-slide-height:25vh;

        .filter-bar{
            .col-auto{
                .item-title,a,.icon{
                    color: #A1A1A1 !important;
                }
            }
        }

        .spliter{
            height: @page-edge/2;
            background-color: #fff;
        }
        .swiper-container-wrapper{

            position: relative;
            .close-btn{

                z-index: 9;
                position: absolute;
                right:@page-edge;
                top:@page-edge;
                color: #333;
                //transform: scale(0.8);
                font-size: 1.5rem;

                text-shadow: @light-shaow;
            }

            .swiper-container{
                height: @swiper-slide-height;
            }
            .swiper-slide{
                img{
                    height: @swiper-slide-height;
                    display: block;
                    width: 100%;
                    object-fit: cover;
                }
            }
        }

        .blank-list{
            //padding:@page-edge;
            ul{
                &:before{
                    display: none;
                }
            }
            .item-content{
                .item-inner{
                    display: block;
                    text-align: center;
                }
            }
        }

        .list-warpper{
            flex: 1;
            background-color: #fff;

            padding:@page-edge;

            .custom-list-item{
                display: flex;
                margin-bottom:@page-edge;
                align-items: stretch;

                .title{
                    position: static;
                    transform: none;
                    text-align: left;
                    color: #3D3D3D;
                    font-size: 0.9rem;
                    text-shadow: none;
                    border: none;
                    padding-left: 0;
                    margin-bottom: 0.25em;
                }

                .label.button.thin{
                    display: inline-block;
                    padding: 0 0.25em;
                    margin-right: @page-edge/2;
                    .lineh(1.3em);
                    /*transform:scale(0.9);*/
                }

                >.img{
                    height: 7.2em;
                    width: 8em;
                    margin-right:@page-edge/2;
                    img{
                        display: block;
                        &:extend(.expandin);
                        border-radius:0;
                    }
                }

                .right{
                    flex: 1;
                    //background-color: #f0f0f0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }

            .star-list{
                color: #E9E9E9;
            }

            .hide{
                display: none;
            }

            //商户
            &.JINGDIAN,
            &.MEISHI,
            &.JIUDIAN,
            &.TECHAN,
            .merchantElement
            {
                .label.hide{
                    display: inline;
                }
                .mark-merchant.hide{
                    display: block;
                }

                .mark-qita{
                    display: none;
                }
                .mark-middle-typeid{
                    display: none;
                }
            }

            &.JINGDIAN{
                .row-with-sell{
                    display: flex;
                }
                .row-without-sell{
                    display: none;
                }
                .mark-middle-typeid{
                    display: none;
                }
            }

            &.QIYU{
                .mark-qiyu.hide{
                    display: block;
                }
                .mark-qita{
                    display: none;
                }
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }
            }

            &.HUODONG{
                .label.hide{
                    display: inline;
                }
                .mark-huodong.hide{
                    display: block;
                }
                .mark-qita{
                    display: none;
                }
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }
            }

            &.JIAOTONG{
                .mark-qita{
                    display: none;
                }
                .mark-xianlu{
                    display: none;
                }
            }
            &.SHIPIN{
                .custom-list-item {
                    align-items: start;
                }
                .mark-qita{
                    display: none;
                }
                .mark-middle-typeid{
                    display: block;
                }
            }

            &.ZIXUN{
                .shoucang-icon{
                    display: none;
                }
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }
            }
            &.WENHUA{
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }
            }
            &.DAOYOU{
                .mark-daoyou.hide{
                    display: block;
                }

                .mark-qita{
                    display: none;
                }

                .img{
                    width: 7.2em;
                    img{
                        border-radius: 50%;
                    }
                }

                .main-info{
                    h5{
                        color: @cl-orange;
                    }
                }

                .pricerow{
                    margin-bottom: 0.75em;
                }
                .mark-xianlu{
                    display: none;
                }
            }

            &.XIANLU{
                .label.hide{
                    display: none;
                }
                .mark-merchant.hide{
                    display: flex;
                    justify-content: space-between;
                    .distance{
                        .row{
                            display: none;
                        }
                    }
                }

                .mark-qita{
                    display: none;
                }
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }

            }
            &.DIANGU,&.SHIPIN{
                .mark-middle-typeid.hide{
                    display: block;
                    .title{
                        font-size: 0.85rem;
                        color:#666;
                    }
                }
            }
        }
    }



</style>
