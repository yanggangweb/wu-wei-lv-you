<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我的地址
        div(v-if="data.list")
            .list-warpper(@click="listClick")
                f7-list.full-container(v-for="(item,index) in data.list",:data-id="item.id")
                    div.zanid(:accountId="item.accountId")
                        f7-link.tao-zhuan
                            f7-list-item
                                p.title {{item.consignee}}
                            f7-list-item
                                p {{item.detailAddress}}
        f7-list.full-icon
            f7-link.tao-zhuan(@click="xin_zeng")
                f7-list-item
                    h3
                        f7-link(icon="i-xinzeng") 新增地址


</template>
<script type="text/ecmascript-6">
    import Picker from "../components/picker";
    export default {
        data () {
            return {
                name:"personal-address",
                data:{
                }
            }

        },
        methods: {
            listClick:function(e){
                var m = this;
                var li =m.$(e.target).parents("div.list-block");
                var ali =m.$(e.target).parents().find("div.zanid");
                var id = li.attr("data-id");
                var aid = ali.attr("accountId");
                m.$router.loadPage(`/alter-address/${id}/${aid}/`)
            },
            xin_zeng:function (e) {
                var m = this;
//                var li =m.$(e.target).parents().parents().find("div.zanid");
//                console.log(li);
//                var id = li.attr("accountId");
//                console.log(id);
                m.$router.loadPage(`/add-address/`)
            },
        },
        mounted: function () {
            var m = this;
            m.id=m.$route.params.id;
            m.req("addressmanage/list",{noCache:true})
                .then(function (data) {
                    m.data = data;
                    if (data.resCode) {
                        throw data.message;
                    }
                })
                .catch(function(err){
                })
            ;
            m._commentFreshHandler = function(data){
                if(data.id == m.id) {
                    m._pg.reset()
                }
            }
            vars.root.$on("comment-fresh",m._commentFreshHandler)
        },
        beforeDestroy:function(){
            var m = this;
            vars.root.$off("comment-fresh",m._commentFreshHandler)
        }

    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .personal-address{
        .list-block{
            margin:@page-edge 0;
            .tao-zhuan{
                display: block;
                list-style-type: none;
                background-color: #fff;
                >div{
                    color:#000;
                }
            }
        }
        .full-container{
            .item-inner{
                margin-top: 0;
                .title{
                    color:#000;
                    font-weight: 300;
                    font-size: 1.17rem;
                }
                &:after{
                    background-color:transparent;
                }
                p{
                    font-size: 1rem;
                    color: @cl_flat_black;
                }

            }
        }
        .full-icon{
           .item-inner{
               justify-content: flex-start;
               a{
                   color: #000;
                   .i-xinzeng{
                       color: @cl_flat_green1;
                   }
               }
           }
        }
    }
</style>
