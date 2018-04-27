<template type="text/html" lang="jade">
    f7-page(:class="[name]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的收藏

        f7-block.bolck-sham(:class="{listEnd:eof}")
            //收藏
            .list-warpper
                f7-list(v-if="items.length")
                    f7-list-item(v-for="(it,index) in items",:data-id="it.id",:mark="it.mark",:type="it.type",:objectId="it.objectId")
                        .img(@click="next_page(it)")
                            img(:src="it.img", :style="{height:item_height+'px'}")
                        h3
                            p.price {{it.name}}
                                i(v-if="it.type==0 || it.type==1 || it.type==2") ￥{{_get(it,'price','0')}}
                            .intro.shoucang(@click="collectCancel(it.objectId,it.id)")  取消收藏
            .unheader(v-if="!items.length")
                f7-block.no-product
                    p
                        i(class="icon i-ku")
                    p 没有收藏结果，请添加收藏信息！
</template>
<script type="text/ecmascript-6">
    let blk_img_list = [{img:vars.null_img}]
    import filterBar from "../components/filter-bar.vue";
    import null_img from "../assets/tuxiang.jpg";
    import _ from "lodash";
    import PG from "../libs/ClassPG";
    import defaultImage from "../assets/default.jpg";
    var item_height = 180;
    export default {
        data () {
            return {
                name:"my-shoucang",
                data:{
                },
                null_img,
                item_height,
                items:[],
                eof: true,
                sham_list:[],
                listSortData:{},
                filterList:{},

            }
        },
        methods: {
            onInfiniteScroll:function(){
                var m = this;
                m.reqlist();
            },
            beforeanimation:function(){
                var m = this;

            },
            reqlist: function () {
                var m = this;
                if(!m.pg) {
                    m.pg = new PG({
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
                var para={
                    accountId:m.id,
                    ...m.pg.getPara(),
                    noCache:true
                }
                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();
                m.req("collect/list",para).then(
                    function(data){
                        f7.hideProgressbar();
                        if (data.resCode) {
                            //列表信息获取失败
                            m.items = [];
                            f7.hideProgressbar();
                            f7.alert("列表信息获取失败");
                            return;
                        }
                        var newList = _.get(data,'list','').map(el=>{
                            return {
                                item_height,
                                img:el.cover?(vars.oss_url_base + el.cover):defaultImage,
                                price:el.price,
                                type:el.type,
                                mark:el.mark,
                                objectId:el.objectId,
                                label:_.get(el,"classify.0") || "",
//
                                ...(function(fields){
                                    var a = {}
                                    fields.split(",").forEach(function(f){
                                        a[f] = el[f]||"";
                                    })
                                    return a;
                                })
                                ("id,price,name,cover,collectTime,classify,objectId,type,mark")
                            }
                        })
                        m.items = m.items.concat(newList);


                        if (!data.end) {
                            m.pg.step();
                            f7.attachInfiniteScroll(m.$pageContent);

                        } else {
                            m.pg.forceEof();
                        }
                    },
                    function(err){
                        f7.hideProgressbar();
                    })
                ;
            },
            collectCancel:function(objectId,id){
                var m = this;
                return m.req("collect/cancel",{objectId, noCache:true}).then(function(data){
                    if(data.resCode) {
                        throw data.message;
                    }
                    //m.goback();
                    m.items.splice(_.findIndex(m.items,{id}), 1)
                    f7.alert("取消成功")
                    vars.root.$emit("collect-fresh",{objectId,noCache:true})
                });
            },
            next_page:function (it) {
                var m=this;
                var id = it.id;
                var obId=it.objectId;
                var type=it.type;
                var mark=it.mark;
                if( mark == "JINGDIAN"){
                    m.routeTo(`/jingdian-index-page/${obId}/${mark}/`)
                }else if (mark == "JIUDIAN"){
                    m.routeTo(`/jiudian-index-page/${obId}/${mark}/`)
                }
                else if (mark == "MEISHI"){
                    m.routeTo(`/meishi-index-page/${obId}/${mark}/`)
                }
                else if (mark == "WENHUA"){
                    m.routeTo(`/wenhua-index-page/${obId}/${mark}/`)
                }
                else if (mark == "TECHAN"){
                    m.routeTo(`/techan-index-page/${obId}/${mark}/`)
                }else if (mark == "DIANGU"){
                    m.routeTo(`/diangu-index-page/${obId}/${mark}/`)
                }else if (mark == "QIYU"){
                    m.routeTo(`/qiyu-index-page/${obId}/${mark}/`)
                }else if (mark == "HUODONG"){
                    m.routeTo(`/huodong-index-page/${obId}/${mark}/`)
                }

            }
        },
        components:{
            filterBar,
        },
        mounted: function () {
            var m = this;
            m.id=m.$route.params.id;
            m.$pageContent = m.find(".page-content");
            m.reqlist();
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:my-shoucang;
    .toolClass();
    .@{name}{
        .list-block{
            li {
                display: block;
            }
            ul:after {

                background-color: #fff;

            }
        }

        .blank-list{
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
        .list-warpper {
            flex: 1;
            background-color: #fff;
            > .list-block {
                margin: 0;
                margin-top: -1px;
            }
            .item-inner {
                display: block;
                position: relative;
                font-size: 0.9rem;
                padding: 0 !important;
                margin-right: @page-edge;
               // margin-top: @page-edge;
                &:before {
                    content: "";
                    position: absolute;
                }
            }
            //各个分类公共样式
            h3 {

                display: flex;
                padding: 0.5rem 0rem;
                align-items: center;
                font-size: 0.9rem;
                .price{
                    i{
                        color: @cl-red;
                    }

                }
                .shoucang{
                    flex: 1;
                    text-align: right;
                }
            }
            .address {
                width: 85%;
                top: 54%;
                transform: translate(-50%, 0%);
                margin-top: 0rem;
                color: @cl-red;
                font-size: 0.8rem;
                line-height: 1.5em;
                .icon {
                    position: relative;
                    top: -0.1em;
                    font-size: 1.5em;
                }
                &[address="addr-"] {
                    display: none;
                }
            }
            img {
                width: 100%;
                height: 120px;
                border-radius: @page-edge/2;
                object-fit: cover;
                display: block;
            }

            .label {
                position: absolute;
                top: @page-edge;
                right: @page-edge;
                color: #ffffff;
                border-radius: 0.75em;
                .padding_h(0.5em);
                background-color: @cl-red;
                .lineh(1.5em);
            }
            .pingjia {
                position: absolute;
                left: @page-edge;
                top: @page-edge;
                color: #ffffff;
            }
            .xingji {
                right: @page-edge;
                position: absolute;
                top: @page-edge;
                background-color: #FB3B46;
                color: #ffffff;
                .padding_h(0.5em);
                .lineh(1.5em);
                border-radius: 0.75em;
            }
            /*&:last-child{
                padding-bottom: @page-edge;
            }*/
            &:first-child{
                padding-top: @page-edge;
            }
        }

        .page-content{

            .unheader{
                background-color: #fff;
                margin: 0;
                height: calc(~"75vh" - (@page-edge + @top-bar-height) );
                padding-top: 25vh;
                p{
                    text-align: center;
                    .icon{
                        display: flex;

                        font-size: 4rem;
                        -ms-flex-align: center;
                        align-items: center;
                        -webkit-justify-content:center;
                        justify-content:center;
                        color: @cl_flat_gray4;

                    }
                }

            }

        }
        .content-block{
            margin: 0;
            padding: 0;
            margin-top: @page-edge;
            background-color: #fff;
        }
        .infinite-scroll-preloader{
            display: block;
            .preloader {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-image: url("../assets/loading.png");
                background-position: 50%;
                background-size: 100%;
            }

        }

        &.listEnd{
            & +.infinite-scroll-preloader {
                display: none;
                .preloader{
                    display: none;
                }

            }
        }
    }
</style>
