<template type="text/html" lang="jade">
    f7-page(:class="[name,'jingdian-index-page']")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                .cl_white 产品详情
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")


        i(v-loding-in-view="", v-show="!data")


        f7-block.banner
            div.phone-link-cont
                phone-call-icon(:phone="got('data.merchantInfo.mobile') || got('data.merchantInfo.phone')")

            f7-button.thin.inline.albumn-btn(v-if='_get(album,"totalNum")',round,fill,color="black",@click="routeTo(`/common-albumn/${id}/$`)") {{album.totalNum}} 张图片
            f7-button.thin.inline.albumn-btn(v-if='!_get(album,"totalNum")',round,fill,color="black") 暂无图片
            h2.title-1 {{_get(data,"data.name")}}

        f7-block.body
            .name-row
                span {{_get(pd,"product.name")}}
                f7-button(fill="",color="orange", @click="routeTo(`/jingdian-order/${got('pd.product.id')}/`,1)") 立即购买
            .price-row
                span.price
                    b   ￥{{_get(pd,"product.price")}}
                    |   (已售{{_get(pd,"product.saledNum",0)}}份)
                star-list.star(:value="3",no-edit)

            .desc-row
                h3.desc-title  商品描述
            |   {{_get(pd,"productInfo.introduction")|html2text}}
            .desc-row
                h3.desc-title  费用说明
            |   {{_get(pd,"productInfo.feesDescription","暂无说明")}}

</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    export default {
        mixins: [vars.mixin_1],
        data:function(){
            return {
                ...vars.itemCommData,
                name:"jingdian-products-detail",
                pageBg:"http://qyly-shangnan.oss-cn-beijing.aliyuncs.com/BEIJINGTU/201703150947480679.jpg",
                data:{},
                pd:{},
                expand:false,
                album:{}
            }
        },
        methods:{

        },
        mounted:function(){
            var m = this;

            m.id        =   m.$route.params.id;
            m.merId     =   m.$route.params.merId;
            m.mark      =   m.$route.params.mark;

            Promise.all([
                m.req("merchant/merchantdetail",{id:m.merId}),
                m.req("product/productdetail",{id:m.id})
            ])
                .then(function([merch,pd]){
                    if(merch.resCode ) { throw merch.message; }
                    if(pd.resCode) { throw pd.message; }

                    m.data = merch;
                    m.pd = pd;
                    m.setBg(merch.data.backGround);
                    return m.req("picture/picstorage",{code:m._get(pd,"product.code")})
                })
                .then(function(album){
                    if(album.resCode) {
                        throw album.message;
                    }
                    m.album = album;
                })
                .catch(function(err){
                    f7.alert(err);
                })

            ;
            m.setBg(m.backGround);
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-products-detail;
    .toolClass();
    .@{name}{

        div.page-content{
            .pageSettingFixedBg;
            background-color: transparent;
            .albumn-btn{
                background-color: fade(@cl_flat_black,50) !important;
            }
        }

        .content-block{
            min-height: 80vh;
        }

        .phone-link-cont{
            margin-bottom: 2rem;
        }

        .title-1{
            margin: 0;
            margin-top: @page-edge;
            color: #ffffff;
            text-shadow: @dark-shaow;
            font-weight: 300;
        }


        .with-bg{
            background-color: #ffffff;
            margin: 0;
        }

        .name-row,.price-row{
            line-height: 2rem;
            .padding_v(@page-edge/2);
            display: flex;
            align-items: center;
            border-bottom:1px solid @cl_bd_light;
            font-size: 1rem;

        }

        .name-row{
            span{
                flex: 1;
            }

            .button{

            }
        }

        .price-row{
            .price{
                flex: 1;
                color: @cl_bd_light-2;
                b{
                    font-size: 1.2rem;
                    color: @cl_flat_red;
                }
            }
        }


        .desc-row{
            margin-top:@page-edge/2;
            .desc-title{
                font-weight: 200;
                font-size: 1.2rem;
            }
        }

    }
</style>
