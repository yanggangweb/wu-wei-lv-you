<template type="text/html" lang="jade">
    f7-page(:class="[name,'daoyou-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span   导游详情
            f7-nav-right
                f7-link(@click="collectToggle(mer,mark)")
                    i.icon(:class="{'i-fill85':!mer.collected,'i-iconfontshoucang1':mer.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")


        f7-button.orderBtn.no-round.large(fill,color="green",@click="orderDaoyou") 立即预定

        .body.shortcut-class
            f7-list.mlist.no-margin.no-after-border
                f7-list-item.big(divider="")
                f7-list-item.persionInfoRow
                    lmg.header(:src="vars.oss_url_base + got(`data.headImg`)")
                    .info.row.fx1.left.column
                        h3 {{got('data.name')}}
                        .row     价格:￥{{got('data.price')}}/天
                        .row.between.w100p
                            | 电话:{{got('data.mobile','保密')}}
                            i.icon.i-dianhua1.size-icon-small.phoneIcon(@click="phoneCall(got('data.mobile'))")
                        .row.language {{got("data.language")}}
                f7-list-item.big(divider="")
                f7-list-item.otherIntro
                    h3 导游详情
                    .moreIntroText(v-html="got(\"data.introduction\",\"暂无介绍\")")
                f7-list-item.big(divider="")



            //评论相关
            .comment-list.white-bg.no-h-gap
                h4.title
                    .left
                        b 评论
                        star-list(:value="got('mer.commentInfo.avgScore')",:no-edit="true")
                        span.number {{totalNum}}条评论
                    f7-button(fill="",color="orange",@click="routeTo(`/comment-create/${id}/${mark}`)") 我要评论
                f7-list.reply-comment
                    f7-list-item(v-for="pl in commentList")
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
                name: "daoyou-index-page",
                data:{},
                plList: [],
                score: "",
                mer:{},
                plListEof:true,
                commentList:[],

            }
        },
        computed: {
            user:function(){
                return this.$store.getters.user;
            },
        },

        methods: {

            orderDaoyou(){
                var m = this;
                vars.toast({
                    message:"您已预定成功！",
                    timeout:3000,
                    type:"warning"
                })
            },
            reqPLList:function(){
                var m = this;
                if(!m.pg2) {
                    m.pg2 = new PG({
                        size:30,
                        onReset:()=>{
                            m.commentList=[];
                        },
                        onEofStatusChange:function(flag){
                            m.pdListEof = flag;
                        }
                    })
                }
                m.req("comment/commentlist",{
                    id:m.id,
                    noCache:true,
                    type:m.mark,
                    ...m.pg2.getPara()
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.totalNum=data.totalNum;

                        m.commentList = m.commentList.concat(data.list);

                        if(data.end){
                            m.pg2.forceEof()
                        }else{
                            m.pg2.step();
                        }
                    })

                    .catch(function(err){
                        f7.alert(err)
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
                .catch(resp=>{
                    vars.toast(
                        vars.trimErrorMessage(resp)
                    )

                })
                .then(function([merch]){

                    if(merch.resCode ) { throw merch.message; }
                    m.data  = merch.data;
                    m.mer   = merch;

                    //查询相册相关
                })
                .then(function(){

                    m.reqPLList();

                    //绑定刷新评论事件
                    m.freshComment = function({id,mark}){
                        if(id==m.id && mark==m.mark) {
                            m.pg2.reset();
                            m.reqPLList();
                        }
                    }
                    vars.root.$on("comment-fresh",m.freshComment)
                })
                .catch(function(err){
                    //f7.alert(err);
                })
            ;

            return this.$store.getters.user.id;

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

    .toolClass();

    @name: daoyou-index-page;
    .@{name} {

        .body{
            height: 100%;
            overflow-y: auto;
        }

        div.page-content {
            background-color: #fff;
            z-index: 10;
            position: relative;

        }

        .button.orderBtn{
            position: absolute;
            bottom: 0;
            width: 100%;
            .padding_v(12px);
            z-index: 500;

        }



        .phoneIcon{
            background-color:@cl_flat_green;
            color: #ffffff;
            width: 2rem;
            display: inline-block;
            text-align: center;
            border-radius: 50%;
            transform: scale(0.8);
        }


        .moreIntroText{
            min-height: 5em;

            img{
                max-width:100%;
                display: block;
                margin:@page-edge/2 auto;
            }
        }

        .persionInfoRow{

            .item-inner{
                align-items: stretch;
            }
            .header{
                margin-right:@page-edge;
                img{
                    ._size(100);
                    border-radius: 50%;
                }
            }
            .info{
                justify-content: space-between !important;
                font-size: 0.9rem;
                h3{
                    margin-bottom: 0.5rem;
                }
            }
            
            .language{
                color: #989898;
            }
        }

        .otherIntro{

            h3{
                padding: 0.25em 0;
                border-bottom: 1px solid #DADADA;
                margin-bottom: 0.25em;
            }

            .item-inner{
                display: block;
            }

            .moreIntroText{
                font-size: 0.85rem;
                line-height: 1.8em;
            }
        }

        .comment-list{
            padding: 0 @page-edge;
        }

        .mlist{
            margin-bottom: @page-edge;
            .item-content{
                padding: 0;
            }
            .item-inner{
                //line-height: 1.6em;
                padding:@page-edge/2 @page-edge;
            }
            .title-center{
                text-align: center;
                margin: 0 auto;
                font-size: 1.2rem;
            }
        }
        .text-ind {
            font-size: 0.8rem !important;
            line-height: 1.8rem;
            img{
                display: block;
                width: 80%;
                margin:0 10%;
                object-fit: cover;
            }
        }
        .apply-numbder{
            width: 100%;
            .text-content{
                display: flex;
                .text-ind{
                    flex: 1;
                }
                .text-font{
                    font-size: 0.8rem !important;
                    line-height: 1.8rem;
                }

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
