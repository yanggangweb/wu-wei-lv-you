<template type="text/html" lang="jade">
    f7-page(:class="[name]")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white 美食
                div(v-if="mer.merchantInfo")
            f7-nav-right
                f7-link(@click="collectToggle(mer,mark)")
                    i.icon(:class="{'i-fill85':!mer.collected,'i-iconfontshoucang1':mer.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")

        i(v-loding-in-view="", v-show="!data")


        .swiper-container-wrapper.banner.new-banner(v-if="albumList.length")
            f7-swiper.swiper-bullet-custom(pagination="",:params="{speed:500, slidesPerView: 1, spaceBetween: 0, autoplay:2500, loop:true, autoplayDisableOnInteraction:false}")
                f7-swiper-slide(v-for="(img, index) in albumList", v-if="index<3")
                    img(:src="vars.oss_url_base + img.pictureUrl")
        f7-block.banner

            div.phone-link-cont(v-if="got('mer.merchantInfo.phone') || got('mer.merchantInfo.mobile')")
                phone-call-icon(:phone="got('mer.merchantInfo.phone') || got('mer.merchantInfo.mobile')")

            div.tiltle-albumn
                div
                    f7-button.thin.inline.albumn-btn(round="",fill="",color="black",@click="routeTo(`/common-albumn/${id}/${mark}`)") {{_get(album,"totalNum")}}张图片
                h2.title-1 {{_get(data,"name")}}
                    i.icon.i-renzheng(v-if="_get(data,'authState')==5")

        f7-block.body(v-if="_size(data)")
            f7-button.custom-dish(fill,@click="routeTo(`/meishi-dishlist/${id}/${mark}/-1`)") 点餐
            f7-list.mlist
                f7-list-item.title-item 商家信息
                f7-list-item
                    div
                        span.name {{got("mer.data.name")}}
                        em.phone {{got("mer.merchantInfo.phone")||got("mer.merchantInfo.mobile")}}
                        br
                        span.addr 地址:{{got("data.address")}}
                f7-list-item
                    .mapCont
                        .button-cont
                            f7-button.ib.color-flat-green(fill,@click="routeTo(`/map-around/周边-${mer.data.name}/${mer.data.longitude},${mer.data.latitude}`)")
                                |   周边
                            | &nbsp;
                            f7-button.ib.color-flat-green(fill,@click="directTo(data)")  导航
                        el-amap.map(vid="amapDemo",:zoom="13",:center="[data.longitude,data.latitude]")
                            el-amap-marker(:position="[data.longitude,data.latitude]")
                f7-list-item(divider)
                f7-list-item.title-item
                    | 商家介绍
                    i.icon.i-laba(v-if="got('data.voice')")

                f7-list-item
                    div
                       | {{got("mer.merchantInfo.introduction")|html2text}}

                template(v-for="pd in pdList")
                    f7-list-item(divider)
                    f7-list-item.title-item
                        | {{pd.name}}
                        f7-button(color="orange",fill,@click="buy(pd)") 立即下单
                    f7-list-item.pirce-item
                        div
                            span.price ￥{{_get(pd,"price","0")}}
                            i.icon.i-remen-copy
                            | 已售{{_get(pd,"saledNum",0)}}份
                    f7-list-item.product-desc
                        .dish-wrapper
                            h3 菜品内容
                            .dish-list(@click="routeTo(`/meishi-dishlist/${id}/${mark}/${pd.id}`)")
                                i.icon.i-lp_speaker
                                .dish-item(v-for="dish in _get(pd,'list',[])")
                                    | {{dish.name}}/￥{{dish.price}}/{{dish.quantity}}份/合￥{{dish.price*dish.quantity}}
                    template(v-if='_get(pd,"ruleDescription")')
                        f7-list-item 使用规则
                        f7-list-item {{_get(pd,"ruleDescription","暂无规则")|html2text}}
                f7-list-item(v-show="!plListEof")
                    f7-button(color="orange",@click="reqPLList") 更多产品
                f7-list-item(divider)

            .comment-list.white-bg.no-h-gap
                h4.title
                    .left
                        | 评论
                        star-list(:value="got('mer.commentInfo.avgScore')",noEdit)
                        span.number {{plTotal}} 条评论
                    f7-button(fill="",color="orange",@click="routeTo(`/comment-create/${id}/${mark}`)") 我要评论

                f7-list
                    f7-list-item(v-for="pl in plList")
                        h3
                            img(v-if="!pl.headImg",:src="vars.null_img")
                            img(v-if="pl.headImg", :src="vars.oss_url_base + pl.headImg")
                            b.uname {{pl.nick}}
                                .right(v-if="got('user.id') !== pl.id",fill="",color="orange",@click="routeTo(`/reply-create/${id}/${mark}/${pl.id}/${pl.accountId}/`)")
                                    i.icon.i-xiaoxi
                                    b 回复
                            star-list.star(:value="pl.score",noEdit)
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
                    f7-list-item
                        f7-button(color="orange",v-show="!plListEof",@click="reqPLList") 更多评论

