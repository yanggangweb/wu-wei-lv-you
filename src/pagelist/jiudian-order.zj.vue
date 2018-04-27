<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 订单
            f7-nav-right
                f7-link(icon="i-iconziti17",open-panel="right")

        form
            f7-list.no-margin
                f7-list-item(divider="")
                f7-list-item {{_get(merchant,"data.name")}} / {{_get(product,"product.name")}}
                f7-list-item(divider="")
                f7-list-item.data-range-item()
                    date-range(@change="dataChange",:start="dateStart",:end="dateEnd")
                f7-list-item
                    .item-title.label 房间数
                    .item-input
                        numberic(:value="nameNumber",:min="1",:max="10",@change="numberChange")
                f7-list-item(v-for="(p,index) in nameList",:class="{v_error:p.name.trim().length<2}")
                    .item-title.label 姓名{{index+1}}
                    .item-input
                        input(type="text",placeholder="请输入姓名",v-model="p.name")
                f7-list-item(:class="{v_error:$v.order.phone.$error}")
                    .item-title.label 联系人手机
                    .item-input
                        input(type="text",placeholder="请输入手机号",v-model="order.phone")
                f7-list-item(:class="{v_error:$v.order.identityCard.$error}")
                    .item-title.label 身份证
                    .item-input
                        input(v-model="order.identityCard",type="text",placeholder="输入身份证号")
                f7-list-item
                    .item-title.label 房间保留至
                    .item-input
                        select
                            option(v-for="v in 24",:value="v+':00'") {{v+':00'}}

                f7-list-item(divider="")
                f7-list-item
                    .item-title.label 优惠券
                    .item-input
                        template(v-if="!couponList.length") 无优惠券可用
                        template(v-if="couponList.length")
                            select(v-model="order.couponId")
                                option(v-for="card in couponList",:value="card.id") {{card.name}}
                                option(value="") 不使用

                f7-list-item(divider="")

                f7-list-item
                    .item-title.label 特殊需求
                    .item-input
                        input(type="text",placeholder="无")

                f7-list-item(divider="")

                f7-list-item
                    .item-title.label 单价
                    .item-input ￥{{_get(product,"product.price")}}
                f7-list-item
                    .item-title.label 小计
                    .item-input ￥{{originTotalPrice}}
                f7-list-item
                    .item-title.label 优惠后价格
                    .item-input
                        | ￥{{realPrice}}
                        template(v-if="originTotalPrice-realPrice") (优惠了{{originTotalPrice-realPrice}})



            f7-button.submit-btn(fill,color="red",big,@click="submit") 提交




