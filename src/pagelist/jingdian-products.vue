<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 产品预订
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
                i.icon.i-chanpin1
                | 产品列表


            .blank-label.large(v-show="!list.length") 暂无产品
            .plist
                f7-list
                    f7-list-item(v-for="item in list",@click="routeTo(`/jingdian-products-detail/${id}/${mark}/${item.id}`)")
                        img(slot="media", :src="vars.null_img", v-if="!item.cover")
                        img(slot="media", :src="vars.oss_url_base + item.cover", v-if="item.cover")
                        h3  {{item.name}}
                        p.desc {{_get(item,"introduction")||"暂无描述"|html2text|strleng(80)}}
                        .bot
                            p.price
                                b ￥{{item.price}}/人
                                span(v-if="item.originalPrice!=null && item.originalPrice!=''")   原价:￥{{item.originalPrice}}/人
                            f7-button.thin.linkto(fill, @click.prevent="routeTo(`/jingdian-order/${item.id}/`,1)") 立即购买

                f7-button(fill,@click="loadMore",v-show="!listEof") 加载更多

</template>

<script type="text/ecmascript-6">
    import PG from "../libs/ClassPG"
    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                ...vars.itemCommData,
                name:"jingdian-products",
                pageBg:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/BEIJINGTU/201703150947480679.jpg",
                data:"",
                elem:"",
                expand:false,

                list:[],
                listEof:true
            }
        },

        methods:{
            loadMore:function(){
                var m = this;
                m.reqList();
            },
            reqList:function(){
                var m = this;
                if(!m._pg) {
                    m._pg = new PG({
                        size:30,
                        onEofStatusChange:function(flag){
                            m.listEof = flag;
                        }
                    })
                }

                //
                m.req("product/productList",
                    {
                        id:m.id,
                        ...m._pg.getPara()
                    }
                )
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m._pg.step();
                        if(data.end){
                            m._pg.forceEof();
                        }
                        m.list = m.list.concat(data.list);
                    })
                    .catch(function(err){
                        f7.alert("产品加载错误:",err)
                    })
                ;
            }
        },

        mounted:function(){
            var m = this;

            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.req("merchant/merchantdetail",{id:m.id})
                .then(function(data){
                    if(data.resCode) {
                        throw data.message;
                    }
                    m.data = data;
                    m.elem = data.data;
                    m.reqList();
                })
                .catch(function(err){
                    f7.alert(err);
                })
            ;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-products;
    .toolClass();
    .@{name}{
        p{
            margin: 0;
        }
        a{
            color: @cl_flat_light;
        }
        .page-content {
            background-color: #fff;
        }

        .plist{
            @ih:100px;
            margin-top:@page-edge;

            .list-block{
                margin-top:0;
                position: relative;
                &:before{
                    content: "";
                    position: absolute;
                    z-index: -1;
                    &:extend(.expandin);
                    //background-color: @cl_flat_black;
                    opacity: 0.33;
                }
                >ul{
                    background-color: transparent;
                    position: relative;

                    &:after,&:before{
                        display: none;
                    }
                }
            }
            a,&{
                color: #333;
            }

            .item-content{
                padding:@page-edge/2;
            }
            .item-media{
                margin: 0;
                padding: 0;
                //margin-right: @page-edge;
                img{
                    display: block;
                    ._size_lh(@ih);
                }
            }




            .item-inner{
                margin: 0;
                padding: 0;
                margin-left: @page-edge/2;
                display: flex;
                flex-direction: column;
                text-align: left;
                //justify-content: space-between;
                align-items: stretch;
                &:after {
                    display: none;
                }
            }

            h3{
                text-align: left;
                font-weight: 400;
                margin-top: 0;
                margin-bottom: 0;
                font-size: 1rem;
            }
            .desc{
                font-size: 0.85rem;
                color: #666666;
            }
            .bot{
                display: flex;
                align-items: center;
                .price{
                    font-size: 1em;
                    flex: 1;
                    color: @cl_flat_red;
                    span{
                        color: #999;
                        font-size: 0.8rem;
                        font-weight: bold;
                    }
                }

                .linkto{
                    background-color: #4BAD96;
                    color: #ffffff;
                }
            }
        }


        .addr{
            color: #ffffff;
            .center;
            display: block;
            text-align: center;
        }
    }
</style>
