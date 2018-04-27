<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 酒店信息
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")


        .info(v-if="d.merchantInfo")
            f7-list()
                f7-list-item(divider="")
                f7-list-item.no-flex
                    h3 {{got("d.data.name")}}
                    //p 经济型
                f7-list-item.no-flex.serv
                    h3 酒店设施
                    .grid
                        span.label(v-for="l in d.hotelService") {{l}}
                f7-list-item(divider="")
                f7-list-item.no-flex
                    h3 酒店介绍
                    div(v-html="d.merchantInfo.introduction")

                f7-list-item(divider="")
                f7-list-item.no-flex
                    h3 实用信息
                    p.flex(v-for="(v,k) in d.userfulInfo")
                        span.title {{k}}
                        span {{v}}


</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                id:"",
                d:{},
                name: "jiudian-detail"
            }
        },

        computed: {},

        methods: {
            openCalen:function(){
                var m = this;
                m.myCalendar.open()
            }
        },

        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;


            m.req("merchant/merchantdetail",{id:m.id})
                .then(function(data){
                    m.d = data;
                })
                .catch(function(err){
                    f7.alert(err);
                })
            ;
        },
        components: {

        },

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();


    @name:jiudian-detail;


    .@{name}{
        .info{
            .list-block{
                margin: 0;
            }
            .item-inner{
                font-size: 1rem;
                h3{
                    color: darken(@cl_gray_font,40%);
                    margin-bottom: 0.25rem;
                }
                p{
                    color: @cl_gray_font;
                    font-size: 0.9rem;

                    &.flex{
                        display: flex;
                        justify-content: space-between;
                        color: @cl_gray_font;
                        border-bottom: 1px solid @cl_bd_light-2;
                        line-height: 2.4em;
                        &:last-child{
                            border-bottom: none;
                        }
                    }
                }
            }
            .serv{
                .grid{
                    font-size: 0;
                    .label{
                        font-size: 0.8rem;
                        text-align: center;
                        display: inline-block;
                        vertical-align: top;
                        width: 25%;
                        line-height: 1.5em;
                        color: @cl_gray_font;
                    }

                }
            }
        }
    }



</style>
