<template type="text/html" lang="jade">
    f7-page(:class="[name,{sun:issunney}]",no-navbar)
        .topmav
            f7-link.backico(icon="i-fanhui",back="")
            .navcenter {{weather.city}}
        .weatchercenter
            h3 {{weather.temperature}}
            .row.no-gutter
                .col-40.tablet-25 天气： {{weather.weather}}
                .col-60.tablet-25 风向： {{weather.wind}}
            .row.no-gutter
                .col-40.tablet-25 {{weather.humidity}}
                .col-60.tablet-25 穿衣指数： {{weather.dressingIndex}}
            .row.no-gutter
                .col-40.tablet-25 空气质量：{{weather.pollutionIndex}}
                .col-60.tablet-25 运动指数：{{weather.exerciseIndex}}
        f7-list.tianqi
            f7-list-item(v-for="item in weather.future")
                .row.no-gutter
                    .col-20 {{item.week}}
                    .col-40 {{item.dayTime}}
                    .col-40 {{item.temperature}}


</template>

<script type="text/ecmascript-6">
    import {vars} from "../config";
    import $ from "jquery";
    export default {
        data () {
            return {
                name: "weathers",
                mixins: [vars.mixin_1],
                weather:{},
                issunney:true
            }
        },

        computed: {
            geo:function(){
                var m = this;
                return m.$store.state.geo;
            },
        },

        methods: {
            weatherload(){
                var m = this;

                var geo = m.geo;
                if(geo.error) {
                    console.log("地理位置获取失败，无法获得天气信息");
                    //return;
                }

                var para = {
                    city:geo.city.replace(/市$/,""),
                    province:geo.province.replace(/省$/,"")
                }

                vars.net("::get",para,vars.weather_url_base).then(
                    function(data){
                        m.weather = data.result[0];
                        if(m.weather.weather=="晴"|| m.weather.weather=="多云" || m.weather.weather=="少云" ){
                            m.issunney = true;
                        }else{
                            m.issunney = false;
                        }
                    },
                    function(err){
                        m.weather = vars.default_weather;
                    }
                )
            }
        },

        mounted: function () {
            this.weatherload()
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:weathers;

    .toolClass();

    .@{name}{
        &.page{
            background: linear-gradient(#949698, #bebfbf);
            color: #fff;
            &.sun{
                background: linear-gradient(#1aa0ff, #38acff);
            }
        }
        .topmav{
            line-height: 44px;
            position: relative;
            text-align: center;
            .backico{
                min-width: 44px;
                height: 44px;
                display: inline-block;
                text-align: center;
                color: #fff;
                position: absolute;
                left: 0;
            }
            .navcenter{
                font-size: 17px;
                font-weight: 500;
            }
        }
        .weatchercenter{
            width: 85%;
            margin: 0px auto;
            h3{
                font-size: 4em;
                margin-bottom: 24px;
            }
            .row.no-gutter{
                text-align: left;
                padding-bottom: 12px;
            }
            div[class*="col-"] {
                text-align: left;
            }
        }
        .tianqi{
            &.list-block{
                margin: 24px auto;
                font-size: 0.7rem;
            }
            ul{
                background: transparent;
                .item-content{
                    padding-right: 15px;
                    .item-inner{
                        padding-right: 0px;
                    }

                }
            }
            div[class*="col-"] {
                text-align: center;
            }
        }
        .row.no-gutter{
            width: 100%;
        }


    }



</style>
