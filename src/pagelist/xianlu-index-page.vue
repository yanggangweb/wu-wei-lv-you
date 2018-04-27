<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span.cl_white 线路详情
            f7-nav-right
                f7-link(@click="collectToggle(mer,mark)")
                    //i.icon(:class="{'i-fill85':!mer.collected,'i-iconfontshoucang1':mer.collected}")
                f7-link(icon="i-iconziti17",open-panel="right")


        f7-block.banner
            div.phone-link-cont
                phone-call-icon(:phone="_get(merchant,'phone') || _get(merchant,'mobile')")

            f7-button.thin.inline.albumn-btn(round="",fill="",color="black",@click="routeTo(`/common-albumn/${id}/!`)") {{_get(mer,"totalNum")}}张图片
            h2.title-1 {{merchant.name}}
                i.icon.i-renzheng(v-if="merchant.authState==5")

        .body

            f7-list.infolist
                f7-list-item
                    .wrap
                        span.price
                            b(v-if="_get(merchant,'price')") ￥
                        |{{_get(merchant,'price','0')}}
                        span.explain
                            i.icon.i-yonghuming
                            i(v-if="_get(merchant,'saledNum')") 已售{{_get(merchant,'saledNum')}}份
                f7-list-item
                    div
                        i.margin-right 线路提供单位:
                        i.explain {{_get(merchant,'provideUnit')}}

                f7-list-item(divider="")
                f7-list-item
                    h4
                        span.margin-right 提示信息:
                        span.yellow 建议提前两天预定
                f7-list-item(divider="")

                f7-list-item.inter-item
                    div
                        p.interpose 线路说明
                    .date-range
                        .day-container.active(@click="openByDrop(calendar1,1,$event)")
                            .title 今天
                            .day
                                .day-num {{min.format('M')}}月{{min.format('D')}}日
                        .day-container(@click="openByDrop(calendar1,2,$event)")
                            .title 明天
                            .day
                                .day-num {{mid.format('M')}}月{{mid.format('D')}}日
                        .day-container(@click="openByDrop(calendar1,3,$event)")
                            .title 后天
                            .day
                                .day-num {{max.format('M')}}月{{max.format('D')}}日
                        .day-container.align-other(@click="openByDrop(calendar1,4,$event)")
                            .title 其他日期
                    .small-button
                        f7-button(fill="",small,round,@click="myTimePrice(line)") 立即购买
                        //input(type="text",@click="openByDrop(calendar1,$event)",v-model="calendar1.value",readonly)
                    transition(name="fade")
                        .calendar-dropdown-bg(v-show="calendar1.show")
                            .calendar-dropdown()
                                calendar(:ref="calendar1",:events="calendar1.events",:lunar="calendar1.lunar",:value="calendar1.value",:weeks="calendar1.weeks",:months="calendar1.months",@select="calendar1.select",@selectMonth="calendar1.selectMonth",@selectYear="calendar1.selectYear")
                f7-list-item(divider="")
            f7-tabs.header-tabs(tabbar,)
                f7-link.link-active.active(@click="visably(1)") 费用说明
                f7-link.link-active(@click="visably(2)") 线路介绍
                f7-link.link-active(@click="visably(3)" ) 行程介绍
                f7-link.link-active(@click="visably(4)") 预定须知
            .block
                .header-body
                    div(v-show="activeIndex == 1")
                        .tab-text(v-html="_get(merchant,'feesDescription',' 暂无内容')")
                    div(v-show="activeIndex == 2")
                        .tab-text(v-html="_get(merchant,'lineIntro',' 暂无内容')")
                    div(v-show="activeIndex == 3")
                        .tab-text(v-html="_get(merchant,'journeyIntro',' 暂无内容')")
                    div(v-show="activeIndex == 4")
                        .tab-text(v-html="_get(merchant,'bookAttention',' 暂无内容')")


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
                    //f7-button(color="orange",v-show="!plListEof",@click="loadMoreComment")


