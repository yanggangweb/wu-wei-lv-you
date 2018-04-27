<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 隐私声明
        f7-block
                p.text
                    |金丝峡旅游App非常重视对您隐私的保护，请您仔细阅读如下声明。如果您不同意隐私隐私声明中的任何内容，请立即停止使用金丝峡旅游App，以下全域旅游App简称金丝峡旅游。
                h3
                    |使用范围
                p
                    |本隐私政策适用于金丝峡旅游提供的所有服务。
                    br
                    |需要特别说明的是，本隐私政策不适用于其他第三方向您提供的服务，例如金丝峡旅游上的卖家依托金丝峡旅游向您提供服务时，您向卖家提供的个人信息不适用于本隐私声明。
                h3
                    |用户权利
                p
                    |在成功登录之后，用户可以在“个人信息”中修改或更新个人信息及密码。
                h3
                    |保护隐私原则
                p
                    |金丝峡旅游将对用户所提供的资料进行严格的管理及保护，金丝峡旅游将使用相应的技术，防止您的个人资料丢失、被盗用或遭篡改，在未得到您的许可之前，金丝峡旅游不会把您的任何个人信息提供给无关的第三方（包括公司或个人）。
                h3
                    |免责条款
                h4
                    |在如下情况下，金丝峡旅游将不对您的隐私泄露承担责任：
                p
                    |① 您同意公开你的个人资料，享受为您提供的产品和服务；
                    br
                    |②  金丝峡旅游需要听从法庭传票、法律命令或遵循法律程序；
                    br
                    |③  因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用
                h3
                    |联系我们
                p
                    |如果您对此隐私申明有任何疑问或建议，请通过以下方式联系我们
                    strong :zhongguoxing888@vip.163.com
                    |，我们会尽一切努力保护您的隐私。

</template>

<script type="text/ecmascript-6">
    import Picker from "../components/picker";

    export default {
        components: {Picker},
        mixins: [vars.mixin_1],
        data: function () {

            return {
                name: "my-shengming",
                null_img: vars.null_img,
                data: {}
            }
        },
        methods: {
        },
        mounted: function () {
            var m = this;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .my-shengming{
        .content-block {
            padding: 0 30px;
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
    }


</style>






