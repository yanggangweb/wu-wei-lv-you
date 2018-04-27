<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="",@click="back")
            f7-nav-center {{page_title}}

        div.full-container
            f7-list.form.no-after-border.no-befer-border(form="")
                f7-list-item(:class="{v_error:$v.form.l_phone.$error}")
                    f7-label 手机号
                    f7-input(placeholder="请填写真实手机号",type="number",v-model.trim="form.l_phone",@click="$v.form.l_phone.$touch()")
                f7-list-item.item-yanzhengma(:class="{v_error:$v.form.l_safecode.$error}")
                    f7-label 验证码
                    f7-input(placeholder="输入验证码",type="text", v-model.trim="form.l_safecode",@click="$v.form.l_safecode.$touch()",@keydown.13="go_next()")
                    span.btn-cont(slot="content")
                        f7-button(fill="",color="flat-green", @click="getSafecode") {{daojishi==0?"获取验证码":daojishi}}
                f7-list-item.btn-item.first
                    f7-button.reg-btn(fill="",color="flat-green",@click="go_next()") 下一步



</template>

<script type="text/ecmascript-6">
    import {required, minLength, between} from 'vuelidate/lib/validators'

    import {phone} from "../libs/validators.js"

    var daojishi=  60;

    export default {
        mixins: [vars.mixin_1],
        data () {
            return {
                name: "register-vue",
                form: {
                    l_phone: "",
                    l_safecode: "",
                },

                page_title: "",

                //倒计时计数
                daojishi:0,

                //倒计时计时器
                djs_interval:0
            }
        },

        validations: {
            form: {
                l_phone: {
                    required,
                    phone
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
                    m.$v.form.$touch();
                    return;
                }


                m.req("account/valid",{phone:m.form.l_phone,validcode:m.form.l_safecode})
                    .then(function(resp){


                        if(resp.resCode == 10) {
                            throw resp.message;
                        }
                        //注册
                        if(/register/.test(m.$route.url)){

                            if(resp.resCode) {
                                throw resp.message
                            }

                            m.routeTo(`/set-password-register/${m.form.l_phone}/${m.form.l_safecode}/`)
                        //忘记密码
                        }else if(/lost-password/.test(m.$route.url)){
                            if(!resp.resCode) {
                                throw "手机号码尚未注册"
                            }
                            m.routeTo(`/set-password-modify/${m.form.l_phone}/${m.form.l_safecode}/`)
                        //第三方登录绑定手机
                        }else if(/attach-phone/.test(m.$route.url)) {
                            if(resp.resCode) {
                                throw resp.message
                            }
                            m.routeTo(`/set-password-attach/${m.form.l_phone}/${m.form.l_safecode}/${m.$route.params.userinfo}/`)
                        }

                    })
                    .catch(function(msg){
                        vars.toast(msg.message||msg);
                    })
                ;


            },

            getSafecode:function(){
                var m = this;

                if(m.daojishi!=0) {
                    return;
                }

                m.form.l_safecode = "";

                if(m.$v.form.l_phone.$invalid) {
                    f7.alert("手机号码无效或者未输入")
                    m.$v.form.l_phone.$touch()
                    return;
                }

                m.start_daojishi();
                m.req(
                    "account/validcode",
                    {phone:m.form.l_phone,noCache:true}
                )
                    .then(function (data) {
                        if(data.resCode) {
                            throw data.message;
                        }
                        //m.reset_daojishi();
                    })
                    .catch(function(err){
                        f7.alert(err,"验证码获取失败");
                        m.reset_daojishi();
                    })
            },

            start_daojishi:function(){
                var m = this;
                m.daojishi = daojishi;

                m.djs_interval = setInterval(function(){
                    m.daojishi --;
                    if(m.daojishi <= 0) {
                        m.reset_daojishi();
                        m.$emit("djs-complete")
                    }
                },1000)
            },

            reset_daojishi:function(){
                var m = this;
                if(m.djs_interval) {
                    clearInterval(m.djs_interval)
                }

                m.daojishi = 0;
            },

            back:function(){
                var m = this;
                m.reset_daojishi();
            }
        },

        mounted: function () {
            var m = this;
            var r = m.$route;

            //注册
            if (/^\/register/.test(r.url)) {
                m.page_title = "注册";
            //忘记密码
            }else if(/^\/lost-password/.test(r.url)){
                m.page_title = "忘记密码";
                m.form.l_phone = r.params.phone;
            }else if(/^\/attach-phone/.test(r.url)) {
                m.page_title = "绑定手机";
            }
        }
    }
</script>

<style lang=less rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .register-vue{
        &.page{
            background-color: #ffffff;
            &:extend(.__icon);
            .page-content{
                padding-top: 0;
            }
        }

        .full-container{
            padding-top: 20vh;
        }

        .form{
            margin: 2em;
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
                            //color: @cl_flat_light;
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
                color: @cl_flat_light;
            }
        }
    }
</style>
