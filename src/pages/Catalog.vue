<template type="text/html" lang="jade">
    .catalog
        .left
            mu-list
                mu-list-item(v-for="k in list")
                    mu-icon(value=":i-globe")
                    div 家庭保洁
                mu-list-item
                    mu-icon(value=":i-globe")
                    div 家庭保洁

        .right
            template(v-for="i in list")
                mu-sub-header 小标题
                mu-flat-button(label="按钮按sd钮",labelPosition="before")
                    mu-badge(content="hot" secondary)
                mu-flat-button(label="按钮按钮ss")
                mu-flat-button(label="按钮")
                mu-flat-button(label="按钮sq")
                mu-flat-button(label="按钮按dffd钮")
                mu-flat-button(label="按钮sdssaa按钮")

</template>

<script type="text/ecmascript-6">
    export default {
        name: 'hello',
        data () {
            return {
                list:[1,2,3,1,3,2,5,8,5,8,8,5,5,5,5],
                msg: 'Welcome to Your Vue.js App'
            }
        },

        mounted:function(){
            var m = this;
            console.log("mounted");

            console.log(m.find("div"))
        },

        deactivated:function(){
            var m = this;

        },
        activated:function(){
            var m = this;

            console.log("actived");
        }


    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    @import "../styles/vars.less";

    .catalog{
        height: 100vh;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        box-sizing: border-box;
        padding-top:@top-bar-height;
        padding-bottom:@bot-bar-height;


        display: flex;

        >*{
            height: 100%;
            overflow-y: auto;
        }

        .mu-list{

        }

        .left{
            width: 90px;
            overflow-y: auto;
            background-color: @cl_flat_light;

            border-right: 2px solid @cl_bd_light;

            .mu-item-content{
                text-align: center;
            }

            .mu-item{
                border-bottom:1px solid @cl_bd_light;
                padding:@g;
            }
        }
        .right{
            flex: 1;
            padding-left:@g;

            .mu-sub-header{
                padding-left: 0;
                text-indent: 0;
                font-size: 1.6rem;
                border-bottom: 1px solid @cl_bd_light;
                margin-bottom:@g;
            }
            .mu-flat-button{
                min-width: 0;
                margin-right:@g;
                margin-bottom:@g;
                .lineh(@g*4);
                background-color: @cl_bd_light;
                .mu-flat-button-label{
                    font-size: 1rem;
                    .padding_h(@g);
                }
            }

        }
    }

</style>
