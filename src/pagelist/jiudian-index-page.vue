<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white 酒店
            f7-nav-right
                f7-link(@click="collectToggle(mer,mark)")
                    i.icon(:class="{'i-fill85':!mer.collected,'i-iconfontshoucang1':mer.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")

        input(type="hidden",v-model="date",ref="date_input")
        .swiper-container-wrapper.banner.new-banner(v-if="albumList.length")
            f7-swiper.swiper-bullet-custom(pagination="",:params="{speed:500, slidesPerView: 1, spaceBetween: 0, autoplay:2500, loop:true, autoplayDisableOnInteraction:false}")
                f7-swiper-slide(v-for="(img, index) in albumList", v-if="index<3")
                    img(:src="vars.oss_url_base + img.pictureUrl")
        f7-block.banner
            div.phone-link-cont(v-if="got('merchantInfo.phone') || got('merchantInfo.mobile')")
                phone-call-icon(:phone="got('merchantInfo.phone') || got('merchantInfo.mobile')")
            f7-button.thin.inline.albumn-btn(round="",fill="",color="black",@click="routeTo(`/common-albumn/${id}/${mark}`)") {{_get(album,"totalNum")}}张图片
            h2.title-1 {{merchant.name}}
                i.icon.i-renzheng(v-if="merchant.authState==5")

        .body(v-if="merchant.name")

            f7-list.infolist
                f7-list-item(title="商家信息")
                f7-list-item
                    .wrap
                        span.phone
                            | {{merchantInfo.phone}}
                            template(v-if="merchantInfo.mobile && merchantInfo.phone") &nbsp;&nbsp;&nbsp;
                            | {{merchantInfo.mobile}}

                        span.address  地址:{{merchant.address}}
                    i.icon.i-fanhui-copy.gogo-btn(@click="routeTo(`/jiudian-detail/${id}/${mark}`)")
                f7-list-item(divider="")

            div.mapCont
                .button-cont
                    f7-button.ib.color-flat-green(fill,@click="routeTo(`/map-around/周边-${mer.data.name}/${merchant.longitude},${merchant.latitude}`)")
                        |   周边
                    | &nbsp;
                    f7-button.ib.color-flat-green(fill,@click="directTo(merchant)")  导航
                el-amap.map(:zoom="13",:center="[merchant.longitude,merchant.latitude]")
                    el-amap-marker(:position="[merchant.longitude,merchant.latitude]")

            f7-list.infolist
                f7-list-item.date-line
                    date-range(@change="dataChange")
                template(v-for="pd in pdList")
                    f7-list-item(divider="")
                    f7-list-item.product-item(@click="openPDetail(pd)")
                        img(v-if="!pd.cover",:src="null_img")
                        img(v-if="pd.cover",:src="vars.oss_url_base + pd.cover")
                        .info
                            h4 {{pd.name}}
                            b {{pd.introduction|html2text}}
                            .price
                                    div
                                        b ￥{{pd.price}}
                                        s(v-if="pd.originalPrice!=null && pd.originalPrice!=''")  ￥{{pd.originalPrice}}
                                    span(v-if="pd.quantity!=null && pd.quantity!=''") 剩余{{pd.quantity}}间
                        .a.confirm(@click.stop="confirmProduct(pd)") 订
                f7-list-item(divider="")
                f7-list-item(v-show="!pdListEof")
                    f7-button(fill,color="orange",@click="loadMorePd") 加载更多



            //评论相关
            .comment-list.white-bg
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
                    f7-button(color="orange",v-show="!plListEof",@click="loadMoreComment")


        picker.produce-info(:title="_get(pDetail,'product.name')",ref="pDetail")
            .slider
                .img
                    swiper(ref="swiper")
                        swiper-slide(v-for="img in _get(pDetail,'piclist')||[]")
                            img(:src="vars.oss_url_base + img.pictureUrl")
                        .swiper-pagination(slot="pagination")

                    //img(:src="null_img")
            .title 退款规则
            p.detail {{_get(pDetail,"productInfo.refundRule")}}
            .title 使用规则
            p.detail {{_get(pDetail,'productInfo.ruledDescription')}}

