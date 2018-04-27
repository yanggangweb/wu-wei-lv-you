<template type="text/jade" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",@click="cancelLogin()")
            f7-nav-center 登录
        div.full-container()
            f7-list.form.no-after-border.no-befer-border(form="")
                f7-list-item(:class="{v_error:$v.login.l_phone.$error}")
                    f7-label.floating-label 手机号
                    f7-input(placeholder="请输入手机号",type="number",v-model.trim="login.l_phone",@input="$v.login.$touch()")
                f7-list-item(:class="{v_error:$v.login.l_pwd.$error}")
                    f7-label 密　码
                    f7-input(placeholder="请输入您的密码",type="password",v-model.trim="login.l_pwd",@keydown.13="doLogin()")
                f7-list-item.btn-item.no-after-border.first
                    f7-button.login-btn(fill="",color="flat-green",@click="doLogin()") 登录
                f7-list-item.no-after-border.link-btn-cont
                    .flex.bw.full-width
                        span
                            |   没有账号
                            f7-link(color="",href="/register/") 注册
                            |   一个

                        f7-link(color="",:href="'/lost-password/'+ login.l_phone") 忘记密码

            f7-grid.other-method-login()
                f7-col.title(width="100") 第三方登录
                f7-col
                    f7-link(icon="sns-weibo i-iconfontweibowukuang",@click="snsLogin('weibo')")
                f7-col
                    f7-link(icon="sns-weixin i-weixin",@click="snsLogin('weixin')")
                f7-col
                    f7-link(icon="sns-qq i-QQ",@click="snsLogin('qq')")

</template>