</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import vue from "vue"
    import mo from "moment"
    import PG from "../libs/ClassPG";
    import calendar from '../components/calendar.vue';

    export default {
        mixins: [vars.mixin_1],
        data(valueTime) {
            var m = this;
            return {
                id: "",
                name: "xianlu-index-page",
                merchant: {},
                activeIndex:1,
                line:{
                    id:"",
                    price:"",
                    date:""

                },

                date: "",
                dataPriceId:"",
                plListEof: true,
                min: mo(m.start),
                mid: mo(m.middle),
                max: mo(m.end),
                other: mo(m.otherday),
                plList: [],
                mer: {},
                plTotal: 0,
                album: {},

                null_img: vars.null_img,
                currentName:"",
                currPriceTime:[],
                dataLinePrice:[],
                toPrice:{},
                calendar1: {
                    show: false,
                    value: ["2018,1,11"], //默认日期
                    //lunar:true, //显示农历
                    weeks: ['日', '一', '二', '三', '四', '五', '六'],
                    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                    events: {},
                    select: (valueTime) => {
                        this.calendar1.show = false;

                        let  date = valueTime.join(",");
                        let line = m.dicDate2Line[date];
                        if(line) {
                            m.dataPriceId=line.id;
                            m.currPriceTime=line.date;
                            m.dataLinePrice=line.price;
                            return m.currPriceTime,m.dataLinePrice;
                        }




                        console.log(line);
                    },

                    selectMonth(month, year) {
                        console.log(year, month)
                    },
                    selectYear(year) {
                        console.log(year)
                    },
                    timestamp: Date.now(),
                    priceId:[],
                },



            }
        },

        methods: {

            reqPLList: function () {
                var m = this;
                if (!m.pg2) {
                    m.pg2 = new PG({
                        size: 30,
                        onEofStatusChange: function (flag) {
                            m.pdListEof = flag;
                        },
                        onReset: function () {
                            m.plList = [];
                        }
                    })
                }
                m.req("comment/commentlist", {
                    id: m.id,
                    noCache: true,
                    type: "XIANLU",
                    ...m.pg2.getPara()
                })
                    .then(function (data) {
                        if (data.resCode) {
                            throw data.message;
                        }
                        m.plTotal = data.totalNum;
                        m.plList = m.plList.concat(data.list);
                        if (data.end) {
                            m.pg2.forceEof()
                        } else {
                            m.pg2.step();
                        }
                    })

                    .catch(function (err) {
                        f7.alert(err)
                    })
                ;
            },
            openByDrop(calendar1,clickValue, e) {

                var m = this;
                m.calendar1.show = true;
                var newday=[];
                var midday=[];
                var otherday=[];
                var endday=[];

                newday[0]=m.min.format('Y');
                newday[1]=m.min.format('M');
                newday[2]=m.min.format('D');
                midday[0]=m.mid.format('Y');
                midday[1]=m.mid.format('M');
                midday[2]=m.mid.format('D');
                endday[0]=m.max.format('Y');
                endday[1]=m.max.format('M');
                endday[2]=m.max.format('D');
                otherday[0]=m.other.format('Y');
                otherday[1]=m.other.format('M');
                otherday[2]=m.other.format('D');

                if(clickValue==1){
                    m.calendar1.value=newday;
                }else if(clickValue==2){
                    m.calendar1.value=midday;
                }else if(clickValue==3){
                    m.calendar1.value=endday;
                }else if(clickValue==4){
                    m.calendar1.value=otherday;
                }
                /*this.calendar1.left=e.target.offsetLeft+19;
                this.calendar1.top=e.target.offsetTop+70;*/
                //this.calendar1.left = -16;
                //this.calendar1.top = -45;


                //e.stopPropagation();
                window.setTimeout(() => {
                    document.addEventListener("click", () => {
                        document.removeEventListener("click", () => {
                        }, false);
                    }, false);
                }, 1000)
            },
            Dataline: function () {
                var m = this;


                m.req("line/linePrice", {id: m.id})
                    .then(function (linePrice) {
                        if (linePrice.resCode) {
                            throw linePrice.message;
                        }
//                        var keyArr=[];
//                        var valArr=[];
//                        var obj=time.data;
//                        for(var keys in obj){
//                            keyArr.push(obj[keys].formatDate)
//                            valArr.push(obj[keys].price)
//                        }
//                        //console.log(keyArr);
//                        //console.log(valArr);
//                        var newobject = {};
//                        function fn(keyArr, valArr) {
//
//                            for (var i = 0; i < keyArr.length-1; i++) {
//                                var key = keyArr[i];
//                                var val = valArr[i];
//                                newobject[key] = val;
//                            }
//                            return newobject;
//                        }
//
//                        var op = fn(keyArr, valArr);
                        //console.log(op);


                        let evts = {};
                        m.dicDate2Line = {};
                        linePrice.data.forEach(el=>{
                            evts[el.formatDate] = el.price;
                            m.dicDate2Line[el.formatDate] = el;
                        });


                         m.calendar1.events=evts;
                        //console.log(m.calendar1.events);

                    })
                    .catch(function (err) {
                        f7.alert(err);
                    })
                ;
            },
            visably:function (value) {
                var m=this;


                if(value==1){
                    m.activeIndex=1
                }else if(value==2){
                    m.activeIndex=2
                }else if(value==3){
                    m.activeIndex=3
                }else if(value==4){
                    m.activeIndex=4
                }
                $('.header-tabs .link-active').on('click', function () {
                    $(this).addClass("active").siblings().removeClass("active");
                });
            },
            myTimePrice:function () {
                var m=this;
                if(m.currPriceTime.length ==0 || m.dataLinePrice.length == 0){
                    f7.alert("请选择有价格时间");
                    return
                }else if(m.currPriceTime && m.dataLinePrice){
                    m.routeTo(`/xianlu-order/${m.id}/${m.currPriceTime}/${m.dataLinePrice}/${m.mark}/${m.dataPriceId}/`)
                }else {
                    f7.alert("请选择有价格时间");
                    return
                }

            }
        },

        beforeDestroy(){
            var m = this;
            //m.$root.$off("calendarPriceSet",m.calendarPriceSetHandler);
            //m.$root.$off("calendarTime",m.calendarTimer);
            vars.root.$off("comment-fresh", m.freshComment)
        },

        mounted: function () {
            var m = this;

            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.Dataline();
            var newday=[];
            newday[0]=m.min.format('Y');
            newday[1]=m.min.format('M');
            newday[2]=m.min.format('D');
            m.calendar1.value=newday;
            $('.date-range .day-container').on('click', function () {
                $(this).addClass("active").siblings().removeClass("active");
            });
            $('.header-tabs .link-active').on('click', function () {
                $(this).addClass("active").siblings().removeClass("active");
            });


            //console.log(newday);
            //console.log(m.calendar1.value);


/*
            m.$root.$on("calendarPriceSet",m.calendarPriceSetHandler = price=>{
                var m=this;
                m.toPrice=price;

            })*/
           /* m.$root.$on("calendarTime",m.calendarTimer = currentTime=>{
                var m=this;
                m.currentTime=currentTime;

            })*/

            m.req("line/detail", {id: m.id})
                .then(function (merch) {
                    m.mer = merch;
                    m.merchant = merch.data;
                    m.setBg(merch.data.cover, "auto-height black-mask");
                    return m.req("picture/picstorage", {code: m._get(merch, "data.code")})
                })
                .then(function (album) {
                    if (album.resCode) {
                        throw album.message;
                    }
                    m.album = album;

                    m.freshComment = function ({id, mark}) {
                        if (id == m.id && mark == m.mark) {
                            m.pg2.reset();
                            m.reqPLList();
                        }
                    }
                    vars.root.$on("comment-fresh", m.freshComment)
                })
                .catch(function (err) {
                    f7.alert(err);
                })
            ;

            m.reqPLList();


        },
        props: {
            start: {
                default() {
                    return new Date()
                }
            },
            middle: {
                default() {
                    return new Date(new Date() * 1 + 24 * 60 * 60 * 1000);
                }
            },
            end: {
                default() {
                    return new Date(new Date() * 1 + 48 * 60 * 60 * 1000)
                }
            },
            otherday: {
                default() {
                    return new Date(new Date() * 1 + 72 * 60 * 60 * 1000)
                }
            }
        },

        beforeDestroy: function () {
            var m = this;

            m.$root.$off("calendarPriceSet", m.freshComment)

        },

        components: {
            calendar,
        },

        directives: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    @name: xianlu-index-page;

    .toolClass();

    .@{name} {
        .day-container {
            position: relative;

            .el-date-editor {
                opacity: 0;
                position: absolute;
                .expandin;
                .el-input__inner {
                    height: 100%;
                    width: 100%;
                }
            }

            .day {
                display: flex;
            }
            .day-num {
                display: flex;
                align-items: center;
                font-size: 1.2rem;
                margin: 0 auto;
            }
            .m-w-conatainer {
                display: flex;
                flex-direction: column;
                font-size: 0.8rem;
                justify-content: center;
                align-items: center;
            }
        }
        .header-tabs ,.time-tsbs{
            &.tabs {
                text-align: center;
                font-size: 1rem;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                a.link-active {

                    background-color: #fff;
                    align-items: center;
                    padding: 8px 0 5px;
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
                        color: #43bb73;
                        background-color: #fff;
                        padding: 10px auto 5px;
                        align-items: center;
                        text-align: center;
                        margin: 0 auto;
                        flex: 4;
                        border-bottom: 3px solid #43bb73;

                    }
                }
                .last {
                    span {
                        border-right: none;
                    }
                }
            }
        }
        .tab-text {
            padding: @page-edge;
        }
        .date-line {
            .item-inner {
                padding: @page-edge @page-edge*2 !important;
                justify-content: center;
            }
            .long {
                text-align: center;
                span {
                    display: inline-block;
                    border-bottom: 1px solid @cl_bd_light-2;
                }
            }
        }

        .product-item {
            @s: 80px;
            .item-inner {
                img {
                    ._size(@s);
                }

                .info {
                    position: relative;
                    height: @s;
                    font-size: 0.9rem;
                    margin: 0 @page-edge/2;
                    flex: 1;
                    b {
                        font-size: 0.75rem;
                        position: absolute;
                        left: 0;
                        width: 100%;
                        top: 50%;
                        transform: translate(0, -50%);
                    }
                    h4 {
                        font-weight: 100;
                    }
                }
                .confirm {
                    text-align: center;
                    ._size_lh(36);
                    color: #ffffff;
                    background-color: @cl-orange;
                    border-radius: 1px;
                }
            }
        }

        .amap-copyright {
            display: none;
        }
        .comment-list {
            h3 {
                .uname {
                    .right {
                        float: right;
                        i {
                            font-size: 1rem;
                        }
                    }
                }
            }
            .riqly {
                padding-left: @page-edge;
                .nickbule {
                    color: @cl_flat_green1;
                }
                .replyred {
                    color: @cl_flat_red;
                }
            }
        }

        .infolist {
            color: @cl_gray_font;
            margin: 0;

            .item-content {
                padding: 0;
            }
            .item-inner {
                padding: 0 @page-edge;
                i {
                    font-size: 1rem;
                }
                .calendar-dropdown-bg{
                    background-color: fade(#000,20);
                    position: fixed;
                    z-index: 6000;
                    .expandin;
                }
                .calendar-dropdown {
                    //position: relative;
                    //background-color: #fff;

                    position: fixed;
                    z-index: 6001;
                    bottom: 0;
                    left: 0;
                    width: 100vw;
                    min-height: 60px;
                    background-color: #fff;
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-direction: column;
                    flex-direction: column;
                }
            }
            .explain {
                color: @cl_flat_gray4;
            }
            .margin-right {
                margin-right: @page-edge;
            }
            .wrap {
                font-size: 1rem;
                .price {
                    color: @cl_flat_red;
                    //margin-right: @page-edge;
                }
                .icon {
                    margin: 0 5px;
                    &.i-yonghuming {
                        font-size: 1.4rem;
                    }
                }
            }
            h4 {
                .yellow {
                    color: @cl_flat_yellow2;
                    font-size: 1rem;
                }
            }
            .interpose{
                margin: 10px 0;
                text-align: center;
            }
            .date-range{
                display: flex;
                .day-container{
                    align-items: center;
                    flex: 4;
                    padding: 5px 0;
                    border:1px solid #43bb73;
                    border-left:0 ;
                    .title{
                        text-align: center;
                        font-size: 1rem;
                        margin: auto;
                    }
                    .day{
                        .day-num{
                            font-size: 0.9rem;
                        }

                    }
                    &.align-other{
                        display: flex;
                    }
                    &.active{
                        background-color: #43bb73;
                        color:#fff;
                    }
                    &:first-child{
                        border-left:1px solid #43bb73;
                    }
                }

            }
            .inter-item{
                .item-inner {
                    display: block;
                    .small-button{
                        width: 80px;

                        margin: @page-edge auto;
                        .button.button-fill {
                            background-color:@cl_flat_yellow2 ;
                        }

                    }
                }
            }
        }

        .phone {
            display: block;
            color: @cl-red;
        }

        .address {
            display: block;
            font-size: 0.8rem;
        }

        .gogo-btn {
            transform: rotate(180deg);
            border-right: 1px solid @cl_bd_light-2;
            padding-right: @page-edge;
            color: @cl_bd_light-2;
        }

        .page-content {
            .pageSettingFixedBg;
            background-color: transparent;
            .banner {
                .title-1 {
                    .i-renzheng {
                        font-size: 1.2rem;
                        padding: @page-edge/4;
                        color: @cl_flat_yellow;

                    }
                }
            }
        }

        .amap-container {
            height: 20vh;
        }

        .mapCont, .map {
            position: relative;
            > .button {
                position: absolute;
                top: @page-edge;
                right: @page-edge;

                z-index: 9;
                width: 6em;
            }
        }

        .mapCont {
            width: 100%;
            position: relative;
            .button-cont {
                position: absolute;
                text-align: right;

                right: @page-edge/2;
                top: @page-edge/2;
                width: 8em;
                z-index: 5;
            }
        }

    }

    .produce-info {
        box-shadow: @up-shaow;
        position: fixed;
        bottom: 0;
        transform: translate(0, 110%);
        transition: transform 0.5s @ExpoEaseInOut;
        background-color: #fff;

        &.show {
            transform: translate(0, 0%);
        }

        h4 {
            line-height: 3em;
            font-size: 1.1rem;
            color: darken(@cl_gray_font, 40%);

            position: relative;
            .icon {
                position: absolute;
                right: @page-edge;
                transform: scale(0.7);
                transform-origin: 100% 50%;
            }
        }
        .slider {
            @h: 30vh;
            font-size: 0;
            height: @h;
            width: 100vw;
            margin-left: -@page-edge;
            white-space: nowrap;
            .img {
                font-size: 1rem;
                display: inline-block;
                width: 100%;
                height: 100%;

                .swiper-slide {
                    img {
                        display: block;
                        width: 100%;
                        height: @h;
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

        .title {
            font-size: 1.1rem;
            line-height: 2.5em;
        }
        p.detail {
            margin-bottom: 0.5em;
            padding-left: 1em;
        }

    }


</style>
