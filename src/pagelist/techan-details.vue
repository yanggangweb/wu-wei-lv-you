<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span {{_get(data,'name')}}
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")
        f7-block
            .full-img()
                img(v-if="!_get(data,'cover')",:src="vars.null_img")
                img(v-if="_get(data,'cover')", :src="vars.oss_url_base + _get(data,'cover')")
            f7-list.blank-list.no-after-border(v-if="!_get(data,'introduction')")
                f7-list-item 没有任何结果，请添加内容
            f7-list
                f7-list-item(v-if="_get(data,'introduction')",v-html="data.introduction")

</template>

<script type="text/ecmascript-6">
    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "techan-details",
                data:"",
            }
        },
        methods: {
        },

        mounted: function () {
            var m = this;
            m.id=m.$route.params.id;
            m.req("product/detail", {id: m.id,noCache:true})
                .then(function(data){
                    m.data = data.data;
                    if(data.resCode) {
                        throw data.message;
                    }
                })
                .catch(function(err){
                    f7.alert(err,"数据加载失败")
                })
            ;
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:techan-details;
    .toolClass();

    @lw:6em;
    .@{name}{
        .page-content {
            background-color: #fff;
            .content-block {
                margin:0;
                padding:0;
                .list-block{
                    margin:0;
                    padding:@page-edge;
                    font-size: 0.9rem;
                    line-height: 1.6rem;
                    ul:before,ul:after {
                        content: '';
                        background-color: transparent;
                    }
                }
            }
        }


        .foodlist{
            flex: 1;
            background-color: #fbfbfb;
            overflow: auto;
            .list-block{
                margin-top: -1px;
                >ul{
                    position: relative;

                }
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: space-around

            }
        }
        .full-img{
            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

    }

</style>
