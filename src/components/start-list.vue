<template type="text/html" lang="jade">
    span.star-list(:data-value="val")
        i.icon.i-iconfontshoucang1(v-for="i in max",@click="choosed(i)")
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {
                val:1
            }
        },
        methods:{
            choosed:function(n){
                var m = this;
                if(m.noEdit)    return;
                m.val = n;
                m.$emit("input",n);
            }
        },
        watch:{
            value:function(v){
                var m = this;
                m.val = Math.ceil(v);
            }
        },

        props:{
            name:{
                type:String,
                default:"star"
            },
            max:{
                type:Number,
                default:5
            },
            value:{
                type:Number,
                default:1
            },

            noEdit:{
                default:false
            }
        },

        mounted:function(){
            var m = this;
            m.val = Math.ceil(m.value);
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    .star-list{
        .icon{ font-size: 1rem; }
        .loop(@n) when(@n<10){
            &[data-value="@{n}"]{
                .icon{
                    &:nth-child(-n + @{n}){
                        color: #F3CA03;
                    }
                }
            }
            .loop(@n + 1)
        }

        .loop(1);


        &.zanIcon{
            .icon{
                &:before{
                    content:"\e680"
                }
            }
        }
    }
</style>
