<template type="text/html" lang="jade" >
    f7-page(:class="name",@page:beforeanimation="beforeanimation")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 设置密码

        div.full-container
            f7-list.form.no-after-border.no-befer-border(form="")
                f7-list-item(:class="{v_error:$v.form.l_pwd.$error}")
                    f7-label 密码
                    f7-input(placeholder="密码长度需要大于5位",type="password",@click="$v.form.l_pwd.$touch()",v-model="form.l_pwd")
                f7-list-item(:class="{v_error:$v.form.l_pwd2.$error}")
                    f7-label 确认
                    f7-input(placeholder="请再次输入密码",type="password",@click="$v.form.l_pwd2.$touch()",v-model="form.l_pwd2",@keydown.13="go_next()")
                f7-list-item.btn-item.first
                    f7-button.reg-btn(fill,color="flat-green", @click="go_next()") 提交
</template>

<script type="text/ecmascript-6">


    var options = {
        register:{
            action:"account/regist"
        },
        change:{
            action:"account/forgetpwd"
        },
        attach:{
            action:"account/thirdPartRegist"
        }
    }

    import {required, minLength, between, sameAs} from 'vuelidate/lib/validators'

    export default {
        data () {
            return {
                name: "register-vue",
                form: {
                    l_phone: "",
                    l_safecode: "",
                    l_pwd: "",
                    l_pwd2: ""
                }
            }
        },

        validations: {
            form: {
                l_pwd: {
                    required,
                    minLength: minLength(6)
                },
                l_pwd2: {
                    sameAsPassword: sameAs("l_pwd")
                },
                l_phone: {
                    minLength: minLength(10),
                    required,
                },
                l_safecode: {
                    required,
                    minLength: minLength(4)
                }
            }
        },

        computed: {},

        methods: {
            go_next: function () {
                var m = this;
                if (m.$v.form.$invalid) {
                    if (m.$v.form.l_phone.$invalid) {
                        f7.alert("提示", "请重新输入手机号")
                        m.$router.back();
                        return;
                    }

                    if (m.$v.form.l_safecode.$invalid) {
                        f7.alert("提示", "验证码无效")
                        m.$router.back();
                        return;
                    }
                    m.$v.form.$touch();
                    return;
                }

                var opt;

                //debugger;

                var addition = {};
                if(/set-password-register/.test(m.$route.url)){
                    opt = options.register;
                }else if(/set-password-modify/.test(m.$route.url)){
                    opt = options.change;
                }else if(/set-password-attach/.test(m.$route.url)){
                    opt = options.attach;
                    var arr = m.$route.params.userinfo.split("[||]")
                    addition.type           =   arr[0];
                    addition.userId         =   arr[1];
                    addition.accessToken    =   arr[2];
                }


                m.req(opt.action, {
                    phone: m.form.l_phone,
                    password: m.form.l_pwd,
                    repassword: m.form.l_pwd2,
                    validcode: m.form.l_safecode,
                    ...addition,
                    noCache:true
                })
                    .then(
                        function (data) {
                            if(data.resCode) {
                                throw data.message;
                            }
                            if(data.token) {
                                m.routeTo(`/auto-login/${data.token}/`);
                            }else{
                                m.routeTo(`/login/${m.form.l_phone}`);
                            }

                            vars.toast(data.message);
                        }
                    )
                    .catch(function(err){
                        m.$router.back({animagePages:false});
                        f7.alert(err,"操作失败")
                    })
                ;
            },
            beforeanimation(){
                var m = this;
                m.form.l_phone = m.$route.params.phone;
                m.form.l_safecode = m.$route.params.safecode;
            }
        },

        mounted: function () {
            var m = this;


        }
    }
</script>

