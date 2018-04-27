<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span 搜索结果
            f7-nav-right

        f7-list.saerch-list
            f7-list-item(v-for="it in list",@click="click(it)")
                span {{_get(it,"object.name")}}
                p.type {{opt(_get(it,"object.mark")).label}}
                img(v-if="_get(it,'object.cover')",slot="media",:src="vars.oss_url_base + _get(it,'object.cover')")
                img(v-if="!_get(it,'object.cover')",slot="media",:src="vars.null_img")

        .blank-label.large.darken(v-show="!list.length") 无搜索结果


</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    var opts;
    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                name:"serach-result-page",
                key:"",
                list:[]
            }
        },

        methods: {
            click:function(item){
                var m = this;
                var opt = m.opt(item.object.mark);

                var router = opt.router;



                if(router) {
                    m.routeTo(`/${router}/${item.object.id}/${item.object.mark}`)
                }



            },
            dosearch:function(key){
                var m = this;
                m.req("es/_search",{query:key,from:0,size:360})
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.list = data.data;
                    })
                    .catch(function(err){
                        f7.alert(err,"搜索失败")
                    })
                ;
            },

            opt:function(mark){
                console.log(mark);
                return opts[mark] || opts.default;
            }
        },
        mounted:function(){
            var m = this;
            opts =  vars.dic.type_id2type;
            opts.default={
                label:"未知"
            }
            m.key=m.$route.params.key;
            m.dosearch(m.key);
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:serach-result-page;
    .toolClass();
    .@{name}{
        .saerch-list{
            margin: @page-edge/2 0;
            .item-media{
                img{
                    ._size(@page-edge*4);
                }
            }
            .item-inner{
                //flex-direction: column;
            }

            .type{
                opacity: 0.5;
                font-size: 0.8em;
                width: 4em;
                text-align: right;
            }
        }
    }
</style>
