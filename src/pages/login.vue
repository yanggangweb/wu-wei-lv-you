<template type="text/jade" lang=jade>
    .login_page
        h3.app-name 牛人服务
            sup  bate

        .cont
            mu-text-field(label="用户名",:labelFloat="true", icon=":i-wodejuhuasuan",:fullWidth="true",v-model="loginInfo.username",:errorText="err_tx_uname")
            mu-text-field(label="密码",:labelFloat="true" ,type="password", icon=":i-suo",:fullWidth="true",v-model="loginInfo.password",:errorText="err_tx_pwd")
            .safcecode
                span
                    mu-text-field(label="验证码",:labelFloat="true" ,type="password", icon=":i-tishi",:fullWidth="true",v-model="loginInfo.validateCode")
                span
                    i.img
                        img(src="../assets/safecode.jpg")


            .v-gutter

            .row
                .col.btn-login
                    mu-raised-button(label="登录",:primary="true", :fullWidth="true", @click="login()")
                .col.btn-reg
                    mu-raised-button(label="注册",:secondary="true", :fullWidth="true")


</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {
                submited: false,
                loginInfo: {
                    username: "niuren01",
                    password: "admin",
                    validateCode: "9855"
                }
            }
        },
        methods: {
            login: function () {
                var m = this;
                m.submited = true;

                if (!m.loginInfo.username) {
                    return;
                }

                if (!m.loginInfo.password) {
                    return;
                }

                m.request("/a/login", m.loginInfo).then(function (data) {
                    let tooken = data.data;
                    if (!tooken) {
                        alert("用户名或者密码错误");
                        return;
                    }
                    m.$store.commit("saveUserTooken", tooken);
                    m.$router.push("home");
                }, function (err) {
                    m.$router.push("home");
                    console.error("用户名或者密码错误");
                    // alert("用户名或者密码错误");
                })
            }
        },

        computed: {
            err_tx_uname(){
                var m = this;
                if (!m.submited) return "";
                if (!m.loginInfo.username) {
                    return "请输入用户名"
                }

                return ""
            },

            err_tx_pwd(){
                var m = this;
                if (!m.submited) return "";
                if (!m.loginInfo.password) {
                    return "请输入密码"
                }

                return ""
            }
        },

        watcher: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    @import "../styles/vars.less";

    .toolClass;
    .login_page{
        text-align: center;
        padding-top: 15vh;

        .app-name{
            font-weight: 100;
            font-size: 3rem;
            margin-bottom: 3rem;
            color: @primaryColor;

            sup{
                color: @secondaryTextColor;
                font-size: 1rem;
                position: relative;
                top: -1rem;
            }
        }

        .cont{
            @s:3rem;
            margin-left:@s;
            margin-right:@s;
            /*width: 60vw;*/
            @pr:56px;

            .row{
                display: flex;
                .col{
                    box-sizing: border-box;
                }
                .btn-login{
                    flex: 3;
                    padding-right: @g;
                    padding-left:@pr;
                }
                .btn-reg{
                    flex: 1;
                    padding-left: @g;
                    //padding-right:@g;
                }
            }


        }

        .mu-text-field{
            /*width: auto;*/
        }
        .mu-text-field-label{
            font-weight: 100;
            /*font-size: 1.5rem;*/
        }

        .safcecode{
            display: flex;
            span{
                &:nth-child(1){
                    flex: 1;
                }
                &:nth-child(2){
                    width: 9rem;
                    position: relative;
                    .img{
                        position: absolute;
                        top: 20px;
                        left: 1rem;
                        bottom: 20px;
                        right: 0;
                    }
                    img{
                        display: block;
                        position: absolute;
                        &:extend(.expandin);
                    }
                }
            }
        }
    }

</style>