</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    import _ from "lodash";

    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                ...vars.itemCommData,
                name:"meishi-index",
                albumList:[],
                data:{},
                mer:{},
                album:{},

                pdListEof:true,
                pdList:[],

                plListEof:true,
                plList:[],
                plTotal:0,
            }
        },
        methods:{

            buy:function(pd){
                var m = this;

                var para = {
                    noCache         :   true,
                    merchantId      :   m.id,
                    comboId         :   pd.id,
                    totalPrice      :   pd.price || _.sum(pd.list.map(el=>el.price*el.quantity)),       //套餐设定的的价格
                    productIds      :   pd.list.map(el=>el.id).join(","),
                    copies          :   pd.list.map(el=>el.quantity).join(",")
                }

                para = encodeURIComponent(JSON.stringify(para));
                m.routeTo(`/meishi-order/${m.id}/${m.mark}/${para}`);
            },

            reqPDList:function(){
                var m = this;
                if(!m.pg1) {
                    m.pg1 = new PG({
                        size:30,
                        onEofStatusChange:function(flag){
                            m.pdListEof = flag;
                        }
                    })
                }
                m.req("product/productList",{
                    id:m.id,
                    ...m.pg1.getPara()
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.pdList = m.pdList.concat(data.list);

                        if(data.end){
                            m.pg1.forceEof()
                        }else{
                            m.pg1.step();
                        }
                    })

                    .catch(function(err){
                        f7.alert(err)
                    })
                ;
            },

            reqPLList:function(){
                var m = this;
                if(!m.pg2) {
                    m.pg2 = new PG({
                        size:30,
                        onReset:()=>{
                            m.plList=[];
                        },
                        onEofStatusChange:function(flag){
                            m.pdListEof = flag;
                        }
                    })
                }
                m.req("comment/commentlist",{
                    id:m.id,
                    noCache:true,
                    type:"MEISHI",
                    ...m.pg2.getPara()
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.plTotal=data.totalNum;
                        m.plList = m.plList.concat(data.list);
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
        mounted:function(){
            var m = this;

            m.id        =   m.$route.params.id;
            m.mark      =   m.$route.params.mark;

            Promise.all([
                m.req("/detail",{id:m.id,mark:m.mark}),
            ])
                .then(function([merch]){
                    if(merch.resCode ) { throw merch.message; }
                    m.data = merch.data;
                    m.mer = merch;
                    //m.setBg(merch.data.cover,"auto-height black-mask");
                    return m.req("picture/picstorage",{code:m._get(merch,"data.code")})
                })
                .then(function(album){
                    if(album.resCode) {
                        throw album.message;
                    }
                    m.album = album;
                    m.albumList=album.list;

                    m.reqPDList();
                    m.reqPLList();

                    m.freshComment = function({id,mark}){
                        console.log(id,mark);
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
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:meishi-index;
    .toolClass();
    .@{name}{

        .item-inner{
            font-size: 0.9rem;
        }

        .button.custom-dish{
            @size:3rem;
            color: #f0f0f0;
            background-color: @main-color;
            position: absolute;
            right: @page-edge;
            ._size_lh(@size);
            top:-@size - 1;
            z-index: 9;
            padding: 0;
            border-radius: 50%;
            margin-top: 5px;
            margin-top: -15px;
            z-index: 9999;

        }
        .body{
            position: relative;
        }
        div.page-content{
            .pageSettingFixedBg;
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }
            .body{
                height: 175px;
            }
            .banner{
                height: 175px;
                z-index: 9999;


                .tiltle-albumn{
                    margin-top: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: absolute;
                    bottom: 35px;
                }
                .phone-link-cont {
                   /* margin-bottom: 1rem;
                    margin-top: 15px;*/
                }
                .title-1{
                    margin-top: 5px;

                    font-size: 1.2rem;
                }
                .swiper-container{
                    margin-top: 10px;
                }
            }
        }

        .dish-wrapper{
            flex: 1;
            >h3{
                margin-bottom: @page-edge/2;
            }
        }
        .dish-list{
            position: relative;
            font-size: 0.9rem;
            min-height: 3em;
            >.icon{
                position: absolute;
                top: 50%;
                right:0;
                opacity: 0.5;
                transform: translate(0,-50%);
            }
        }

        .page-content{ background-color: transparent !important; }

        /*.phone-link-cont{ margin-bottom: 2rem; }*/

        .title-1{
            margin: 0;
            color: #ffffff;
            text-shadow: @dark-shaow;
            font-weight: 300;
            .i-renzheng{
                font-size: 1.2rem;
                padding: @page-edge/4;
                color: @cl_flat_yellow;

            }
        }


        .map{
            height: 20vh;
            flex: 1;
        }

        .phone{
            color: @cl-orange;
            padding-left: 0.5em;
        }

        .title-item{ }
        .pirce-item{
            .price{
                color: @cl-red;
            }
            .icon{
                padding-left: 1rem;
                font-size: 1.2rem;
                position: relative;
                top: -2px;
            }
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

        .mapCont{
            width: 100%;
            position: relative;
            .button-cont{
                position: absolute;
                text-align: right;

                right:@page-edge/2;
                top:@page-edge/2;
                width: 8em;
                z-index: 5;
            }
        }

        .page-bg-img{
            display: none;
        }
        .swiper-container-wrapper{
            img{
                /*max-width: 100%;*/
            height: 25vh;
            display: block;
            width: 100%;
                object-fit: cover;
            }
        }



    }
</style>
