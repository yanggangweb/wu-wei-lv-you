<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center
                span {{_get(all,'merchantName')}}
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        picker.meishi-dishilist-shopping-card(ref="shopCard")
            .title
                span
                    i.icon.i-gouwucheman
                    | 购物车
                f7-button(fill,color="orange",@click="clearShoppingCar") 清空全部

            f7-list.food-ls.no-after-border.no-before-border
                f7-list-item(v-for="fd in fdListChoosed")
                    span.name {{fd.name}}
                    span.act
                        i.icon.i-jianshao(@click="editQuantity(fd,-1)")
                        b {{fd.quantity}}
                        i.icon.i-zengjia(@click="editQuantity(fd,+1)")

            .bot-bar
                span.total-price 共计￥{{realTotalPrice}}
                f7-button.no-round(fill,color="red",@click="confirm") 立即下单

        .bot-bar
            .total(@click="openShopCard")
                i.icon.i-gouwucheman
                template(v-if="fdListChoosed.length")
                    span.price
                        template(v-if="calcing") ···
                        template(v-if="!calcing") ￥{{realTotalPrice}}
                    | &nbsp/ 共{{totalQuantity}}件
                template(v-if="!fdListChoosed.length") 购物车是空的

            .desc(v-show="!totalQuantity") 去点东西吧
            f7-button.no-round.desc(fill,v-show="totalQuantity",@click="confirm") 立即下单
        .main
            f7-list.left.button-list
                f7-list-button(v-for="(dl,index) in dishlist",@click="cataClick(index)") {{dl.name}}
            .right.foodlist(ref="foodList")
                f7-list
                    template(v-for="dl in dishlist")
                        f7-list-item(divider,ref="foodDivider")
                        f7-list-button(v-for="di in dl.list")
                            .row
                                i.icon.i-jianshao(@click="editQuantity(di,-1)",:class="{disable:!di.quantity}")
                                lmg(:src="vars.oss_url_base + di.cover")
                                i.icon.i-zengjia(@click="editQuantity(di,+1)")
                            .row
                                p.title {{di.name}}
                                    b.price ￥{{di.price}}



</template>

