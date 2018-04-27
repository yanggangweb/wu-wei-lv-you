<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 设置
        f7-list
            f7-link(href="/my-guanyu/")
                f7-list-item 关于金丝峡旅游
        f7-list
            f7-link
                f7-list-item
                    P
                        |推送通知
                    .change
                        input.switch.switch-anim(@change="togglejpush(jpushVisible)",type="checkbox", v-model="jpushVisible",)
        f7-list
            f7-link(href="/my-bangzhu/")
                f7-list-item 帮助和反馈
        f7-list
            f7-link(href="/my-shengming/")
                f7-list-item 隐私声明
        f7-block
            f7-button(big,color="red",fill="",@click="showcontent") 退出登录
        picker.prompting-logout(ref="shopCard" ,title="提示")
            h3 退出账号登录吗？
            .prompting-button
                f7-button(fill="",color="gray",@click="cancel") 取消
                f7-button(fill="",color="red",@click="logout") 确定

</template>

<script type="text/ecmascript-6">

    export default {
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-shezhi",
                null_img: vars.null_img,
                data: {},
                jpushVisible:true,
            }
        },
        methods: {
            init: function () {
                var m=this;
                var localStorage = window.localStorage;
                if(localStorage.jpushToggle=="false"){

                    m.jpushVisible=false;
                    console.log("初始开关"+m.jpushVisible);
                    localStorage.removeItem("jpushToggle");
                    localStorage.setItem("jpushToggle","false") ;
                    console.log(localStorage.jpushToggle)
                }else {
                    m.jpushVisible=true;
                    console.log("初始开关"+m.jpushVisible);
                }

            },
            logout:function(){
                var m =this;

                m.routeTo("/home/")
                vars.store.commit("clearUserTooken");
                m.$refs.shopCard.hide();

                setTimeout($=>{
                    m.goback(true);
                    m.goback(true);
                })

            },
            cancel:function () {
                var m =this;
                m.$refs.shopCard.hide();
            },
            showcontent:function () {
                var m=this;
                m.$refs.shopCard.show();
            },
            togglejpush:function () {
                var m=this;
                var localStorage = window.localStorage;
                localStorage.removeItem('jpushToggle');
                var localjpush=m.jpushVisible;

                if (m.jpushVisible==false) {
                    var localStorage = window.localStorage;
                    console.log("开关"+m.jpushVisible);
                    localStorage.removeItem("jpushToggle");
                    localStorage.setItem("jpushToggle","false") ;
                    console.log(localStorage.jpushToggle)

                }else if(m.jpushVisible==true){
                    localStorage.removeItem("jpushToggle");
                    console.log("开关"+m.jpushVisible);
                }
            }
        },
        mounted: function () {
            var m = this;
            m.init();
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-shezhi{
        .comment-list {
            h3 {
                height: 30px;
            }
        }
        .list-block {
            font-size: 17px;
            list-style: none;
            margin: 0;
            background-color: #fff;
            border-bottom:1px solid #c8c7cc;
            .switch {
                width: 3rem;
                height: 1.6rem;
                position: relative;
                background-color: #fdfdfd;
                box-shadow: #dfdfdf 0 0 0 0 inset;
                border-radius:0.8rem;
                background-clip: content-box;
                display: inline-block;
                -webkit-appearance: none;
                user-select: none;
                outline: none;
                margin: 0;
                &:before {
                    content: '';
                    width: 1.6rem;
                    height: 1.6rem;
                    position: absolute;
                    top: 0px;
                    left: 0;
                    border-radius: 0.8rem;
                    background-color: #fff;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
                }
                &:checked {
                    border-color: @cl_flat_greenn1;
                    box-shadow: @cl_flat_greenn1 0 0 0 16px inset;
                    background-color: @cl_flat_greenn1;
                }
                &:checked:before {
                    left: 1.6rem;
                }
                .switch-animbg {
                    transition: background-color ease 0.4s;
                    &:before {
                        transition: left 0.3s;
                    }
                    &:checked {
                        box-shadow: #dfdfdf 0 0 0 0 inset;
                        background-color: @cl_flat_greenn1;
                        transition: border-color 0.4s, background-color ease 0.4s;
                    }
                    &:checked:before {
                        transition: left 0.3s;
                    }
                }
                .switch-anim{
                    transition: border cubic-bezier(0, 0, 0, 1) 0.4s,
                    box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
                    &:before {
                        transition: left 0.3s;
                    }
                    &:checked {
                        box-shadow: @cl_flat_greenn1 0 0 0 16px inset;
                        background-color: @cl_flat_greenn1;
                        transition: border ease 0.4s, box-shadow ease 0.4s,
                        background-color ease 1.2s;
                    }
                    &:checked:before {
                        transition: left 0.3s;
                    }
                    display: none;
                }
            }
        }


    }
    .prompting-logout{
        h4{
            text-align: center;
            i{
                display: none;
            }
        }
        h3{
            margin: @page-edge;

        }
        .prompting-button{
            display: flex;
            justify-content: space-around;
            .button{
                padding:  0 @page-edge*1.5;
            }
        }
    }


</style>




