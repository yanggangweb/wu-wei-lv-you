<template type="text/html" lang="jade">
    .cc-picker(:class="{visible:visible}")
        h4 {{title}}
            i.icon.i-guanbi(@click="close")
        .inner
            slot

</template>

<script type="text/ecmascript-6">
    import $$ from "jquery";

    var masker = $$("<div class='cc-picker-masker'></div>");

    export default {
        name: 'picker',
        data () {
            return {
                dura:500,
                closing:"",
                visible:false
            }
        },
        props:{
            title:{
                type:String,
                default:"标题"
            },
            noMask:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            show:function(){
                this.open();
            },
            hide:function(){
                this.close();
            },
            open:function(){
                var m = this;
                m.$$el.appendTo("body");
                setTimeout(function(){
                    m.visible = true;
                    m.$emit("open");
                },60)
                setTimeout(function(){
                    m.$emit("opened");
                },666)
                if(!m.noMask) {
                    masker.addClass("show")
                }
                if(m.closing) {
                    clearTimeout(m.closing);
                }
            },
            close:function(){
                var m = this;
                m.visible=false;
                m.$emit("closeing");
                m.$emit("close");
                m.closing = setTimeout(function(){
                    m.$emit("closed");
                    masker.removeClass("show")
                    m.placeholder.before(m.$$el);
                },m.dura)
            }
        },
        mounted:function(){
            var m = this;
            m.$$el = $$(m.$el)
            m.placeholder = $$("<div></div>",{style:"display:none"}).after(m.$el);
            if(!masker.parent().length) {
                masker.appendTo("body");
            }
            m._masker_click_handler = function(){
                m.close();
            }
            masker.on("click",m._masker_click_handler)
        },

        beforeDestroy:function(){
            var m = this;
            m.placeholder.remove();
            m.$$el.remove();
            masker.off("click",m._masker_click_handler)
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    @import "../styles/vars";
    @gap:15px;
    .cc-picker{
        position: fixed;
        z-index: 6001;
        bottom: 0;
        left: 0;
        width:100vw;
        min-height:60px;
        background-color: #fff;
        @up-shaow: fade(@cl_flat_black,20) 0px -5px 5px;

        transform: translate(0,110%);
        transition:transform 0.5s @ExpoEaseInOut;
        &.visible{
            transform: translate(0,0%);
        }

        display: flex;
        flex-direction: column;

        h4{
            padding:0 @gap;
            line-height: @top-bar-height;
            font-weight: 100;
            position: relative;
            font-size: 1.1rem;
            .icon{
                position: absolute;
                right: @gap;
                font-size: 1.4rem;
                top: 0px;
            }
        }
        >.inner{
            flex: 1;
            padding:@gap;
            padding-top: 0;
        }
    }
    .cc-picker-masker{
        background-color: fade(#000,20);
        position: fixed;
        z-index: 6000;
        .expandin;
        display: none;
        &.show{
            display: block;
        }
    }

</style>
