<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center {{title}}
            f7-nav-right
                //f7-link(icon="i-laba",@click="labaClick",:class="{'color-orange':play,'color-gray':!play}")
        .ro-2(v-html="content")

</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";


    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "jingdian-sub-desc",
                id:"",
                title:"",
                content:"",

            }
        },

        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;
            m.title = decodeURIComponent(m.$route.params.title);
            m.content = decodeURIComponent(m.$route.params.content);
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-sub-desc;
    .toolClass();
    .@{name}{
        .ro-1{
            text-align: right;
            margin:@page-edge;
        }

        .ro-2{
            margin-top:@page-edge/2;
            background-color: #ffffff;
            padding:@page-edge;
            color: @cl_flat_black;
            line-height: 2em;
            text-indent: 2em;
        }
    }



</style>
