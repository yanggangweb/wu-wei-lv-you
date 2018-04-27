<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 我要报名
        f7-list.no-margin(form="")
            f7-list-item.radio
                .title.label 性别
                f7-list-item(name="my-radio",v-model="form.gender",radio,@click="form.gender=0",checked) 男
                f7-list-item(name="my-radio",v-model="form.gender",radio,@click="form.gender=1",) 女
            f7-list-item(:class="{v_error:$v.form.name.$error}")
                f7-label 姓名
                f7-input(type="text",placeholder="请输入姓名",v-model="form.name",@click="$v.form.name.$touch()")
            f7-list-item(:class="{v_error:$v.form.mobile.$error}")
                f7-label 联系人手机
                f7-input(type="text",placeholder="请输入手机号",v-model="form.mobile",@click="$v.form.mobile.$touch()")
            f7-list-item.xian(:class="{v_error:$v.form.organization.$error}")
                f7-label 院校/单位
                f7-input(type="text",placeholder="请输入院校",v-model="form.organization",@click="$v.form.organization.$touch()")
            f7-button.submit-btn(fill,color="red",big,@click="go_next") 提交


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
                name: "huodong-bao",
                data: "",
                form: {
                    activityId: "",
                    accountId: "",
                    name: "",
                    mobile: "",
                    gender: "",
                    organization: ""
                }
            }
        },
        validations: {
            form: {
                name: {
                    required,
                    minLength: minLength(2)
                },
                mobile: {
                    required,
                    minLength: vars.validator.phone
                },
                organization: {
                    required,
                    minLength: minLength(2)
                },
            }

        },
        methods: {
            go_next: function () {
                var m = this;

                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                    return;
                }
                var para = {
                    activityId: m.id,
                    gender: m.form.gender,
                    name: m.form.name,
                    mobile: m.form.mobile,
                    organization: m.form.organization,
                }
                m.req("activity/registration", para)
                    .then(function (data) {
                        if (data.resCode) {
                            f7.alert(data.message, "信息提示")
                            //throw data.message;
                            return
                        }
                        f7.alert("提交成功");
                        history.back();

                    })
                    .catch(function (err) {
                        f7.alert(err, "信息提示")
                    })
                ;
            },
        },
        mounted: function () {
            var m = this;
            m.id = m.$route.params.id;
            m.req("activity/detail", {id: m.id})
                .then(function (data) {
                    if (data.resCode) {
                        throw data.message;
                    }
                })
            ;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    @name: huodong-bao;

    .toolClass();

    .@{name} {
        .page-content {
            background-color: #ffffff;
            .list-block {

                .item-content {
                    .numberic {
                        height: 28px;
                        align-items: stretch;
                        > a {
                            .padding_h(0.25em);
                            height: auto;
                            display: flex;
                            align-items: center;
                            text-align: center;
                            justify-content: center;
                        }
                        > input {
                            height: auto;
                            border: 1px solid @cl_bd_light;
                            margin-left: -1px;
                            margin-right: -1px;
                        }
                    }
                }
            }
        }
        .list-block {
            .radio {
                box-sizing: border-box;
                position: relative;
                background-color: #fff;
                align-items: center;
                display: flex;
                .title{
                    width: 35%;
                }
                .item-content{
                    width: 100%;
                    li{
                        flex: 2;
                    }
                }
                 .item-inner {
                    .item-inner {
                        &:after {
                            background-color: #fff;
                        }
                    }
                }
            }
        }
        .list-block {
            .xian {
                .item-inner:after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    right: auto;
                    top: auto;
                    height: 3px;
                    width: 100%;
                    display: block;
                    z-index: 15;
                    -webkit-transform-origin: 50% 100%;
                    transform-origin: 50% 100%;
                }
            }
        }

        .submit-btn {
            margin: @page-edge;
        }
    }


</style>
