
<template type="text/html" lang="jade">
    f7-page(:class="[name]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的奇遇
        f7-subnavbar
            f7-tabs.header-tabs(tabbar)
                f7-link.link-active(@click="freshListStatusPublished('1')",active)  已发表
                f7-link.link-active(@click="freshListStatusDraft('0')",) 草稿箱

        f7-tabs(animated,:class="[{listEnd:end==1},{listEnd:eof}]")
            f7-tab#tab1
                .list-warpper(v-if="StatusNum==1")
                    .custom-list-item(v-if="items_1.length",v-for="(it,index) in items_1", :data-id="it.id",@click="youjiDetails(it)")
                        .img
                            img(:src="it.img|ossResize(120)")

                        .right.shortcut-class
                            .main-info
                                h5.title(v-html="it.name",:title-leng="it.name")
                                a.right-icon
                                    i.icon.i-shanchu(@click.stop="dele(index)")
                                f7-button.label.thin.hide.green(v-for="el in _get(it,'classify',[])") {{el}}
                            //奇遇
                            .add-info.mark-qiyu.hide
                                .row.between
                                    span.fx1
                                        i.icon.i-wode.big.green
                                        |   {{it.nick}}
                                    //span 发表于{{it.publishTime|formatDate("YYYY-MM-DD")}}{{it.timeSlot}}
                                    span 发表于{{it.timeSlot}}

                            .add-info.mark-qiyu.hide
                                .row.between
                                    span.row
                                        i.icon.i-dingwei2.big.red
                                        | {{it.distance|length}}
                                    span.row
                                        i.icon.i-msg.big.green
                                        |       {{it.commentNum||0}} &nbsp;
                                        i.icon.i-iconfontshoucang1.big.yellow
                                        |   {{it.collectNum||0}}
                            //-奇遇
                .list-warpper(v-if="StatusNum==0")
                    .custom-list-item(v-if="items_2.length",v-for="(it,index) in items_2", :data-id="it.id",@click="youjiDetails(it)")
                        .img
                            img(:src="it.img|ossResize(120)")

                        .right.shortcut-class
                            .main-info
                                h5.title(v-html="it.name",:title-leng="it.name")
                                a.right-icon
                                    i.icon.i-shanchu(@click.stop="dele(index)")
                                f7-button.label.thin.hide.green(v-for="el in _get(it,'classify',[])") {{el}}
                            //奇遇
                            .add-info.mark-qiyu.hide
                                .row.between
                                    span.fx1
                                        i.icon.i-wode.big.green
                                        |   {{it.nick}}
                                    //span 发表于{{it.publishTime|formatDate("YYYY-MM-DD")}}{{it.timeSlot}}
                                    span 发表于{{it.timeSlot}}

                            .add-info.mark-qiyu.hide
                                .row.between
                                    span.row
                                        i.icon.i-dingwei2.big.red
                                        | {{it.distance|length}}
                                    span.row
                                        i.icon.i-msg.big.green
                                        |       {{it.commentNum||0}} &nbsp;
                                        i.icon.i-iconfontshoucang1.big.yellow
                                        |   {{it.collectNum||0}}
                            //-奇遇
        div(:class="[{listEnd:eof}]")
            div(v-show="!items_2.length",)
                div(v-show="!items_1.length",)
                    f7-list.no-list
                        f7-list-item
                            .blank-placeholder.no-mt(style="margin-top:21px")
                                i.icon.i-zhaobudao
                                .label 暂无数据


        f7-toolbar(bottom)
            f7-button(@click="routeTo(`/add-youji/${accountId}/0/`)")
                i.icon.i-tianxie 写奇遇

</template>

<script type="text/ecmascript-6">

    let blk_img_list = [{img: vars.null_img}]
    import null_img from "../assets/tuxiang.jpg";
    import _ from "lodash";
    import $ from "jquery";
    import PG from "../libs/ClassPG";
    import defaultImage from "../assets/default.jpg";

    var item_height = 180;
    export default {
        data () {
            return {
                name: "my-youji",
                data: {},
                null_img,
                list: [],
                Status_num:"",
                items_1:[],
                items_2:[],
                ind:"",
                end:[],
                forceEof:[],
                item_height,
                eof:true,
                StatusNum:1,
            }

        },
        computed: {
            geo:function(){
                var m = this;
                return m.$store.state.geo;
            },


        },
        methods: {
            onInfiniteScroll:function(Status_num){
                var m = this;
                if(m.StatusNum=1){
                    m.freshListStatusPublished();
                }else if(m.StatusNum=0){
                    m.freshListStatusDraft();
                }

            },
            beforeanimation:function(){
                var m = this;

            },
            youjiDetails:function (it) {
                var m=this;
                var id = it.id
                var publishStatus =it.publishStatus;
                if(publishStatus== 1 ){

                    m.routeTo(`/qiyu-index-page/${id}/QIYU/`)
                }
                else if(publishStatus == 0){
                    m.routeTo(`/add-youji/${id}/1/`)
                }


            },
            dele: function (index) {
                var m = this;
                var ind = index;
                m.req("travelnote/delete", {
                    noCache: true,
                    id: m.items[ind].id,
                })
                    .then(function (data) {
                        if (data.resCode) {
                            throw data.message;
                        }
                        vars.toast("删除订单成功")
                        m.items.splice(index, 1);
                        vars.root.$emit("order-fresh", {id: m.items[ind].id, noCache: true});
                    })
                    .catch(function (err) {
                        vars.toast(vars.trimErrorMessage(err))
                    })
                ;
            },
            freshListStatusPublished: function (Status_num) {
                var m = this;
                m.StatusNum=1;
                if(!m.pg_1) {
                    m.pg_1 = new PG({
                        size:10,
                        pageField:"pageNum",
                        sizeField:"pageSize",
                        onEofStatusChange: function (flag) {
                            m.eof = flag;
                        },
                        onReset:function(){
                            m.items = [];
                        },
                    });
                }

                $('.header-tabs a').on('click', function () {
                    $(this).addClass("active").siblings().removeClass("active");
                });
                var para = {
                    noCache: true,
                    accountId: m.accountId,
                    longitude:m.geo.longitude,
                    latitude:m.geo.latitude,
                    publishStatus:1,
                    ...m.pg_1.getPara()
                }

                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();

                m.req("travelnote/mytravelnote", para).then(
                    function (data) {
                        f7.hideProgressbar();
                        if(data.resCode) {
                            //列表信息获取失败
                            f7.alert("列表信息获取失败");
                            f7.hideProgressbar();
                            m.items = [];
                            return;
                        }

                        vars.root.$emit("youjiList-fresh", {publishStatus:1});
                        var newItems = data.list.map(el => {
                            return {
                                item_height,
                                img: el.cover ? (vars.oss_url_base + el.cover) : defaultImage,
                                collectNum: el.collectNum,
                                commentNum: el.commentNum,
                                publishTime: el.publishTime,
                                headImg: el.headImg,
                                nick: el.nick,
                                publishStatus:el.publishStatus,
                                name: el.name,
                                timeSlot:el.timeSlot,
                                ...(function (fields) {
                                    var a = {}
                                    fields.split(",").forEach(function (f) {
                                        a[f] = el[f] || "";
                                    })
                                    return a;
                                })
                                ("id,name,cover,headImg,publishTime,commentNum,collectNum,publishStatus")
                            }

                        })
                        if(!data.end) {
                            m.pg_1.step();
                            m.items_1=newItems;
                            f7.attachInfiniteScroll(m.$pageContent);
                        }else if(data.end==1 && data.totalNum<10){
                            m.pg_1.forceEof();
                            f7.attachInfiniteScroll(m.$pageContent);
                            m.items_1=newItems;
                            return
                        }
                        else{
                            m.eof=true;
                            m.pg_1.forceEof();
                            m.items_1 = m.items_1.concat(newItems);
                            return
                        }



                    },
                    function (err) {
                        f7.hideProgressbar();
                    })
                ;
            },
            freshListStatusDraft: function (Status_num) {
                var m = this;
                m.StatusNum=0;
               /* if(Status_num =="0"){
                    var Status_num=0;
                    if(!m.StatusNum){
                        var localStorage = window.localStorage;
                        if(localStorage.Status_num=="0"){
                            localStorage.removeItem("Status_num");
                        }
                    }

                }*/
                if(!m.pg_2) {
                    m.pg_2 = new PG({
                        size:10,
                        pageField:"pageNum",
                        sizeField:"pageSize",
                        onEofStatusChange: function (flag) {
                            m.eof = flag;
                        },
                        onReset:function(){
                            m.items = [];
                        },
                    });
                }

                $('.header-tabs a').on('click', function () {
                    $(this).addClass("active").siblings().removeClass("active");
                });
                var para = {
                    noCache: true,
                    accountId: m.accountId,
                    longitude:m.geo.longitude,
                    latitude:m.geo.latitude,
                    publishStatus:0,
                    ...m.pg_2.getPara()
                }

                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();

                m.req("travelnote/mytravelnote", para).then(
                    function (data) {
                        f7.hideProgressbar();
                        if(data.resCode) {
                            //列表信息获取失败
                            f7.alert("列表信息获取失败");
                            f7.hideProgressbar();
                            m.items = [];
                            return;
                        }
                        vars.root.$emit("youjiList-fresh", {publishStatus:0});
                        var newItems = data.list.map(el => {
                            return {
                                item_height,
                                img: el.cover ? (vars.oss_url_base + el.cover) : defaultImage,
                                collectNum: el.collectNum,
                                commentNum: el.commentNum,
                                publishTime: el.publishTime,
                                headImg: el.headImg,
                                nick: el.nick,
                                publishStatus:el.publishStatus,
                                name: el.name,
                                timeSlot:el.timeSlot,
                                ...(function (fields) {
                                    var a = {}
                                    fields.split(",").forEach(function (f) {
                                        a[f] = el[f] || "";
                                    })
                                    return a;
                                })
                                ("id,name,cover,headImg,publishTime,commentNum,collectNum,publishStatus")
                            }

                        })

                        if(!data.end) {
                            m.pg_2.step();
                            m.items_2=newItems;
                            f7.attachInfiniteScroll(m.$pageContent);
                        }else if(data.end==1 && data.totalNum<10){
                            m.pg_2.forceEof();
                            f7.attachInfiniteScroll(m.$pageContent);
                            m.items_2=newItems;
                            return
                        }
                        else{
                            m.eof=true;
                            m.pg_2.forceEof();
                            m.items_2 = m.items_2.concat(newItems);
                            return
                        }




                    },
                    function (err) {
                        f7.hideProgressbar();
                    })
                ;
            },
        },
        mounted: function () {
            var m = this;
            m.accountId = m.$route.params.accountId;
            m.$pageContent = m.find(".page-content");
            m.freshListStatusPublished(1);
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();
    .my-youji{

        .toolbar {
            .toolbar-inner {
                .button {
                    margin-left: 1em;
                    margin-right: 1em;
                    border-radius: 1rem;
                    height: 2rem;
                    line-height: 2rem;
                    border: none;
                    background-color: @cl_flat_greenn;
                    color: #fff;
                    display: block;
                    width: 100%;
                }
                a {
                    .icon {
                        position: relative;
                        top: 0px;
                        font-size: 1rem;
                    }
                }
            }

        }
        .subnavbar{
            padding: 0;
            .header-tabs {
                text-align: center;
                font-size: 1rem;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                padding-top: @page-edge;
                margin-bottom: @page-edge*2;
                a.link-active {

                    background-color: #fff;
                    align-items: center;
                    padding-top: 10px;
                    text-align: center;
                    margin: 0 auto;
                    flex: 4;
                    justify-content: center;
                    span {
                        display: block;
                        border-right: 1px solid @cl_flat_gray;
                        margin-top: 8px;
                    }
                    &.active {
                        color: @cl_flat_green;
                        background-color: #fff;
                        align-items: center;
                        padding-top: 10px;
                        text-align: center;
                        margin: 0 auto;
                        flex: 4;
                        border-bottom: 3px solid #01BF9D;

                    }
                }
                .last {
                    span {
                        border-right: none;
                    }
                }
            }
        }
        .tabs-animated-wrap {
            height: auto;
        }
        @keyframes show-content
        {
            from {opacity: 0 }
            to {opacity: 1}
        }
        .no-list{
            animation:show-content 15s;
            -moz-animation:show-content 15s;
            -webkit-animation:show-content 15s;
            -o-animation:show-content 15s;
            margin: 0;
            .item-content{
                .item-inner {

                    text-align: center;
                }
            }
            .no-mt{
                width: 100%;

            }
            ul:after {

                 background-color: transparent;

            }
            & + .infinite-scroll-preloader {
                .preloader {
                    display: none;

                }

                &:after{
                    display: none;
                }
            }
        }
        &.page {

            background-color: #fff;
        }

        .page-content{
            .fixedSlot{
                margin-top:@top-bar-height;
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
                    .main-info{
                        display: flex;
                        .title{
                            flex: 1;
                        }
                        .right-icon{
                            i{
                                font-size: 1.2rem;
                                color: #01BF9D;
                            }
                        }
                    }
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

                &.QIYU{
                    .mark-qiyu.hide{
                        display: block;
                    }
                    .mark-qita{
                        display: none;
                    }
                }
            }

        }
        .infinite-scroll-preloader{
            .preloader {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-image: url("../assets/loading.png");
                background-position: 50%;
                background-size: 100%;

            }

        }
        .listEnd{
            & + .infinite-scroll-preloader {
                .preloader {
                    display: none;

                }

                &:after{
                    display: none;
                }
            }
        }
    }
    .navbar-through{
        .my-youji{
            .page-content{
                padding-bottom: 44px;
                .list-block{
                    margin: 0;
                    .no-mt{
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
