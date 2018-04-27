<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 帮助和反馈
        f7-list
            f7-link()
                f7-list-item 更多帮助
                f7-list-item
                    span 金丝峡旅游是指在一定区域内，以旅游业为优势产业，通过对区域内经济社会资源尤其是旅游资源、相关产业、生态环境、公共服务、体质机制、政策法规、文明素质等进行全方位、系统化的优化提升，实现区域资源有机整合、产业融合发展、社会共建共享，以旅游业带动和促进经济社会协调发展的一种新的区域发展理念和模式。在金丝峡旅游中，充分利用目的地全部的吸引物要素，为空前旅游的游客提供全过程、全时空的体验产品，从而全面满足游客的全方位体验需求。“金丝峡旅游”所追求的，不再停留对游客人次增长上，而是旅游质量的提升，追求的是旅游对人民生活品质的意义，追求的是旅游在人们新财富革命中的价值。
        f7-list
            f7-link
                f7-list-item 意见
                f7-list-item
                    f7-input(type="textarea",v-model="form.text_area")
            .button-style
                f7-button(type="submit",@click="submit") 提交

        f7-button.hidden(@click="showDebug")

</template>

<script type="text/ecmascript-6">

    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-bangzhu",
                null_img: vars.null_img,
                data: {},
                form:{
                    textarea:""
                }
            }
        },
        methods: {
            showDebug:function(){
                this.$store.commit("debugShowing",true)
            },
            //界面初始化
            submit: function () {
                var m = this;
                var para = {
                    suggestion:m.form.text_area
                }
                m.req("suggestion/save", para)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        f7.alert("提交成功");
                        history.back();
                    })
                    .catch(function(err){
                        f7.alert(err,"提交失败")
                    })
                ;
            }
        },
        mounted: function () {
            var m = this;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-bangzhu{

        .hidden{
            opacity:0.001;
        }
        .comment-list {
            h3 {
                height: 30px;
            }
        }
        .list-block {
            font-size: 17px;
            list-style: none;
            margin: 0;
            background-color: #fff;
            .item-inner:after {
                background-color: transparent;

            }
            span{
                font-size: 0.8rem;
            }
            textarea{
                margin:@page-edge 0 ;
                padding:@page-edge;
                margin-top: 0;
                background-color: @cl_flat_light;
            }
        }

        .button-style{
            width: 50%;
            float: right;
            .button{

                margin-left: 1em;
                margin-right: 1em;
                border-radius: 1rem;
                border: none;
                height: 2rem;
                line-height: 2rem;
                margin-top:@page-edge;
                border: none;
                background-color: @main_color_light;
                color: #fff;
            }
        }
    }


</style>






