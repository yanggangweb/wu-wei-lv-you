<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 推送消息
        f7-block
            f7-list(media-list)
                f7-list-item
                    .change
                        label.dan-mu
                            input.switch.switch-anim(@change="togglejpush(jpushVisible)",type="checkbox", v-model="jpushVisible",)
                        span 推送


</template>

<script type="text/ecmascript-6">
    import _ from "lodash";

    export default {
        data: function () {

            return {
                name: "my-tuisong",
                null_img: vars.null_img,
                data: {},
                jpushVisible:true,

            }
        },
        methods: {
            //界面初始化
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

    .my-tuisong{
        .content-block {
            padding: 0 30px;
            .change{
                display: flex;
                align-items: center;
                .dan-mu{
                    flex: 1;
                }
            }
        }
        .text{text-indent:2em}
        .page-content{
            background-color: #fff;
            h3{
                color: #000;
                line-height: 2rem;
                text-align: left;
                font-size: 0.7rem;
            }
            h4{
                text-align: left;
                line-height:1.4rem;
                font-size: 0.6rem;
                color:#444;
            }
            p{
                line-height:1.4rem;
                font-size: 0.6rem;
            }
            .right{
                text-align: left;
                display: flex;
                .ju-right{
                   flex: 1;
                   text-align: right;
                }
            }

        }

        .switch {
            width: 52px;
            height: 31px;
            position: relative;
            border: 1px solid #dfdfdf;
            background-color: #fdfdfd;
            box-shadow: #dfdfdf 0 0 0 0 inset;
            border-radius: 20px;
            background-clip: content-box;
            display: inline-block;
            -webkit-appearance: none;
            user-select: none;
            outline: none;
            &:before {
                content: '';
                width: 29px;
                height: 29px;
                position: absolute;
                top: 0px;
                left: 0;
                border-radius: 20px;
                background-color: #fff;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            }
            &:checked {
                border-color: @cl_flat_greenn1;
                box-shadow: @cl_flat_greenn1 0 0 0 16px inset;
                background-color: @cl_flat_greenn1;
            }
            &:checked:before {
                left: 21px;
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


</style>






