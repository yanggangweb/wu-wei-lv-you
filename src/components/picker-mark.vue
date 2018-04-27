<template type="text/html" lang="jade">
    .picker-mark(:class="{visible:visible}")
        .close
            i.icon.i-guanbi(@click="close")
        div.main
            f7-link
                img(:src="vars.oss_url_base+ data.picture" ,@click.stop="imgJump")
            h4.tiltle {{data.title}}
            p {{data.content}}
            .inner
                slot

</template>

<script type="text/ecmascript-6">
    import $$ from "jquery";

    var masker = $$("<div class='picker-masker-hide'></div>");

    export default {
        name: 'picker',
        data () {
            return {
                dura:500,
                closing:"",
                visible:false,
                mark:"",
                advertisement:[],
                id:"",
                merchantId:"",

            }
        },
        props:{
            data:{
                title:{
                    type:String,
                    default:"标题"
                },
                content:{
                    type:String,
                    default:"内容"
                },
                picture:{
                    type:String,
                    default:"图片"
                },
            },
            map:{
                id:{
                    type:String,
                    default:""
                },
                mark:{
                    type:String,
                    default:""
                },
                merchantId:{
                    type:String,
                    default:""
                },
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
            imgJump:function () {
                var m=this;
                var mark=m.map.mark;
                var merchantId=m.map.merchantId;
                var id=m.map.id;
                m.hide();
                if( mark== "JIUDIAN"){
                    m.$parent.routeTo(`/jiudian-index-page/${merchantId}/${mark}`);
                }else if(mark == "JINGDIAN"){

                    //m.routeTo(`/jingdian-products/${m.map.merchantId}/${m.map.mark}`)
                    m.$parent.routeTo(`/jingdian-products/${m.map.merchantId}/${m.map.mark}`)
                }else if(mark == "MEISHI"){
                    m.$parent.routeTo(`/meishi-index-page/${merchantId}/${mark}`)
                }else if(mark =="TECHAN"){
                    m.$parent.routeTo(`/techan-index-page/${merchantId}/${mark}`)
                }else if(mark =="HUODONG"){
                    m.$parent.routeTo(`/huodong-index-page/${id}/${mark}`)
                }else if(mark =="ZIXUN"){
                    m.$parent.routeTo(`/zixun-index-page/${id}/${mark}`)
                }
                /*m.req("advertisement/data",{noCache:true})
                    .then(function(advertisement){
                        if(advertisement.resCode) {
                            throw advertisement.message
                        }


                    })
                    .catch(function(err){
                    })
                ;*/
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
    .picker-mark{
        position: fixed;
        z-index: 6001;
        bottom: 0;
        left: 0;
        width:100vw;
        min-height:60vh;
        max-height: 60vh;
        height: 60vh;
        top: 20vh;

        @up-shaow: fade(@cl_flat_black,20) 0px -5px 5px;

        transform: translate(0,110%);
        transition:transform 0.5s @ExpoEaseInOut;
        &.visible{
            transform: translate(0,0%);
        }

        display: flex;
        flex-direction: column;
        >div.main{
            width: 90%;
            margin: 0 auto;
            /*background-color: #fff;*/
            img{
                max-width: 100%;
                border-radius: 5px;
            }
            h4{
                line-height: 2rem;
                color: #fff;
            }
            p{
                line-height: 2.6rem;
                color: #fff;
            }
        }
        .close{
            width: 90%;
            margin: 0 auto;
            justify-content: right;
            i{
                color:#fff;
                float: right;

            }
        }
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
    .picker-masker-hide{
        background-color: fade(#000,70);
        position: fixed;
        z-index: 6000;
        .expandin;
        display: none;
        &.show{
            display: block;
        }
    }

</style>
