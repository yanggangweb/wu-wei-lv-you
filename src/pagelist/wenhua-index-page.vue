<template type="text/html" lang="jade">
    f7-page(:class="[name,'wenhua-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white  文化
            f7-nav-right
                f7-link(@click="collectToggle(mer,mark)")
                    i.icon(:class="{'i-fill85':!mer.collected,'i-iconfontshoucang1':mer.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")
        f7-block.banner
            h2.title-main  {{_get(data,'name')}}
        f7-block.body
            f7-list.mlist
                f7-list-item
                    p.text-ind(v-html="_get(data,'content')")
            .intro-tx-title
                //评论相关
                .comment-list.white-bg.no-h-gap
                    h4.title
                        .left
                            b 评论
                            star-list(:value="avgScore",:no-edit="true")
                            span.number {{totalNum}}条评论
                        f7-link
                            f7-button(fill="",color="orange",@click="routeTo(`/comment-create/${id}/${mark}`)") 我要评论
                    f7-list.reply-comment
                        f7-list-item(v-for="pl in firstcomment")
                            h3
                                img(v-if="!pl.headImg",:src="vars.null_img")
                                img(v-if="pl.headImg", :src="vars.oss_url_base + pl.headImg")
                                b.uname {{pl.nick}}
                                    .right(v-if="got('user.id') !== pl.id",fill="",color="orange",@click="routeTo(`/reply-create/${id}/${mark}/${pl.id}/${pl.accountId}/`)")
                                        i.icon.i-xiaoxi
                                        b 回复
                                star-list.star(:value="pl.score",:no-edit="true")
                                b.date {{_get(pl,"createTime")|formatDate("YYYY-MM-DD  hh:mm:ss")}}
                            p.text {{pl.content}}
                            .riqly
                                p.text(v-for="dp in pl.list",@click="routeTo(`/reply-create/${id}/${mark}/${pl.id}/${dp.accountId}/`)")
                                    b.nickbule(v-if="dp.nick!==dp.replyNick  &&  dp.replyNick") {{dp.nick}}
                                    span 回复
                                    b.replyred(v-if="dp.nick!==dp.replyNick  &&  dp.replyNick") {{dp.replyNick}}
                                    span ：{{dp.content}}
                                .imglist(v-if="pl.updatePicture")
                                    span(v-for="img in pl.updatePicture.split(',')")
                                        img(:src="vars.oss_url_base + img|ossResize(200)")
                        f7-list-item
                            f7-button(color="orange",v-show="!plListEof",@click="reqPLList") 更多评论



</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    import _ from "lodash";
    export default {
        data () {

            var m = this;
            return {
                ...vars.itemCommData,
                name: "wenhua-index-page",
                data:{},
                plList: [],
                avgScore: 0,
                totalNum:0,
                mer:{},
                plListEof:true,
                type:"",
                firstcomment:[],

            }
        },
        computed: {},

        methods: {
            reqPLList:function(){
                var m = this;
                if(!m.pg2) {
                    m.pg2 = new PG({
                        size:30,
                        onReset:()=>{
                            m.firstcomment=[];
                        },
                        onEofStatusChange:function(flag){
                            m.pdListEof = flag;
                        }
                    })
                }
                m.req("comment/commentlist",{

                    id:m.id,
                    noCache:true,
                    type:"WENHUA",
                    ...m.pg2.getPara()
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.totalNum=data.totalNum;

                        m.firstcomment = m.firstcomment.concat(data.list);
                        if(data.end){
                            m.pg2.forceEof()
                        }else{
                            m.pg2.step();
                        }
                    })

                    .catch(function(err){
                        f7.alert("加载失败");
                    })
                ;
            }

        },

        mounted: function () {
            var m = this;

            m.id        =   m.$route.params.id;
            m.mark      =   m.$route.params.mark;

            Promise.all([
                m.req("/detail",{id:m.id,mark:m.mark}),
            ])
                .then(function([merch]){

                    if(merch.resCode ) { throw merch.message; }
                    m.data = merch.data;
                    m.avgScore = parseInt(merch.avgScore);


                    m.mer = merch;
                    m.setBg(merch.data.cover,"auto-height black-mask");
                })
                .then(function(){
                    m.reqPLList();

                    m.freshComment = function({id,mark}){
                        if(id==m.id&&mark==m.mark) {
                            m.pg2.reset();
                            m.reqPLList();
                        }
                    }
                    vars.root.$on("comment-fresh",m.freshComment)
                })
                .catch(function(err){
                    f7.alert(err);
                })
            ;

        },
        beforeDestroy:function(){
            var m = this;
            vars.root.$off("comment-fresh",m.freshComment)
        },
        directives: {}
    }




</script>

<style lang="less"    rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    @name: wenhua-index-page;
    .toolClass();
    .@{name} {
        div.page-content {
            .pageSettingFixedBg;
            z-index: 10;
            .body{
                min-height:calc(~"100%" - ( @page-top-baner-height - @top-bar-height ) );
            }
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }

            .title-main{
                position: relative;
                min-height: 3em;
                margin-top: 6rem;
                color: #ffffff;
                text-shadow: @dark-shaow;
                font-weight: 300;
            }

	    .nowrap-ellipsis {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            //隐藏打分
            .star-list{
                display: none;
                & + .date{
                    padding-left: 0;
                }
                & + .number{
                    padding-left: 0.5em;
                }
            }
        }
        .body{
            position: relative;

        }
        .page-content{
            background-color: transparent !important;
        }
        .mlist{
            margin-bottom: @page-edge;
            .item-content{
                padding: 0;
            }
            .item-inner{
                line-height: 1.6em;
                padding:@page-edge/2 0;
            }
        }
        .text-ind {
            font-size: 0.8rem !important;
            line-height: 1.8rem;
            box-sizing: border-box;
            img{
                width: calc(~"100%" - 15px);
                object-fit: cover;
                padding: @page-edge/2;
            }
        }
        .reply-comment{
            h3{
                .uname{
                    .right{
                        float: right;
                        i{
                            font-size: 1rem;
                        }
                    }
                }
            }
            .riqly{
                padding-left: @page-edge;
                .nickbule{
                    color: @cl_flat_green1;
                }
                .replyred{
                    color: @cl_flat_red;
                }
            }
        }
    }


</style>
