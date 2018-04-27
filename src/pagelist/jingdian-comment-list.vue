<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 评论
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        .body.shortcut-class
            .banner
                img(:src="vars.oss_url_base + got('elem.backGround')")

            .box
                .page-title {{elem.name}}
                .address-row.row.between
                    span.row.red.fx1
                        i.icon.i-dingwei2.size-icon-small
                        span.row.fx1 {{elem.address}}
                    span.row
                        i.icon.i-daohang1.cl-blue.size-icon-small(@click="directTo(elem)")
                        i.v-split
                        |   &nbsp;
                        i.icon.i-dianhua1.cl-black.size-icon-small(@click="phoneCall(got('data.merchantInfo.mobile') || got('data.merchantInfo.phone'))")
            h3.intro-tx-title.flex
                span
                    |   评论({{total}}条) &nbsp;
                    star-list.star(:value="got('mer.commentInfo.avgScore')",:no-edit="true")
                span.rt
                    f7-button.thin(fill,color="orange",@click="routeTo(`/comment-create/${id}/${mark}`,1)") 我要评论

            .blank-label.large(v-show="!list.length") 暂无评论
            .comment-list
                f7-list.no-befer-border
                    f7-list-item(v-for="pl in list")
                        h3
                            img(:src="vars.null_img",v-if="!pl.headImg")
                            img(:src="vars.oss_url_base + pl.headImg",v-if="pl.headImg")
                            b.uname {{pl.nick}}
                                .right(v-if="got('user.id') !== pl.id",fill="",color="orange",@click="routeTo(`/reply-create/${id}/${mark}/${pl.id}/${pl.accountId}/`)")
                                    i.icon.i-xiaoxi
                                    b 回复
                            star-list.star(:value="pl.score",:no-edit="true")
                            b.date {{pl.createTime|formatDate("YYYY-MM-DD  hh:mm:ss")}}
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
                    f7-button(fill,@click="loadMore",v-show="!listEof") 加载更多
</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG"
    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                ...vars.itemCommData,
                name:"jingdian-comment",
                pageBg:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/BEIJINGTU/201703150947480679.jpg",
                mer:"",
                elem:"",
                expand:false,

                list:[],
                listEof:true,
                total:0
            }
        },

        methods:{
            loadMore:function(){
                var m = this;
                m.reqList();
            },
            reqList:function(){
                var m = this;
                if(!m._pg) {
                    m._pg = new PG({
                        size:30,
                        onEofStatusChange:function(flag){
                            m.listEof = flag;
                        },
                        onReset:function(){
                            m.list=[];
                            m.reqList();
                        }
                    })
                }


                vars.__getCuurentMarkByMerchId(m.id)
                    .then(function(mark){
                        return m.req("comment/commentlist",
                            {
                                type:mark,
                                id:m.id,
                                noCache:true,
                                ...m._pg.getPara()
                            }
                        )
                    })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.total = data.totalNum;
                        m._pg.step();
                        if(data.end){
                            m._pg.forceEof();
                        }
                        m.list = m.list.concat(data.list);
                    })
                    .catch(function(err){
                        f7.alert("评论加载错误:",err)
                    })
                ;
            }
        },
        mounted:function(){
            var m = this;
            m.id=m.$route.params.id;
            m.mark=m.$route.params.mark;

            m.req("merchant/merchantdetail",{id:m.id})
                .then(function(merch){
                    if(merch.resCode) {
                        throw merch.message;
                    }
                    m.mer = merch;
                    m.elem = merch.data;
                    m.setBg(merch.data.backGround);
                    m.reqList();
                })
                .catch(function(err){
                    f7.alert(err);
                })
            ;


            m._commentFreshHandler = function(data){
                if(data.id == m.id) {
                    m._pg.reset()
                }
            }
            vars.root.$on("comment-fresh",m._commentFreshHandler)
        },
        beforeDestroy:function(){
            var m = this;
            vars.root.$off("comment-fresh",m._commentFreshHandler)
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-comment;
    .toolClass();
    .@{name}{
        .page-content{
            background-color: #fff;
        }
        p{
            margin: 0;
        }
        a{
            color: @cl_flat_light;
        }
        .comment-list{
            .list-block{
                background-color: transparent;

                .item-inner{
                    .uname,.text,.date{
                        color: #333;
                    }
                }
            }
            margin-top:@page-edge;
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
