<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 关于金丝峡旅游
        f7-block
                h3
                    |金丝峡旅游APP
                h4
                    |金丝峡旅游APP是面向游客的目的地旅游APP
                p
                    |包含内容：
                p
                    |1、信息查询、景区导览、旅游线路、美食酒店、攻略游记、旅游信息搜索。
                p
                    |2、电子地图，以及主题推荐等，为游客提供动态、详尽、准确、多元化的旅游信息服务。
                p
                    |3、支持旅游目的地的全面导览，利用文字、照片、语音、视频等多种方式全面展示旅游信息。
                p
                    |4、可实现景点、美食、酒店预订功能，让游客感受到新颖便捷、优质、安全、高效、贴心的旅行服务。
                .right
                        .ju-right
                            |技术支持：陕西天润科技股份有限公司
                            br
                            |中际旅游文化有限公司



</template>

<script type="text/ecmascript-6">
    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-guanyu",
                null_img: vars.null_img,
                data: {}
            }
        },
        methods: {
            //界面初始化
            init: function () {

            }
        },
        mounted: function () {
            var m = this;
            m.init();
        },
        components:{

            created:require("../components/progress-bar.vue")
        }


    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-guanyu{

        .page-content{
            background-color: #fff;
            h3{
                color: #000;
                line-height: 2rem;
                text-align: center;
            }
            h4{
                text-align: left;
            }
            p{
                line-height:1.6rem;
            }
            .right{
                text-align: left;
                display: flex;
                .ju-right{
                   flex: 1;
                   text-align: right;
                }
            }

        }
    }


</style>






