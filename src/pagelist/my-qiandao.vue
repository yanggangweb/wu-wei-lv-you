<template type="text/html">
    <f7-page class="my-qiandao infinite-scroll" @page:beforeanimation="beforeanimation" @infinite="onInfiniteScroll">
        <f7-navbar back-link="" color="block" sliding>
            <f7-nav-left>
                <f7-link icon="i-fanhui" back=""></f7-link>
            </f7-nav-left>
            <f7-nav-center>
                签到
            </f7-nav-center>
        </f7-navbar>
        <div class="banner-img" >
            <!--<img src="../assets/img_2.png" alt="">-->
            <f7-button @click="qiandao"> {{signstate}} </f7-button>
        </div>
        <div class="sign-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#i-qiandao2"></use>
            </svg>
            <div>累计签到<b> {{signList.totalNum}}</b> 次</div>
        </div>
        <div class="sign-list" v-if="items.length">
            <h3 v-for="item in items">
                    <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#i-qiandao3"></use>
                        </svg>
                        <span v-on="item.signTime">{{item.signTime|formatDate("YYYY-MM-DD  hh:mm:ss")}}</span>
                    </span>
                <i class="sign-text">
                    已签到
                </i>
            </h3>
        </div>
        <div class="no-sign" v-if="!items.length">
            <div class="center-text">
                <p>
                    <i class="icon i-ku"></i>
                </p>
                <div>暂无签到记录</div>
            </div>




        </div>


    </f7-page>
</template>