</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import vue from "vue"
    import mo from "moment"
    import PG from "../libs/ClassPG";
    export default {
        mixins: [vars.mixin_1],
        data () {

            var m = this;
            return {
                id:"",
                name: "jiudian-index-page",
                albumList:[],
                merchant:{},
                merchantInfo:{},
                commentInfo:{},
                hotelService:{},

                date:"",

                album:{},

                null_img:vars.null_img,

                date:"",

                dateScale:{
                    now:mo(),
                    min:"",
                    max:"",
                },

                pdListEof:true,
                pdList:[],

                plListEof:true,
                plList:[],
                plTotal:0,

                pDetail:{},

                mer:{},
            }
        },

        methods: {
            dataChange:function(dataRange){
                var m = this;

                m.dateScale.min = dataRange.start   .format(vars.dateFormaterMoment);
                m.dateScale.max = dataRange.end     .format(vars.dateFormaterMoment);
            },


            //订产品
            confirmProduct:function(pd){
                var m = this;
                vars.jiudian_order_cache.dateIn         =   m.dateScale.min;
                vars.jiudian_order_cache.dateOut        =   m.dateScale.max;
                vars.jiudian_order_cache.merchantId     =   m.id;

                m.routeTo(`/jiudian-order/${pd.id}/${m.id}`,1)
            },
            loadMorePd:function(){
                var m = this;
                m.reqPDList();
            },
            loadMoreComment:function(){
                var m = this;
                m.reqPLList();
            },
            openPDetail:function(pd){
                var m = this;

                var pdata;
                m.req("product/productdetail",{id:pd.id})
                    .then(function(pdd){
                        if(pdd.resCode) {
                            throw pdd.message;
                        }
                        pdata = pdd;
                        return m.req("picture/picstorage",{code:pdata.product.code})
                    })
                    .then(function(pic){
                        if(pic.resCode) {
                            throw pic.message;
                        }
                        pdata.piclist = pic.list;

                        m.pDetail = pdata;
                        m.$refs.swiper.swiper.slideTo(0);
                        m.$refs.pDetail.show();
                    })
                    .catch(function(err){
                        console.log("获取产品详情失败",err);
                    })
                ;

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
                        onEofStatusChange:function(flag){
                            m.pdListEof = flag;
                        },
                        onReset:function(){
                            m.plList = [];
                        }
                    })
                }
                m.req("comment/commentlist",{
                    id:m.id,
                    noCache:true,
                    type:"JIUDIAN",
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

        mounted: function () {
            var m = this;

            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;

            m.req("merchant/merchantdetail",{id:m.id})
                .then(function(merch){
                    m.mer = merch;
                    m.merchant = merch.data;
                    m.merchantInfo = merch.merchantInfo;
                    m.commentInfo = merch.commentInfo;
                    m.hotelService = merch.hotelService;
                    //m.setBg(merch.data.cover,"auto-height black-mask");
                    return m.req("picture/picstorage",{code:m._get(merch,"data.code")})
                })
                .then(function(album){
                    if(album.resCode) {
                        throw album.message;
                    }
                    m.album = album;
                    m.albumList=album.list;

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

            m.reqPDList();
            m.reqPLList();


            m.myCalendar = f7.calendar({
                input: m.$refs.date_input
            })

        },

        beforeDestroy:function(){
            var m = this;

            if(m.datePicker){
                m.datePicker.destory();
            }
            vars.root.$off("comment-fresh",m.freshComment)

        },

        components: {
            dP:require("vue"),
            dateRange:require("../components/dateRange.vue")
        },

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:jiudian-index-page;

    .toolClass();

    .@{name}{
        .day-container{
            position: relative;


            .el-date-editor{
                opacity: 0;
                position: absolute;
                .expandin;
                .el-input__inner{
                    height: 100%;
                    width: 100%;
                }
            }

            .day{
                display: flex;
            }
            .day-number{
                display: flex;
                align-items: center;
                font-size: 2rem;
                color: @main-color;
            }
            .m-w-conatainer{
                display: flex;
                flex-direction: column;
                font-size: 0.8rem;
                justify-content: center;
                align-items: center;
            }
        }

        .date-line{
            .item-inner{
                padding: @page-edge @page-edge*2 !important;
                justify-content: center;
            }
            .long{
                text-align: center;
                span{
                    display: inline-block;
                    border-bottom: 1px solid @cl_bd_light-2;
                }
            }
        }


        .product-item{
            @s:80px;
            .item-inner{
                img{
                    ._size(@s);
                }

                .info{
                    position: relative;
                    height:@s;
                    font-size: 0.9rem;
                    margin:0 @page-edge/2;
                    flex: 1;
                    b{
                        font-size: 0.75rem;
                        position: absolute;
                        left: 0;
                        width: 100%;
                        top: 50%;
                        transform: translate(0,-50%);
                    }
                    h4{
                        font-weight: 100;
                    }
                    .price{

                        position: absolute;
                        bottom: 0;
                        left: 0;
                        font-size: 0.8rem;
                        display: flex;
                        justify-content: space-around;
                        width: 100%;
                        b{
                            color: @cl_flat_red;
                            font-weight: bold;

                        }
                        s{

                            color:#999;
                            font-weight: bold;
                            margin-left: 10px;
                            font-size: 0.75rem;
                        }
                    }
                }
                .confirm{
                    text-align: center;
                    ._size_lh(36);
                    color: #ffffff;
                    background-color: @cl-orange;
                    border-radius: 1px;
                }
            }
        }

        .amap-copyright{
            display: none;
        }
        .comment-list{
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

        .infolist{
            color: @cl_gray_font;
            margin: 0;

            .item-content{
                padding-left: 0;
            }
            .item-inner{
                padding:@page-edge;
            }
        }

        .phone{
            display: block;
            color: @cl-red;
        }

        .address{
            display: block;
            font-size: 0.8rem;
        }

        .gogo-btn{
            transform: rotate(180deg);
            border-right: 1px solid @cl_bd_light-2;
            padding-right:@page-edge;
            color: @cl_bd_light-2;
        }

        .page-content{
            .pageSettingFixedBg;
            background-color: transparent;
            .banner{
                z-index: 9999;
                .title-1{
                    .i-renzheng{
                        font-size: 1.2rem;
                        padding: @page-edge/4;
                        color: @cl_flat_yellow;

                    }
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

        .amap-container{
            height: 20vh;
        }

        .mapCont,.map{
            position: relative;
            >.button{
                position: absolute;
                top:@page-edge;
                right:@page-edge;

                z-index: 9;
                width: 6em;
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

    .produce-info{
        box-shadow: @up-shaow;
        position: fixed;
        bottom: 0;
        transform: translate(0,110%);
        transition: transform 0.5s @ExpoEaseInOut;
        background-color: #fff;

        &.show{
            transform: translate(0,0%);
        }

        h4{
            line-height: 3em;
            font-size: 1.1rem;
            color: darken(@cl_gray_font,40%);

            position: relative;
            .icon{
                position: absolute;
                right: @page-edge;
                transform: scale(0.7);
                transform-origin: 100% 50%;
            }
        }
        .slider{
            @h:30vh;
            font-size: 0;
            height: @h;
            width: 100vw;
            margin-left:-@page-edge;
            white-space: nowrap;
            .img{
                font-size: 1rem;
                display: inline-block;
                width: 100%;
                height: 100%;

                .swiper-slide{
                    img{
                        display: block;
                        width: 100%;
                        height:@h;
                        object-fit: cover;
                    }
                }
            }
            /*img{*/
                /*display: block;*/
                /*width: 100%;*/
                /*height: 100%;*/
                /*object-fit: cover;*/
            /*}*/
        }

        .title{
            font-size: 1.1rem;
            line-height: 2.5em;
        }
        p.detail{
            margin-bottom: 0.5em;
            padding-left: 1em;
        }
    }





</style>