<script type="text/ecmascript-6">
    import {lazyAMapApiLoaderInstance} from 'vue-amap';
    import _ from "lodash";
    import defaultImg from "../assets/default.jpg";

    var noCache = true;
    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "meishi-dishlist",
                dishid:"",
                ...vars.itemCommData,

                dishlist:[],
                all:"",
                merchantName:"",


                //匹配的套餐
                matchingCombo:"",


                //标识价格计算中,此时不能点击购买
                calcing:false,
            }
        },

        computed: {
            fdListChoosed:function(){
                var m = this;
                var ret = [];
                m.eachFdList(function(fd){
                    if(fd.quantity) {
                        ret.push(fd)
                    }
                })
                return ret;
            },
            totalPrice:function(){
                var m = this;
                var total = 0;
                m.fdListChoosed.forEach(function(el){
                    total=vars.mathAdd(total, el.quantity * el.price);
                })
                return total;
            },

            //进行套餐验证后的价格
            realTotalPrice(){
                var m = this;
                return m.got("matchingCombo.price",m.totalPrice);
            },
            totalQuantity:function(){
                var m = this;
                return _.sumBy(m.fdListChoosed,"quantity")||0
            }
        },

        methods: {
            confirm:function(){
                var m = this;

                if(m.calcing) return;

                var para = {
                    noCache:true,
                    merchantId:m.id,
                    comboId:m.matchingCombo.id||"",
                    totalPrice:m.realTotalPrice,
                    productIds:m.fdListChoosed.map(el=>el.id).join(","),
                    copies:m.fdListChoosed.map(el=>el.quantity).join(",")
                }
                para = encodeURIComponent(JSON.stringify(para));
                m.routeTo(`/meishi-order/${m.id}/${m.mark}/${para}`,1);
                m.$refs.shopCard.hide();

            },

            /**
             * 遍历食品
             * @param callback(fd)
             */
            eachFdList:function(callback){
                var m = this;
                m.dishlist.forEach(function(el1){
                    (el1.list||[]).forEach(function(el2){
                        return callback(el2)
                    })
                })
            },
            clearShoppingCar:function(){
                var m = this;

                f7.confirm("确认要清空吗？","注意",function(){
                    m.fdListChoosed.forEach(function(el){
                        el.quantity=0;
                    });
                    m.$refs.shopCard.hide();
                })
            },
            editQuantity:function(el,quantity){
                var m = this;

                if(isNaN(el.quantity)) {
                    el.quantity = 0;
                }
                el.quantity+=quantity;

                if(el.quantity<0) {
                    el.quantity = 0
                }
            },
            openShopCard:function(){
                var m = this;

                if(!m.fdListChoosed.length)   return;
                m.$refs.shopCard.show();
            },
            cataClick:function(index){
                var m = this;

                var el = m.$refs.foodDivider[index].$el;
                el = vars.$(el);

                m._$foodlist.animate({
                    scrollTop:el.position().top
                })
            }
        },

        watch: {
            fdListChoosed:function(v){
                var m = this;
                if(v==0) {
                    m.$refs.shopCard.hide();
                }
            }
        },

        mounted: function () {
            var m = this;

            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.dishid = m.$route.params.dishid;

            m._$foodlist = vars.$(m.$refs.foodList);

            Promise.all(
                [
                    m.req("product/allproduct",{id:m.id}),
                    (function(){
                        if(m.dishid==-1) {
                            return Promise.resolve({data:{list:[]}})
                        }
                        return m.req("product/combo",{id:m.dishid});
                    })()
                ]
            )
                .then(function([all,dish]){
                    if(all.resCode) {
                        throw all.message;
                    }

                    if(dish.resCode) {
                        throw  dish.message;
                    }

                    m.all=all;
                    m.dishlist = all.list;
                    m.eachFdList(function(fd){
                        var fdInDish=dish.data.list.find(el=>el.id==fd.id);
                        if(fdInDish) {
                            fd.quantity=fdInDish.quantity;
                        }
                    })
                })
                .catch(function(err){
                    vars.toast(vars.trimErrorMessage(err));
                })
            ;


            let verifyCombo = _.debounce((fdList)=>{
                m.req("product/isCombo",{
                    merchantId  :   m.id,
                    productIds  :   fdList.map(el=>el.id).join(",")||"",
                    copies      :   fdList.map(el=>el.quantity).join(",")||"",
                    noCache
                })
                    .then(resp=>{
                        m.matchingCombo =  _.get(resp,"result.combo","");
                        m.calcing = false;
                    })
                    .catch(resp=>{
                        m.matchingCombo = "";
                        m.calcing = false;
                    })
                ;
            },360)

            m.$watch("fdListChoosed",$=>{
                m.calcing = true;
                verifyCombo($);
            })

        },

        components: {},

        directives:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:meishi-dishlist;
    .toolClass();

    @lw:6em;
    .@{name}{
        .page-content{
            display: flex;
        }

        .bot-bar{
            z-index: 90;
            position: absolute;
            display: flex;
            .lineh(3*@page-edge);
            background-color: @cl-orange;
            bottom: 0;
            width: 100%;
            left: 0;

            text-align: center;

            color: #ffffff;
            .total{
                width: 61.8%;

                .icon{
                    margin-right: 0.5rem;
                }
            }

            .desc{
                flex: 1;
                background-color: lighten(@cl-orange,18);
                &.button{
                    .lineh(3*@page-edge);
                    background-color: @cl_flat_red;
                }
            }


        }
        .main{
            flex: 1;
            display: flex;

        }

        .left{
            width: @lw;
            background-color: #f2f2f2;
        }
        .button-list{
            margin-top: 0;
            a.list-button{
                color: #ffffff;
                background-color: @cl-green-other;
                /*text-align: right;*/
                &.active-state{
                    background-color: lighten(@cl-green-other,10);
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
            .row{
                display: flex;
                align-items: center;
                justify-content: space-around;
                &:first-child{
                    padding-top:@page-edge;
                }
                .lmg{
                    width: 50%;
                }
                .icon{
                    color: @cl-orange;
                    &.disable{
                        opacity: 0.4;
                    }
                }

                color: #7E7E7E;
                .price{
                    color: @cl-orange;
                }

            }


        }

    }

    .meishi-dishilist-shopping-card{
        color: #4a4a4a;
        padding-top:@page-edge;

        >h4{
            display: none;
        }

        .title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top:-@page-edge;
            border-bottom: 1px solid @cl_bd_light;
            >span{
                .icon{
                    color: @cl-orange;
                    margin-right: 0.5rem;
                }
            }
            .button{

            }
        }

        .food-ls{
            margin: 0;
            max-height:59vh;
            overflow: auto;
            .item-content{}
            .item-inner{
                .price{
                    text-align: right;
                    width: 4em;
                }
                .name{
                    flex: 1;
                }
                .act{
                    .icon{
                        //vertical-align: top;
                    }
                    b{
                        padding: 0 0.5em;
                    }
                }
            }
        }

        .bot-bar{
            margin-top: 1px;
            border-top: 1px solid @cl_bd_light;
            display: flex;
            text-align: center;
            align-items: stretch;
            .lineh(3*@page-edge);
            margin-bottom:-@page-edge;
            width: 100vw;
            margin-left:-@page-edge;
            .total-price{
                width: 61.8%;
            }

            .button{
                flex: 1;
                margin-top: -1px;
                height: auto;
            }

            .total-price,.button{
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }


</style>
