<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center  新增地址
            f7-nav-right
                f7-button(@click="go_next()")  保存
        f7-list.form.no-after-border.no-befer-border(form="")
            f7-list-item(:class="{v_error:$v.form.consignee.$error}")
                f7-label 联系人
                f7-input(type="text",v-model.trim="form.consignee",@click="$v.form.consignee.$touch()")
            f7-list-item(:class="{v_error:$v.form.phone.$error}")
                f7-label 手机号码
                f7-input(type="text",v-model.trim="form.phone",@click="$v.form.phone.$touch()")
            f7-list-item(:class="{v_error:$v.form.detailAddress.$error}")
                f7-label 详细地址
                f7-input(type="text",v-model.trim="form.detailAddress",@click="$v.form.detailAddress.$touch()")
            f7-list-item(:class="{v_error:$v.form.postalCode.$error}")
                f7-label 邮编
                f7-input(type="text",v-model.trim="form.postalCode",@click="$v.form.postalCode.$touch()" )
            f7-list-item
                f7-link.tao-zhuan(href="/map-address/")
                    div.add_height 选择地址  {{form.region}}
                        a.right
                            i.icon.i-dingwei6
</template>
<script type="text/ecmascript-6">
    import {required, minLength, between} from 'vuelidate/lib/validators'
    export default {
        data () {
            return {
                name: "add-address",
                paramsFlag:"",
                form: {
                    consignee:"",
                    phone:"",
                    detailAddress:"",
                    postalCode: "",
                    region:""
                },
                poi:""
            }
        },
        validations: {
            form:{
                consignee: {
                    required,
                    minLength: minLength(2)
                },
                phone: {
                    required,
                    withParams:vars.validator.phone
                },
                detailAddress: {
                    required,
                    minLength: minLength(2)
                },
                postalCode: {
                    required,
                    minLength: minLength(6)
                }
            }

        },
        computed: {},

        methods: {
            go_next: function () {
                var m = this;
                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                   return;
                }
                var para = {
                    consignee: m.form.consignee,
                    phone: m.form.phone,
                    region: m.form.region,
                    detailAddress: m.form.detailAddress,
                    postalCode: m.form.postalCode,
                    noCache:true
                }
                m.req("addressmanage/saveorupdate", para)
                    .then(function (data) {

                        if (data.resCode) {
                            throw data.message;
                        }

                        if(m.paramsFlag == "back") {
                            m.goback();
                            m.$root.$emit("address-add",para)
                        }else{
                            m.routeTo(`/personal-address/${m.id}/`)
                        }
                        vars.toast("地址添加成功");

                    })
                    .catch(function (err) {
                        m.$router.back();
                        f7.alert(err, "添加失败")
                    })
                ;
                vars.root.$emit("comment-fresh",{
                    consignee: m.form.consignee,
                    phone: m.form.phone,
                    region: m.form.region,
                    detailAddress: m.form.detailAddress,
                    postalCode: m.form.postalCode,
                    noCache:true
                });

            }
        },

        mounted: function () {
            var m = this;
            m.id=   m.$route.params.id;


            m.paramsFlag = m.$route.params.flag;

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
    .navbar {
        .button {
            background-color: transparent;
            border: none;
            color: @cl_flat_greenn1;
            font-size: 1rem;
        }
    }

    .add-address {
        .list-block {
            align-items: center;
            margin: @page-edge 0;
            .item-inner:after {
                width: 95%;
            }
            .tao-zhuan {
                display: block;
                width: 100%;
                align-items: center;
                .add_height {
                    height: 2rem;
                    line-height: 2rem;
                }
                .right {
                    float: right;
                    align-items: center;
                    color: @cl_flat_red1;
                }
            }
        }
    }
</style>
