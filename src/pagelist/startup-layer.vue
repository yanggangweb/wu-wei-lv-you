<template type="text/html" lang="jade">
    div(:class="name")
        .changeServerContainer(v-show="changeServerWindowVisible")
            select(v-model="serverPath")
                option(value="")                                    使用默认地址
                option(value="http://192.168.1.2:8080/qyly/app/")   内部测试
                option(value="http://192.168.1.123/qyly/app/")      刘力
                option(value="http://117.34.70.41:16003/app/")      中际测试
                option(value="http://117.34.70.41:16002/app/")      中际线上
                option(value="http://117.34.70.42:16001/app/")      中际app store

        .btn(@click="hide",v-if="advList.length")  跳过({{timeCounter}})
        .swiper-wrapper(v-if="advList.length")
            swiper.swiper-bullet-custom(:options="swiperOpt")
                swiper-slide(v-for="src in advList")
                    img(:src="src")
                    //progressbar
                .swiper-pagination(slot="pagination")
        img(:src="src",v-if="!advList.length",@click.prevent="click")

</template>

<script type="text/ecmascript-6">
    import stratuTr from "../assets/startup.tr.jpg";
    import stratuZj from "../assets/startup.zj.jpg";
    import _ from "lodash";
    import $ from "jquery";


    export default {
        data:function(){
            var m = this;
            return {
                name:"startup-layer",
                src:($=> vars.varsionPrefix==".tr"?stratuTr:stratuZj)(),
                advList:[],
                changeServerWindowVisible:false,
                serverPath:"",

                timeCounter:"---",

                swiperOpt:{
                    pagination : '.swiper-pagination',
                    speed:500,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    loop:false,
                    autoplay:2500,
                    autoplayDisableOnInteraction:false,
                    onSlideNextStart:function(s){
                        if(s.isEnd) {
                            m.hide();
                        }
                    }

                }
            }
        },


        mounted:function(){
            var m = this;
            m._count=0;
            m.serverPath = vars.lockr.get("server_url_base")||"";
            m.$watch("serverPath",function(v){
                vars.lockr.set("server_url_base",v);
                location.href=location.href.split("#")[0];
                location.reload();
            })

            /**
             * 启动画面的p
             * @type {Promise}
             */
            var timePromise = new Promise(function(resolve,reject){
                setTimeout(resolve,vars.startup_sreen_dura)
            })

            /**
             * 封面图片加载完成的p
             * @type {Promise}
             */
            var dataPromise = new Promise(function(resovle,reject){
                m._dataPromiseResolveFunc = resovle;
            })

            /**
             * 启动画面完成，并且封面图片加载完成开始显示封面
             */
            m.startupFaceShowCompletePromise = Promise.all([timePromise,dataPromise]).then(function([a,imageArray]){
                if(!imageArray || !imageArray.length) {
                    m.hide();
                    return;
                }
                m.advList = imageArray;
            })
        },

        methods:{
            _click:_.debounce(function(){
                var m = this;
                if(m._count==6) {
                    //执行
                    m.changeServerWindowVisible = true;
                }
                m._count=0;
            },1000),
            click:function(){
                var m = this;

                m._count++;
                m._click();
            },
            hide:function(){
                var m = this;
                m.$parent.timeDownForceEnd();
            },
            showImages:function(imageArray){
                var m = this;
                m._dataPromiseResolveFunc(imageArray);
            }
        },
        components:{

            progressbar:require("../components/progress-bar.vue")
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:startup-layer;
    .toolClass();
    .@{name}{
        position:fixed;
        z-index: 999;
        &:extend(.expandin);

        .changeServerContainer{
            position: absolute;
            width: 100%;
            left: 0;
            height: 8vh;
            top: 45%;
            transform: translate(0,-50%);
            z-index: 99;
            display: flex;
            justify-content: center;
        }

        .btn{
            background-color: @cl_flat_red;
            border-radius: 2px;
            padding: 0.45em 1em;
            color: #ffffff;
            right:@page-edge;
            top:@page-edge;
            position: absolute;
            z-index: 5;

            .ios &{
                top:@page-edge + @top-bar-height;
            }
        }

        img{
            object-fit: cover;
            display: block;
            &:extend(.expandin);
        }

        .swiper-container{
            height: 100vh;

            .swiper-pagination{
                bottom: 1.5rem;
                .swiper-pagination-bullet{
                    ._size_lh(0.5rem);
                    background-color: @main-color;
                    box-shadow: @light-shaow;
                    opacity: 0.8;
                    &.swiper-pagination-bullet-active{
                        background-color: @main-color;
                        opacity: 1;
                        border-radius: 8px;

                    }
                }
            }
        }
        .container{
            position: absolute;
            top: 50vh;
            width: 100%;
            .progressBar {
                margin: auto;
            }
        }
    }
</style>
