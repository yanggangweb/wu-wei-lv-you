<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 修改地址
            f7-nav-right
                f7-button(@click="go_next()")  保存
        f7-list.full-container(form="")
            f7-list-item
                f7-label 联系人
                f7-input#consignee(type="text",:value="_get(address,'consignee')" )
            f7-list-item
                f7-label 手机号码
                f7-input#phone(type="text",:value="_get(address,'phone')")
            f7-list-item
                f7-link.tao-zhuan(@click="go_map")
                    div.add_height
                        b  选择地址
                        | {{form.region}}
                        a.right
                            i.icon.i-dingwei6
            f7-list-item
                f7-label 详细地址
                f7-input#detailAddress(type="text",:value="_get(address,'detailAddress')")
            f7-list-item
                f7-label 邮编
                f7-input#postalCode(type="text",:value="_get(address,'postalCode')")
</template>
<script type="text/ecmascript-6">
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    export default {
        data () {
            return {
                name: "alter-address",
                data:"",
                address:"",
                form:{
                    id:"_",
                    consignee:"",
                    phone:"",
                    region:"",
                    detailAddress: "",
                    postalCode: ""
                }
            }
        },
        computed: {
            user:function(){
                return this.$store.getters.user;
            }
        },
        methods: {
            init:function(){
                var m=this;
                m.req("addressmanage/get",{id: m.$route.params.id,noCache:true })
                    .then(function(data){
                        m.data=data;
                        m.address=data.address;
                        if(data.resCode) {
                            throw data.message;
                        }
                    })
                    .catch(function(err){
                        f7.alert(err,"数据加载失败")
                     })
                ;
            },
            go_next: function () {
                var m = this;
                m.id=m.$route.params.id;
                var consignee = $("#consignee").val();
                var phone = $("#phone").val();
                var region = $("#region").val();
                var detailAddress = $("#detailAddress").val();
                var postalCode = $("#postalCode").val();

                var para ={
                    id:m.id,
                    consignee: consignee,
                    phone: phone,
                    region:region,
                    detailAddress: detailAddress,
                    postalCode: postalCode,
                    noCache:true
                };
                m.req("addressmanage/saveorupdate",para, {
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        vars.root.$emit("comment-fresh",{
                            id:m.id,
                            consignee: consignee,
                            phone: phone,
                            region:region,
                            detailAddress: detailAddress,
                            postalCode: postalCode,
                            noCache:true
                        })
                        f7.alert("地址修改成功");
//                        history.back();
//                        m.__routerBack();
                          m.routeTo(`/personal-address/${m.aid}/`)

                    })
                    .catch(function(err){
                        f7.alert(err,"提交失败")
                    })
                ;
            },
            go_map:function () {
                var m = this;
               m.routeTo(`/map-address/`)

            }
        },
        mounted: function () {
            var m = this;
            m.init();
            m.aid = m.$route.params.aid;

            m._on_poi_got = function({poi}){
                console.log(poi.region)
                m.form.region =poi.cityname + poi.adname + poi.address;

            }
            vars.root.$on("pio-choosed",m._on_poi_got)
        },
        //实例被销毁之前
        beforeDestroy: function () {
            var m = this
            vars.root.$off("pio-choosed",m._on_poi_got)

        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .navbar{
            .button{
              background-color:transparent;
                border: none;
                color: @cl_flat_greenn1;
                font-size: 1rem;
        }
    }
    .alter-address{
        .list-block {
            align-items: center;
            margin: @page-edge 0;
            .item-inner:after{
                width: 95%;
            }
            .tao-zhuan {
                display: block;
                width: 100%;
                align-items: center;
                .add_height{
                    height: 2rem;
                    line-height: 2rem;
                    color: #000;
                    b{
                        width: 37%;
                        display: inline-flex;
                    }
                }
                .right{
                    float: right;
                    align-items: center;
                    color:@cl_flat_red1;
                }
            }
        }
    }
</style>
