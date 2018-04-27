<template type="text/html" lang="jade">
    f7-page(:class="[name]")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span {{titles[id]||titles['']}}
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        f7-block.banner
            div.phone-link-cont




        f7-block.body()
            .gj(v-show="itemData.callApi")
                f7-list
                    f7-list-item
                        f7-label 出发地
                        f7-input(placeholder="请输入地址",type="text",v-model.trim="source")
                    f7-list-item
                        f7-label 目的地
                        f7-input(placeholder="请输入地址",type="text",v-model.trim="target",@keydown.13="gjSearch")
                    f7-list-item
                        f7-button.big(fill,color="orange",big,style="flex:1",@click="gjSearch")  查询

            .text(v-html="itemData.content")



</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG";
    import _ from "lodash";

    export default {
        mixins: [vars.mixin_1],
        computed:{
            geo:function(){
                var m = this;
                return m.$store.state.geo;
            },
        },
        data:function(){
            return {
                ...vars.itemCommData,
                name: "jiaotong-index",

                source:"",
                target:"",

                itemData:{},

                titles:{
                    5:"线路查询",
                    "":"官方交通指南"
                },
                data:{

                }
            }
        },
        methods:{
            gjSearch:function(){
                var m = this;

                if(!m.source) {
                    f7.alert("请输入出发地");
                    return;
                }
                if(!m.target) {
                    f7.alert("请输入目的地");
                    return;
                }
                //var url = `http://api.map.baidu.com/direction?region=西安&origin=${(m.source)}&destination=${(m.target)}&mode=walking&output=html&src=全域旅游`;
                var url = `http://api.map.baidu.com/direction?region=西安&origin=${(m.source)}&destination=${(m.target)}&mode=transit&output=html&src=全域旅游`;
                open(url, "_blank")
            },


        },
        mounted:function(){
            var m = this;

            m.id        =   m.$route.params.id;
            m.mark      =   m.$route.params.mark;


            var itemData = vars.dic.idMark2Item(m.id,m.mark);


            if(!itemData) {
                m.req("picture/adpicture",{sliderKey:m.mark})
                    .then(function(adlist){
                        if(adlist.resCode ) { throw adlist.message; }
                        m.setBg(_.get(adlist,"list.0.pictureUrl"),"auto-height");
                    })

                    .catch(function(err){
                        f7.alert(err);
                    })
                ;
            }else{
                m.setBg(itemData.img||itemData.cover,"auto-height");
                m.itemData = itemData;

                if(itemData.callApi!=1) {

                }

            }

        },
        unmounted:function(){

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jiaotong-index;
    .toolClass();
    .@{name}{

        div.page-content{
            .pageSettingFixedBg;
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }
        }

        .banner{
            min-height:18vh;
        }
        .body{
            padding-top:@page-edge;
            min-height: 80vh;
            background-color: #ff0000;
        }

        .page-content{
            background-color: transparent !important;

            .text{
                //font-size: 0.8rem;

                p{
                    margin: 1em 0;
                }
            }
        }

        .phone-link-cont{ margin-bottom: 2rem; }

        .title-1{
            margin: 0;
            margin-top: @page-edge/2;
            color: #ffffff;
            text-shadow: @dark-shaow;
            font-weight: 300;
        }




    }
</style>