<script type="text/ecmascript-6">
    import defaut_img from "../assets/default.jpg";

    import dataAnalytical from "../dataAnalytical";


    import {required, minLength, between} from 'vuelidate/lib/validators'

    var noCache = true;
    export default {
        data () {
            return {
                name: "login-vue",
                login: {

//                    l_phone: "15891767724",
//                    l_pwd: "123456",
                    l_phone: "",
                    l_pwd: ""
                }
            }
        },

        validations: {
            login: {
                l_phone: {
                    required,
                    withParams:vars.validator.phone
                },
                l_pwd: {
                    required,
                    minLength: minLength(4)
                }
            }
        },

        computed: {},

        methods: {

            /*
            * sns登录
            * */
            snsLogin:function(snsType){
                var m = this;
                if(snsType == "weixin") {
                    vars.callbackToPromise.call(Wechat.isInstalled)
                        .catch(function(err){
                            f7.alert("微信客户端未安装");
                            vars.stopPromiseChian();
                        })
                        .then(function(){
                            return vars.callbackToPromise.call(Wechat.auth,"snsapi_userinfo", "_" +new Date()*1)
                        })
                        .catch(function(err){
                            vars.stopPromiseChian();
                        })
                        .then(function(response){
                            return m.req(`https://api.weixin.qq.com/sns/oauth2/access_token::GET`,{
                                appid:"wx6431b4d3755546aa",
                                secret:"a455555501b0698e95d2491611288996",
                                code:response.code,
                                grant_type:"authorization_code",
                                noCache
                            })
                        })
                        .then(function(ret){
                            m.verifyThirdAccount(1,ret.openid,ret.access_token);
                        })
                        .catch(function(reason){
                            //授权失败，或者取消
                            vars.toast(vars.trimErrorMessage(reason))
                        })
                    ;
                }else if(snsType == "qq") {
                    vars.callbackToPromise.call(
                        QQSDK.checkClientInstalled,
                        "|",
                        {client:QQSDK.ClientType.QQ}
                    )
                        .catch(function(err){
                            f7.alert("QQ客户端未安装");
                            console.log("QQ客户端未安装",err)
                            vars.stopPromiseChian();
                        })
                        .then(function(){
                            return vars.callbackToPromise.call(
                                QQSDK.ssoLogin,
                                "|",
                                {client:QQSDK.ClientType.QQ}
                            )
                        })
                        .catch(function(){
                            vars.stopPromiseChian();
                        })
                        .then(function(data){
                            //return m.req('https://graph.qq.com/user/get_user_info?access_token=' + data.access_token + '&oauth_consumer_key=1106223859&openid=' + data.userid + "::get",{})
                            m.verifyThirdAccount(0,data.userid,data.access_token)
                        })
                    ;

                }else if(snsType == "weibo") {
                    vars.callbackToPromise.call(WeiboSDK.checkClientInstalled)
                        .catch(function(){
                            f7.alert("微博客户端未安装");
                            vars.stopPromiseChian();
                        })
                        .then(function(){
                            return vars.callbackToPromise.call(WeiboSDK.ssoLogin)
                        })
                        .catch(function(err){
                            vars.stopPromiseChian();
                        })
                        .then(function(ret){
                            m.verifyThirdAccount(2,ret.userId,ret.access_token);
                        })
                    ;
                }
            },


            verifyThirdAccount:function(type,userId,accessToken){
                var m = this;
                return m.req(
                    `account/thirdPartLogin`,
                    {type,userId,accessToken,noCache, uuid:m.deviceUuid}
                )
                    .then(function(data){
                        if(data.resCode) {
                            vars.toast(data.message)
                            return;
                        }

                        if(data.state == -1) {
                            m.routeToMethod2(`/attach-phone/${type}[||]${userId}[||]${accessToken}`,m.getView("loginView"))
                        }else if(data.token){
                            m.tokenHandler(data.token);
                        }
                    })

            },

            doLogin(){
                var m = this;

                if (m.$v.login.$invalid) {
                    m.$v.login.$touch();
                    return;
                }



                m.req("account/login", {
                    phone: m.login.l_phone,
                    password: m.login.l_pwd,
                    uuid:m.deviceUuid,
                    noCache:true
                })
                    //拿到token
                    .then(
                        function (data) {
                            if(data.resCode!==0) {
                                throw data.message
                            }
                            var token = m._get(data,"token")
                            if(!token) throw "获取token失败!"

                            return m.tokenHandler(token);
                        }
                    //拿到用户信息
                    )
                    .catch(function(err){
                        vars.toast(err);
//                        f7.alert(err,"登录失败");
                    })
                ;//end of m.req
            },

            tokenHandler:function(token){
                var m = this;

                //保存token
                vars.store.commit("saveUserTooken",token);
                return m.req("account/accountinfo",{noCache:true})
                    .then(function(data){
                        if(data.resCode!==0) {
                            throw data.message;
                        }
                        //保存用户
                        vars.store.commit("saveUser",data.account);

                        //登录动作完成并且成功
                        vars.store.state.loginPromise.resolve(data.account);
                        m.closeLogin();

                        vars.toast("登录成功");

                        dataAnalytical.start();
                    })
                ;

            },


            /**
             * 取消登录
             */
            cancelLogin: function () {
                var m = this;
                if(vars.store.state.loginPromise)
                    vars.store.state.loginPromise.reject("用户取消登录");
                m.closeLogin();
            }
        },

        mounted: function () {
            var m = this;
            m.login.l_phone = m.got("$route.params.phone","");
            var token = m.got("$route.params.token");
            if(token) {
                m.tokenHandler(token);
            }



            dataAnalytical.getData()
                .then(device=>{
                    m.deviceUuid = device.uuid
                }).catch(err=>{
                    m.deviceUuid = "";

                console.log(vars.trimErrorMessage(err));
                })
            ;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    .toolClass();
    .login-vue{

        &.page{
            background-color: #ffffff;
            &:extend(.__icon);
            //background-image: url(../assets/bg-login.jpg);
            .page-content{
                padding-top: 0;
                //color: #ffffff;

            }
        }

        .full-container{
            /*position: relative;*/
            /*top: 40%;*/
            /*transform: translate(0,-50%);*/
            padding-top: 8vh;

            display: none;
            .modal-in &{
                display: block;
            }
        }

        .form{
            margin: 3em;



            >ul>li{
                .item-content{
                    padding-left: 0;
                    input{
                        //color: @cl_bd_light;
                    }
                    .item-inner{
                        justify-content:center;
                        padding-top:@page-edge*2;
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
                                //padding-top:@page-edge*2;
                            }
                        }
                    }
                }

                &.link-btn-cont{
                    .item-content{
                        .item-inner{
                            padding-top: @page-edge*2;
                            padding-right: 0;
                            font-size: 0.8rem;
                            justify-content: flex-end;

                            a{
                                text-decoration: underline;
                                color: @cl_flat_red;
                            }
                        }
                    }
                }
            }


            .button{
                flex: 1;
                &.login-btn{
                    margin-top: 2em;
                    //width: 60%;
                    //margin-left:@page-edge;
                }
                &.reg-btn{
                    //flex: 1;
                }
            }
            >ul{
                background-color: transparent;
            }
            .label{
                &.item-title{
                    width: 24%;
                }
            }
        }

        .other-method-login{
            >div{
                background-color: transparent;
            }
            margin:@page-edge @page-edge*5;
            text-align: center;
            >*{
                padding-top: 1rem;
                background-color: #f0f0f0;
            }
            .icon{
                font-size: 3.6em;
                //color: @cl_flat_light;
            }
        }
    }

</style>
