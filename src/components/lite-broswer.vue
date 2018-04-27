<template type="text/html" lang="jade">
    picker(
        :class="name",
        ref="pk",
        @closed="clearLocation",
        @opened="pickerOpened",
        :title="title"
    )
        .toolbar(v-show="false") 工具栏/可以隐藏
        .frame
            iframe(:src="src",allowscriptaccess="always",allowfullscreen="true")
</template>

<script type="text/ecmascript-6">
    import picker from "./picker.vue"
    export default {
        data () {
            return {
                name: 'lite-broswer',
                src:"about:blank",
                title:"新窗口",
                _url:"",
            }
        },
        methods:{
            open:function(url,title){
                var m = this;
                m.$refs.pk.open();
                m._url = url;
                m.title = title || "新窗口";
            },
            close:function(){
                var m = this;
                m.clearLocation();
                m.$refs.pk.close();
            },

            clearLocation:function(){
                var m = this;
                m.src="about:blank";
            },
            pickerOpened:function(){
                var m = this;
                m.src = m._url;
            }
        },
        components:{
            picker,
        },
        mounted:function(){
            var m = this;
        },

        unmounted:function(){
            var m = this;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    @import "../styles/vars";
    @name:lite-broswer;

    div.@{name}{
        iframe{
            //width: 100vw;
            //margin-left:-@page-edge;
            //margin-bottom:-@page-edge;
            //height: calc(~"90vh" - @top-bar-height);
            border: none;
        }

        display: flex;
        flex-direction: column;
        height: 100vh;

        >h4{
            margin-top:@ios-status-bar-height;
        }
        >.inner{
            flex: 1;
            display: flex;
            padding: 0;
            .frame{
                flex: 1;
                position: relative;
                iframe{
                    position: absolute;
                    .expandin;
                }
            }
        }


    }

</style>
