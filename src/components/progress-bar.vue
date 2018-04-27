<template type="text/html" lang="jade">
    .container
        .progressBar
            .bar(ref="abc")
</template>

<script type="text/ecmascript-6">
    import Vue from "vue";
    import _ from "lodash";
    import $ from "jquery";


    export default {
        data () {
            return {
                name: "progress-bar",
                nowWidth:'',

            }
        },

        methods:{
            start:function () {
                $(".bar").css("width","0px");
                //进度条的速度，越小越快
                var speed = 100;
                var bar=setInterval(function(){
                        var barWidth=parseInt($(".bar").width());
                    //宽度要不能大于进度条的总宽度
                    if(barWidth<=200){
                        barWidth = (barWidth + 1)+'px';
                        $(".bar").css("width",barWidth);
                    }else{
                        //进度条读满后，停止
                        clearInterval(bar);
                    }
                },speed);
            }

        },
        mounted:function(){
            var m = this;
            m.start();
        },
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    @import "../styles/vars";
    .progressBar{
        width:200px;
        height:8px;
        border:1px solid #98AFB7;
        border-radius:5px;
        margin-top:10px;
        .bar{
            width:0px;
            height:8px;
            border-radius:5px;
            background:@cl_flat_green1;
            opacity: 0.8;
        }
    }

</style>
