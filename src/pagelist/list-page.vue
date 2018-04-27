<template type="text/html" lang="jade">
    f7-page(:class="[name,typeid]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                search-bar.list-page-searchbar.no-bgcolor.no-h-padding(:placeholder="'搜索' + typedata.label",@dosearch="onSearch", :inNavbar="true" )
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        div(slot="fixed")
            .bulet-button
                input.mui-switch.mui-switch-anim(type="checkbox",@change="toggleBullet(bulletVisible)" v-model="bulletVisible")
            .swiper-container-wrapper(v-if="top_img_list.length")
                f7-swiper(pagination="",:params="{speed:500, slidesPerView: 1, spaceBetween: 0, autoplay:2500, loop:true, autoplayDisableOnInteraction:false}")
                    f7-swiper-slide(v-for="imgobj in top_img_list")
                        img(:src="imgobj.img")


            .spliter(v-show="!filter_list.length")
            filter-bar(v-if="filter_list.length",:data-list="filter_list",@select="barSelect",@filter="barFilter",@button="barClick")

        f7-list.blank-list.no-after-border(v-show="!items.length && searched")
            f7-list-item 没有任何结果，请更换搜索条件
        .list-warpper(@click="listClick",:class="[typeid,{listEnd:eof}]")
            f7-list( id="ser-list", media-list="")

                f7-list-item(v-for="(it,index) in items", media-item="", :data-id="it.id")
                    .img
                        img(:src="it.img", :style="{height:item_height+'px'}")
                    bullet(ref="bullet",:numberOfInView="10",:list="it.list")
                    h3(v-html="it.name",:title-leng="it.name")
                    .price(v-show="_get(it,'price','')")
                        i ￥
                        | {{it.price}}
                    .address(:address="'addr-' + it.distance")
                        | {{it.distance|length}}
                        i.i-dingwei2.icon
                    .label(v-show="it.label") {{it.label}}
                    .label(v-show="it.state==0") 未开始
                    .label(v-show="it.state==1") 进行中
                    .label(v-show="it.state==2") 已结束
                    .pingjia(:value="'sss:' + it.score")
                        | 评价
                        star-list(:value="it.score||0", no-edit)
                    .xingji(v-show="_get(it,'classfy.length')") {{it.classify[0]}}
                    .intro {{(_get(it,"introduction")||"")|html2text|strleng(60)}}
                    .tou-ping
                        img(v-if="!it.headImg",:src="vars.null_img")
                        img(v-if="it.headImg", :src="vars.oss_url_base + _get(it,'headImg')")
                        b.uname {{_get(it,"nick")}}
                        b.date {{_get(it,"createTime")|formatDate("YYYY-MM-DD  hh:mm:ss")}}
                            i.icon.i-iconfontshoucang1
                            b(v-show="!it.collectNum") 0
                            b(v-show="it.collectNum") {{it.collectNum || 0}}
                            i.icon.i-pinglun
                            b(v-show="!it.commentNum") 0
                            b(v-show="it.commentNum") {{it.commentNum || 0 }}

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
            geo:function(){
                var m = this;
                return m.$store.state.geo;
            }
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

                var li =m.$(e.target).parents("li:first")
                var id = li.attr("data-id");
                var item = _.find(m.items,{id:id*1});

                if(m.typeid == "SHIPIN") {
                    vars.root.bro.open(item.videoUrl,item.name)
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
            _init:function(){
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
                    thirdId:"",         //用户标识
                    hot:0,              //1热门
                    longitude:m.geo.longitude,       //经度
                    latitude:m.geo.latitude,        //维度
                    ...m.pg.getPara(),
                    ...m.para
                }

                if(para.attr == 0) {
                    para.attr = "";
                }

                m.searched = false;
                f7.detachInfiniteScroll(m.$pageContent);
                f7.showPreloader();
                m.req(vars.mark2actions(m.typeid).list,para).then(
                    function(data){

                        m.searched = true;
                        f7.hidePreloader();
                        if(data.resCode) {
                            //列表信息获取失败
                            f7.alert("列表信息获取失败")
                            f7.hidePreloader();
                            m.items = [];
                            return;
                        }
                        var newItems = data.list.map(el=>{

                            //视频的处理
                            if(el.picUrl){ el.cover = el.picUrl; }
                            return {
                                item_height,
                                img:el.cover?(vars.oss_url_base + el.cover):defaultImage,
                                price:el.startPrice,
                                label:_.get(el,"classify.0") || "",
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
                                })("id,address,code,minprice,name,score,classify,distance,introduction,videoUrl,nick,callApi,content")
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
                        f7.hidePreloader();
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
            m._init();
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

        display: flex;
        flex-direction: column;
        &.page{
            .page-content{
                padding-top: 0;
                flex:1;
                height: auto;
            }
        }

        @swiper-slide-height:25vh;

        .spliter{
            height: @page-edge/2;
            background-color: #fff;
        }
        .swiper-container-wrapper{
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
            /*overflow: hidden;*/
            >.list-block{
                margin: 0;
                margin-top: -1px;
                ul{
                    background-color: transparent;
                }
            }

            .item-inner{
                position: relative;
                font-size: 0.9rem;
                padding: 0 !important;
                margin-right:@page-edge;
                margin-top:@page-edge;
                >*{
                    z-index: 5;
                }

                &:before{
                    content: "";
                    position: absolute;
                }
            }



            //各个分类公共样式
            &{
                h3,.address{
                    text-shadow: @dark-shaow;
                    left: 50%;
                    position: absolute;
                    text-align: center;
                    max-width: 90%;
                    .txcut
                }

                h3{
                    font-weight: 100;
                    top: 50%;
                    color: #ffffff;
                    transform: translate(-50%,-100%);
                    border: 1px solid #fff;
                    padding:0em 0.5em;
                    border-left: none;
                    border-right: none;
                    white-space: nowrap;
                    font-size: 1.3em;
                    margin: 0;
                }
                .bulletScreen{
                    display: none;
                    top: 2px;
                    position: absolute;
                    width: 100vh;
                }
                .address{
                    width: 85%;
                    top: 54%;
                    transform: translate(-50%,0%);
                    margin-top: 0rem;
                    color: @cl-red;
                    font-size: 0.8rem;
                    line-height: 1.5em;
                    .icon{
                        position: relative;
                        top: -0.1em;
                        font-size: 1.5em;
                    }

                    &[address="addr-"]{
                        display: none;
                    }
                }

                .img{
                    width: 100%;
                    height: 180px;
                    display: block;
                    position: relative;
                    z-index: 1;
                    &:after{
                        position: absolute;
                        z-index: 1;
                        content:"";
                        &:extend(.expandin);
                        background-color: fade(#333,12);
                        top: 0;
                        left:0;
                    }
                    img{
                        object-fit: cover;
                        border-radius: @page-edge/2;
                        position: absolute;
                        &:extend(.expandin);
                    }
                }

                .price{
                    position: absolute;
                    top:@page-edge;
                    left: 0;
                    background-color: @cl-red;
                    color: #ffffff;
                    .padding_h(1em);
                }

                .label{
                    position: absolute;
                    top:@page-edge;
                    right: @page-edge;
                    color: #ffffff;
                    border-radius: 0.75em;
                    .padding_h(0.5em);
                    background-color: @cl-red;
                    .lineh(1.5em);
                }

                .pingjia{
                    position: absolute;
                    left:@page-edge;
                    top:@page-edge;
                    color: #ffffff;
                }

                .xingji{
                    right:@page-edge;
                    position: absolute;
                    top:@page-edge;
                    background-color: #FB3B46;
                    color: #ffffff;
                    .padding_h(0.5em);
                    .lineh(1.5em);
                    border-radius: 0.75em;
                }
            }



            &.JINGDIAN{
                .pingjia{
                    display: none;
                }
                .xingji{
                    display: none;
                }
            }

            &.MEISHI{
                .price{
                    display: none;
                }
            }

            &.JIUDIAN{
                .price{
                    left: auto;
                    right:@page-edge;
                    background-color: transparent;
                    color: #fb3b46;
                    top: auto;
                    bottom:@page-edge;
                    text-align: right;
                    padding: 0;
                    i,&:after{
                        color: #ffffff;
                        font-size: 0.6em;
                    }
                    &:after{
                        content: "起";
                    }
                }
            }
            &.ZIXUN,&.DIANGU{
                .label{
                    display: none;
                }
            }

            .intro{
                //display: none;
                position: absolute;
                bottom: @page-edge/2;
                width: 100%;
                box-sizing: border-box;
                padding:0 @page-edge/2;
                left: 0;
                text-align: left;
                color: #ffffff;
                text-shadow: @dark-shaow;
            }
            .tou-ping{
                display: none;
                bottom: @page-edge/2;
                width: 100%;
                box-sizing: border-box;
                left: 0;
                text-align: left;
                color: #ffffff;
                text-shadow: @dark-shaow;
                font-size: 0.8rem;
                font-weight: 100;
                height: 45px;
                position: absolute;
                margin: 0;
                padding-left: 60px;
                img {
                    top: 3px;
                    left: 3px;
                    position: absolute;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                }
                .uname {
                    display: block;
                    margin-bottom: 0.5em;
                }
                i{
                    &.icon{
                        font-size: 1rem;
                        color: @cl_flat_yellow;
                        margin-left: @page-edge;
                    }
                }
            }
            .mui-switch{
                display: none;
            }
            &.JIAOTONG,&.SHIPIN,&.WENHUA{
                .xingji{ display: none; }
                .pingjia{ display: none; }
                .price { display: none; }
                .address { display: none; }
                .label { display: none; }
                .intro{ display: block; }
            }
            &.QIYU{
                .tou-ping{display: block}
                .bulletScreen{
                    display: block;
                }
            }
            &.DIANGU,&.QIYU{
                .pingjia{
                    display: none;
                }
            }
        }
        .bulletScreen{
            color:#ff0;
            span:nth-child(1){
                color:#f00;
            }
            span:nth-child(2){
                color:#fff;
            }
            span:nth-child(3){
                color:#f0e;
            }
            span:nth-child(4){
                color:#08c;
            }
        }
        .mui-switch{
            display: none;
        }
        &.QIYU{
            .bulet-button{
                position: relative;
                .mui-switch {
                    width: 52px;
                    height: 31px;

                    border: 1px solid #dfdfdf;
                    background-color: #fdfdfd;
                    box-shadow: #dfdfdf 0 0 0 0 inset;
                    border-radius: 20px;
                    background-clip: content-box;
                    display: inline-block;
                    -webkit-appearance: none;
                    user-select: none;
                    outline: none;
                    position: absolute;
                    top:calc(~"25vh" - ( @page-edge*3.5));
                    right:@page-edge;
                    display: inline-block;
                    z-index: 9999999;
                    //bottom: -78px;

                    &:before {
                        content: '';
                        width: 29px;
                        height: 29px;
                        position: absolute;
                        top: 0px;
                        left: 0;
                        border-radius: 20px;
                        background-color: #fff;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                    }
                    &:checked {
                        border-color: @cl_flat_greenn1;
                        box-shadow: @cl_flat_greenn1 0 0 0 16px inset;
                        background-color: @cl_flat_greenn1;
                    }
                    &:checked:before {
                        left: 21px;
                    }
                    .mui-switch-animbg {
                        transition: background-color ease 0.4s;
                        &:before {
                            transition: left 0.3s;
                        }
                        &:checked {
                            box-shadow: #dfdfdf 0 0 0 0 inset;
                            background-color: @cl_flat_greenn1;
                            transition: border-color 0.4s, background-color ease 0.4s;
                        }
                        &:checked:before {
                            transition: left 0.3s;
                        }
                    }
                    .mui-switch-anim{
                        transition: border cubic-bezier(0, 0, 0, 1) 0.4s,
                        box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
                        &:before {
                            transition: left 0.3s;
                        }
                        &:checked {
                            box-shadow: @cl_flat_greenn1 0 0 0 16px inset;
                            background-color: @cl_flat_greenn1;
                            transition: border ease 0.4s, box-shadow ease 0.4s,
                            background-color ease 1.2s;
                        }
                        &:checked:before {
                            transition: left 0.3s;
                        }
                        display: none;
                    }

                }
            }

        }

    }



</style>
