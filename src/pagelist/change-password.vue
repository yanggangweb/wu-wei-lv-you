<template type="text/html" lang="jade" >
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 修改密码
        f7-list.form.no-after-border.no-befer-border(form="")
            f7-list-item(:class="{v_error:$v.form.pwd.$error}")
                f7-label 原密码
                f7-input(placeholder="请输入原密码",type="password",@click="$v.form.pwd.$touch()",v-model="form.pwd")
            f7-list-item(:class="{v_error:$v.form.newpwd.$error}")
                f7-label 新密码
                f7-input(placeholder="请输入新密码",type="password",@click="$v.form.newpwd.$touch()",v-model="form.newpwd")
            f7-list-item(:class="{v_error:$v.form.newpwd_2.$error}")
                f7-label 新密码
                f7-input(placeholder="请再次输入新密码",type="password",@click="$v.form.newpwd_2.$touch()",v-model="form.newpwd_2")
            f7-list-item.btn-item.first
                f7-button.reg-btn(fill="",color="red", @click="go_next()") 提交
</template>

<script type="text/ecmascript-6">
    import {required, minLength, between, sameAs} from 'vuelidate/lib/validators'

    export default {
        data () {
            return {
                name: "change-paddword",
                form: {
                    pwd: "",
                    newpwd: "",
                    newpwd_2:""
                }
            }
        },

        validations: {
            form: {
                pwd: {
                    minLength: minLength(6)
                },
                newpwd: {
                    required,
                    minLength: minLength(6)
                },
                newpwd_2: {
                    sameAsPassword: sameAs("newpwd")
                },

            }
        },

        computed: {},

        methods: {
            go_next: function () {
                var m = this;
                if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                }
                m.req("account/updatepwd", {
                    oldpassword: m.form.pwd,
                    password: m.form.newpwd,
                    repassword: m.form.newpwd_2,
                    noCache:true
                })
                    .then(
                        function (data) {
                            if(data.resCode) {
                                throw data.message;
                            }
                            f7.alert("提交成功");
                            history.back();
                        }
                    )
                    .catch(function(err){
                        f7.alert(err,"注册失败")
                    })
                ;
            },
        },

        mounted: function () {
            var m=this;
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .change-paddword{
        .page-content{
            background-color: #fff;
            .form{
                margin:0 2em;
                >ul>li{
                    .item-content{
                        .button{
                            flex: 1;
                        }
                        .label{
                            &.item-title{
                                width: 3.5em;
                            }
                        }
                        padding-left: 0;
                        .item-inner{
                            justify-content:center;
                            padding-top:@page-edge*2;

                            input{
                                color: @cl_flat_light;
                            }
                        }
                    }
                    &.btn-item{
                        .item-content{
                            .item-inner{
                                padding-right: 0;
                                padding-top:@page-edge/2;
                            }
                        }
                        &.first{
                            .item-content{
                                .item-inner{
                                    padding-top:@page-edge*2;
                                }
                            }
                        }
                    }



                    &.item-yanzhengma{
                        .item-content{
                            align-items: flex-end;
                        }
                        .item-inner{
                            padding-right: 0;
                        }
                        .btn-cont{
                            font-size: 0.8rem;
                            margin-left: @page-edge;
                            //text-align: right;
                            //width: 9em;
                        }
                    }
                }
                >ul{
                    background-color: transparent;
                }
            }
        }

    }
</style>