<script type="text/ecmascript-6">
    import defaulticonfont from "../assets/iconfont/iconfont.js";
    import PG from "../libs/ClassPG";
    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-qiandao",
                data: {},
                scorerule:{},
                integral:{},
                signList:{},
                signstate:{},
                items:[],
                eof: true,
            }
        },
        methods: {
            onInfiniteScroll: function () {
                var m = this;
                m.list_sign();
            },
            //界面初始化
            init: function () {
                var m = this;
                m.req("sign/issignin",{noCache:true})
                    .then(function(data){
                        m.data = data;
                        m.id=data.id;

                        if(data.state==0){
                            m.signstate="签到";

                        }else if(data.state==1){
                            m.signstate="已签到";
                        }
                        if(data.resCode==1) {
                            f7.alert("获取签到失败")
                        }

                    })
                    .catch(function(err){
                    })
                ;


            },
            list_sign:function () {
                var m=this;
                if (!m.pg) {
                    m.pg = new PG({
                        size: 30,
                        pageField: "pageNum",
                        sizeField: "pageSize",
                        onEofStatusChange: function (flag) {
                            m.eof = flag;
                        },
                        onReset: function () {
                            m.items = [];
                        }
                    });
                }
                f7.detachInfiniteScroll(m.$pageContent);
                f7.showProgressbar();

                m.req("sign/list",{noCache: true,...m.pg.getPara()})
                    .then(function(signList){
                        f7.hideProgressbar();
                        if (signList.resCode) {
                            //列表信息获取失败
                            m.items = [];
                            return;
                        }
                        f7.hideProgressbar();
                        m.signList=signList;
                        var newList= signList.list;
                        m.items = m.items.concat(newList);
                        if (!signList.end) {
                            m.pg.step();
                            f7.attachInfiniteScroll(m.$pageContent);
                        } else {
                            m.pg.forceEof();
                        }


                    })
                    .catch(function(err){
                        f7.hideProgressbar();
                    })
                ;
            },
            qiandao: function () {
                var m = this;
                if(m.pg){
                    m.pg.reset();
                }
                m.req("sign/signin" ,{accountId: m.id,noCache:true})
                    .then(function(data){
                        m.data = data;

                        if(data.resCode==0) {
                            m.signstate="已签到";
                            m.list_sign();
                            f7.alert("签到成功");
                        }
                        if(data.resCode==1){
                            m.signstate="已签到";
                            m.list_sign();
                            return
                        }

                        //

                    })
                     .catch(function(err){

                    })
                ;

            },
        },
        mounted: function () {
            var m = this;
            m.$pageContent = m.find(".page-content");
            m.init();
            m.list_sign();
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-qiandao{

        .list-block {
            margin: 0;
        }
        .sign-title{
            background-color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: @page-edge 0;
            .icon{
                display: inline-block;
                font-size: 1.4rem;
                width: 3rem;
                height: 2rem;
                text-align: center;


            }
            div{
                font-size: 1rem;
                b{
                    color:@cl_flat_orange;
                }
            }
        }
        .sign-list{
            h3 {
                color:#9b9b9b;
                display: flex;
                align-items: center;
                background-color: #fff;
                padding:@page-edge/2 @page-edge;
                position: relative;
                span {
                    flex: 1;
                    .icon{
                        width: 3rem;
                        height: 2rem;
                        font-size: 1.4rem;
                        vertical-align: middle;
                        margin-left: -@page-edge;
                    }
                    span{

                        vertical-align: middle;


                        i{
                            display: inline-block;
                            text-align: left;
                            font-size: 1.4rem;
                            width: 3rem;
                            text-align: center;

                            &.i-qiandao1 {
                                color: @cl_flat_green;
                            }
                            &.i-dingdan{
                                color: @cl_flat_blue;
                            }
                            &.i-qinabao-youka {
                                color: @cl_flat_blue;
                            }
                            &.i-tupian5{
                                color: @cl_flat_green;
                            }
                            &.i-youjigonglv{
                                color: @cl_flat_orange;
                            }
                            &.i-pinglun{
                                color: @cl_flat_yellow;
                            }
                            &.i-shezhi1{
                                color: #3f5c6e;
                            }
                        }
                        span{
                            /*vertical-align:text-top;*/
                            color:#666;
                            font-size: 1rem;
                        }

                    }
                    >.sign-text {
                        font-size: 1.2rem;
                        text-align: center;
                        color: @cl_flat_light;


                    }

                }
                &:after{
                    content: '\E796';
                    position: absolute;
                    top: 37px;
                    left:15px;
                    font-weight: 100;
                    color: #b2b2b2;
                    transform: rotate(0.9);
                    z-index: 9999;

                }
                &:last-child{
                    &:after{
                        display: none;
                    }

                }
            }
        }
        .banner-img {
            height: 8rem;
            margin-top: 0;
            position: relative;
            background-color: #feaa2e;
            img {
                width: 100%;
                object-fit: cover;
                display: block;
            }
            .button {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                width: @page-edge*4;
                height:@page-edge*4 ;
                text-align: center;
                bottom: calc(~"50%" - @page-edge*2);
                left: calc(~"50%" - @page-edge*2);
                color: #fc6804;
                border: none;
                border-radius: 50%;
                background-color:#fff;
                box-shadow: 0 0 0 @page-edge/3 #ffdbab;
            }
        }

        .no-sign{
            overflow: auto;
            border-left: none;
            border-right: none;
            box-sizing: border-box;
            text-align: justify;
            margin-top: 0;
            .item-img {
                padding: 1rem 0;
                .item-inner:after {
                    background-color: transparent;
                }
                .tuxiang-img {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    .item-inner:after {
                        background-color: #fff;
                    }
                }
            }

        }
        .no-sign{
            height: calc(~"50vh");
            display: flex;
            align-items: center;

            >.center-text{
                text-align: center;
                font-size: 1.4rem;
                color: @cl_flat_gray;
                flex: 1;
                align-items: center;
                .icon{
                    margin-top: @page-edge;
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
        .infinite-scroll-preloader {
            display: none;
        }




    }
    [router="/my-qiandao/"]{
        #main-view {
            > .navbar:before{
                background-color: transparent;
            }
        }
        div.view{
             > .navbar{
                 background-color:#feaa2e !important;
             }
         }
    }

</style>


