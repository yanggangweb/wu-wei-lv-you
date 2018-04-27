<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 景点介绍
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
            h3.intro-tx-title
                f7-link(icon="i-laba",@click="play",:class="{active:playState}")
                    b(v-if="playWave")
                        .sk-wave
                            .sk-rect.sk-rect1
                            .sk-rect.sk-rect2
                            .sk-rect.sk-rect3
                            .sk-rect.sk-rect4
                            .sk-rect.sk-rect5
                i.icon.i-dingdan

                | 景点介绍


            .intro-tx(:class="{expand:expand}")
                div(v-html='got("data.merchantInfo.introduction")')
            i.icon.i-down.expander(@click="expand=true")




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";


    export default {
        mixins: [vars.mixin_1],
        data:function(){

            return {
                name:"jingdian-intro",
                id:"",
                pageBg:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/BEIJINGTU/201703150947480679.jpg",
                data:{},
                elem:"",
                expand:true,

                playState:false,
                playWave:false,
            }
        },
        methods:{
            play:function(){
                var m = this;

                m.playState=!m.playState;
                if(!m.playState) {

                    return vars.stopSound();

                }

                var voice = m.got("data.data.voice") || vars.tts(m.got("data.merchantInfo.introduction"));
                if(voice) {
                    m.playWave=true;
                    m.playState=false;
                    vars.playAudio(/^http/.test(voice)?voice:(vars.oss_url_base + voice),function(){
                        console.log("开始播放");
                        m.playWave=false;
                        m.playState=true;
                    })
                }
            }
        },
        mounted:function(){
            var m = this;
            m.id = m.$route.params.id;
            m.req("merchant/merchantdetail",{id:m.id})
                .then(function(data){
                    m.data = data;
                    m.elem = data.data;
                    //m.setBg(_.get(data,"data.backGround") || m.pageBg)
                })
                .catch(function(err){

                })
            ;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-intro;
    .toolClass();
    .@{name}{
        a{
            color: @cl_flat_light;
        }
        .page-content {
            background-color: #ffffff;
        }

        .intro-tx{
            position: relative;
            color: #3E3E3E;
            //text-shadow: @dark-shaow;
            padding:@page-edge;
            //background-color: fade(#000,15);
            word-break: break-all;

            overflow: hidden;
            height: 12em;
            &.expand{
                height: auto;
                + .expander{
                    display: none;
                }
            }

            img{
                max-width:100%;
                margin: 0.5em auto;
            }
        }

        .expander{
            display: inline-block;
            position: relative;
            left: 50%;
            transform: translate(-50%,20%);
            color: #ffffff;
        }


        .sk-wave {
            width: 30px;
            height: 6px;
            text-align: center;
            font-size: 10px;
            display: block;
        }
        .sk-wave .sk-rect {
            background-color:  @main_color_light;
            height: 100%;
            width: 6px;
            display: inline-block;
            -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
            animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
        }
        .sk-wave .sk-rect1 {
            -webkit-animation-delay: -1.2s;
            animation-delay: -1.2s;
        }
        .sk-wave .sk-rect2 {
            -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
        }
        .sk-wave .sk-rect3 {
            -webkit-animation-delay: -1s;
            animation-delay: -1s;
        }
        .sk-wave .sk-rect4 {
            -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
        }
        .sk-wave .sk-rect5 {
            -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
        }
        @-webkit-keyframes sk-waveStretchDelay {
            0%, 40%, 100% {
                -webkit-transform: scaleY(0.4);
                transform: scaleY(0.4);
            }
            20% {
                -webkit-transform: scaleY(1);
                transform: scaleY(1);
            }
        }

        @keyframes sk-waveStretchDelay {
            0%, 40%, 100% {
                -webkit-transform: scaleY(0.4);
                transform: scaleY(0.4);
            }
            20% {
                -webkit-transform: scaleY(1);
                transform: scaleY(1);
            }
        }
    }
</style>
