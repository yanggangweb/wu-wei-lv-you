<template type="text/html" lang="jade">
    f7-page(:class="[name,{listEnd:eof}]",@page:beforeanimation="beforeanimation",infinite-scroll,@infinite="onInfiniteScroll")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的评论

            //评论相关
        f7-block.comment-list.white-bg
            f7-list(v-if="items.length")
                f7-list-item(v-for="n in items")
                    h3
                        img(:src="vars.null_img",v-if="!_get(n,'headImg')")
                        img.tuxiang-img(v-if="_get(n,'headImg')",:src="vars.oss_url_base +n.headImg")
                        b.uname {{_get(n,'nick')}}
                        .star
                            star-list(:value="n.score",:no-edit="true")
                            b.date {{n.createTime|formatDate("YYYY-MM-DD")}}
                    p.text {{n.content}}
                    .imglist(v-if="_get(n,'updatePicture')")
                        span(width="50",v-for="img in _get(n,'updatePicture').split(',')")
                            img(:src="vars.oss_url_base + img|ossResize(200)")
            .unheader(v-if="!items.length")
                    f7-block.no-product
                        p
                            i(class="icon i-ku")
                        p 没有评论内容，请添加评论内容！



</template>
<script type="text/ecmascript-6">
    import null_img from "../assets/tuxiang.jpg";
    import PG from "../libs/ClassPG";
    export default {
        data () {
            return {
                name:"my-pinglun",
                data:{
                },
                null_img,
                items:[],
                eof: true,
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
            reqlist:function () {
                var m = this;
                if(!m._pg) {
                    m._pg = new PG({
                        size:30,
                        onEofStatusChange:function(flag){
                            m.listEof = flag;
                        },
                        onReset:function(){
                            m.items = [];
                        }
                    })
                }
                var para = {
                    accountId:m.id,
                    noCache:true,
                    ...m._pg.getPara()
                }
                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();

                m.req("comment/mycomment",para)
                    .then(function(data){
                        f7.hideProgressbar();
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.data=data;

                        var newList= data.list;
                        m.items = m.items.concat(newList);
                        vars.root.$on("comment-fresh",m.data.list);
                        if(!data.end) {
                            m.pg.step();
                            f7.attachInfiniteScroll(m.$pageContent);
                        }else{
                            m.pg.forceEof();
                        }
                    })
                    .catch(function(err){
                        f7.hideProgressbar();
                    })
                ;
            },
        },
        beforeDestroy:function(){
            var m = this;
            vars.root.$off("comment-fresh",m.data.list)
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
    .toolClass();
    .my-pinglun{
        .white-bg{
            background-color: #fff;
        }
        .comment-list {
            .no-after-border{
                margin: 35px 0;
                .item-inner {
                    display: block;
                    text-align: center;
                    padding: inherit;
                }
            }
        }
        .page-content{
            .list-block {
                margin: 0;

            }
            @keyframes show-content
            {
                from {opacity: 0 }
                to {opacity: 1}
            }
            .unheader{
                animation:show-content 4s;
                -moz-animation:show-content 4s;
                -webkit-animation:show-content 4s;
                -o-animation:show-content 4s;
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
        .comment-list {
            margin-top: @page-edge;

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

        &.listEnd{
            .infinite-scroll-preloader {
                display: none;
                .preloader{
                    display: none;
                }

            }
        }
    }
</style>