</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    import mo from "moment"



    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "jiudian-order",
                pid:"",
                mid:"",
                nameList:[{name:""}],

                merchant:{},
                product:{},

                couponList:[],

                dateStart:"",
                dateEnd:"",
                order:{
                    merchantId:"",
                    productId:"",
                    startdate:"",
                    enddate:"",
                    quantity:"",
                    identityCard:"",
                    //优惠卡id
                    couponId:"",
                    name:"",
//                    phone:"15991606171",
                    phone:"",
                    requirement:""
                }
            }
        },

        validations:{
            order:{
                phone:{
                    required,
                    withParams:vars.validator.phone
                },
                identityCard:{
                    required,
                    withParams:vars.validator.identify
                }
            },

        },

        computed: {
            originTotalPrice:function(){
                var m = this;
                var all = (m._get(m.product,"product.price")||0)*m.nameNumber;

                var day = mo(m.order.startdate).diff(mo(m.order.enddate),"day")

                day = Math.abs(day);

                return all*day;
            },

            realPrice:function(){
                var m = this;

                var cp = _.find(m.couponList,{id:m.order.couponId});
                if(!cp) return m.originTotalPrice;

                if(cp.type == 0) {
                    return ((m.originTotalPrice * cp.discountRate *100)>>0)/100 ;
                }else if(cp.type == 1){
                    return (m.originTotalPrice*100 - cp.discountedPrice*100)/100
                }
            },

            nameNumber:{
                get:function(){
                    var m = this;
                    return m.nameList.length;
                },
                set:function(v){
                    var m = this;
                    var rleng = m.nameList.length;

                    var d = v-rleng;
                    if(d>0) {
                        while(d--) {
                            m.nameList.push({name:""})
                        }
                    }else if(d<0){
                        var dd = Math.abs(d)
                        m.nameList.splice(rleng-dd-1,dd)
                    }

                    if(d!=0) {
                        m._calcCoupon();
                    }

                }
            }
        },

        methods: {
            dataChange:function(drange){
                var m = this;
                m.order.startdate = drange.start;
                m.order.enddate = drange.end;
            },
            submit:function(){
                var m = this;
                if (m.$v.order.$invalid) {
                    m.$v.order.$touch();
                    return;
                }

                var shortList = m.nameList.filter(el=>{
                    return el.name.trim().length<2
                })

                if(shortList.length) {
                    return ;
                }

                var order = _.merge({},m.order);
                order.totalPrice = m.realPrice;
                order.productPrice = m.originTotalPrice;
                order.noCache = true;
                order.startdate = order.startdate._d *1;
                order.enddate = order.enddate._d *1;
                m.req("order/save",order)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }

                        //data
                        vars.jiudian_order_cache.orderObject = data.order;


                        //todo:屏蔽支付功能
//                        return !function(){
//                            f7.mainView.back({animatePages:false});
//                            setTimeout(function(){
//                                f7.alert("恭喜,下单成功")
//                            },80)
//                        }();


                        m.routeTo(`/common-payment/${data.order.code}`)
                        //f7.alert("支付功能正在开发中","订单创建成功")
                    })
                    .catch(function(err){
                        vars.toast(vars.trimErrorMessage(err))
                        console.log(err,"订单提交失败")
                    })
                ;
            },
            numberChange:function(v){
                var m = this;
                m.nameNumber = v;
            },

            calcCoupon:function(){
                var m = this;
                var queryKey    = vars.varsionPrefix == ".tr"?"merchantId":"productId";
                var queryValue  = vars.varsionPrefix == ".tr"?m.order.merchantId:m.id;
                m.req("scoreexchange/ordercoupon",{
                    [queryKey]:queryValue,
                    totalPrice:m.originTotalPrice,
                    noCache:true
                })
                    .then(function(coupon){
                        if(coupon.resCode) {
                            throw coupon.message;
                        }

                        //拿到可用的优惠卡
                        m.couponList = coupon.list;

                        if(m.order.couponId=="0")   return;
                        if(_.findIndex(coupon.list,{id:m.order.couponId})==-1) {
                            m.order.couponId = _.get(coupon.list,"0.id")||"0";
                        }
                    })
                    .catch(function(err){
                        m.goBack(true);
                        console.log(err,"获取优惠卡失败");
                    })
                ;
            }
        },

        watch: {
            "nameList":{
                handler:function(v){
                    var m = this;
                    m.order.name = m.nameList.map(el=>el.name).join(",")
                    m.order.quantity = m.nameList.length;
                },
                deep: true
            }
        },

        mounted: function () {
            var m = this;
            m.pid = m.$route.params.pid;
            m.mid = m.$route.params.mid;

            m.order.startdate   =   mo(vars.jiudian_order_cache.dateIn      ||  vars.dateTody(),        vars.dateFormaterMoment)._d*1;
            m.order.enddate     =   mo(vars.jiudian_order_cache.dateOut     ||  vars.dateTomorrow(),    vars.dateFormaterMoment)._d*1;

            m.dateStart =     mo(m.order.startdate*1)
            m.dateEnd   =     mo(m.order.enddate*1)

            m.order.merchantId = m.mid;
            m.order.productId = m.pid;

            Promise.all([
                m.req("merchant/merchantdetail",{id:m.mid}),
                m.req("product/productdetail",{id:m.pid})
            ])
                .then(function([merch,product]){
                    if(merch.resCode) {
                        throw merch.message;
                    }
                    if(product.resCode) {
                        throw product.message;
                    }

                    m.merchant = merch;
                    m.product = product;


                    m.calcCoupon();

                })
                .catch(function(err){
                    f7.alert("订单信息获取失败："+err);
                })
            ;
            m._calcCoupon = _.debounce(function(){
                m.calcCoupon()
            },600)
        },

        components: {
            numberic:require("../components/numberic.vue"),
            dateRange:require("../components/dateRange.vue")
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";


    @name:jiudian-order;

    .toolClass();

    .@{name}{
        .data-range-item{
            .item-inner{
                justify-content: center;
            }
        }
        .page-content{
            background-color: #ffffff;
            .list-block{
                .item-content {
                    .numberic{
                        height: 28px;
                        align-items: stretch;
                        >a{
                            .padding_h(0.25em);
                            height: auto;
                            display: flex;
                            align-items: center;
                            text-align: center;
                            justify-content: center;
                        }
                        >input{
                            height: auto;
                            border: 1px solid @cl_bd_light;
                            margin-left: -1px;
                            margin-right: -1px;
                        }
                    }
                }
            }
        }

        .submit-btn{
            margin:@page-edge;
        }
    }



</style>
