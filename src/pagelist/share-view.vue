<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-list

            f7-list-item(@click="share('weixin-timeline')")
                i.icon.i-pengyouquan1
                |   朋友圈
            f7-list-item(@click="share('weixin')")
                i.icon.i-weixin2
                |   微信好友
            f7-list-item(@click="share('weibo')")
                i.icon.i-weibo(style="color:#E63C53")
                |   新浪微博
            f7-list-item(@click="share('qq')")
                i.icon.i-qq1(style="color:#30A5DD")
                |   QQ好友
            f7-list-item(@click="share('qq-zone')")
                i.icon.i-QQkongjian(style="color:#FAE033;")
                |   QQ空间


            template(v-if="$store.state.debugShowing")

                f7-list-item(@click="leave",link-close-panel="")
                    i.icon.i-jiedianjieshu
                    |   leave

                f7-list-item(@click="back",link-close-panel="")
                    i.icon.i-jiedianjieshu
                    |   back
                f7-list-item(@click="reload",link-close-panel="")
                    i.icon.i-jiedianjieshu
                    |   reload

                f7-list-item(@click="qita")
                    i.icon.i-jiedianjieshu
                    |   其他

</template>

<script type="text/ecmascript-6">
    import lockr from "lockr"
    import $ from "jquery"
    export default {
        data:function(){
            return {
                name:"share-view"
            }
        },

        methods:{
            qita:function(){
                navigator.share("欢迎使用金丝峡旅游app http://fir.im/qyly","金丝峡")
            },
            wx:function(){
                Wechat.share({
                    text: "欢迎使用金丝峡旅游app http://fir.im/qyly",
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                }, function () {
                    //alert("Success");
                    console.log("分享成功");

                }, function (reason) {
                    console.log("分享失败:",reason);
                    //alert("Failed: " + reason);
                });
            },


            leave:function(){
                if(/^file:/.test(location.href)) {
                    var base = location.href.replace(/index\.html.*$/,"")
                }
                //location.href = "http://192.1.1.10:9002?baseUrl=" + encodeURIComponent(base);

                var cordovaJsUrl = encodeURIComponent(vars.cordovaJsPrefix + "cordova.js");
                location.href = vars.debugResPrefix + "?cordovaJsUrl=" + cordovaJsUrl;


                //$("<iframe frameborder='0' style='position: fixed;z-index: 66666; width: 100%; height: 100%;' src='http://192.1.1.10:9002'></iframe>").prependTo("body");
            },

            back(){
                var m = this;
                history.back();
            },

            reload(){
                var m = this;
                location.reload();
            },

            share:function(type){
                var m = this;
                vars.share(type,"金丝峡旅游APP","","","金丝峡旅游APP是面向游客的目的地旅游APP")
                    .then(function(){
                        vars.toast("分享成功")
                    })
                    .catch(function(err){
                        //vars.toast(vars.trimErrorMessage(err))
                    })
                ;
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:share-view;
    .toolClass();
    .@{name}{
        .page-content{
            .item-content{
                .item-inner{
                    justify-content: flex-start;
                }

                .icon{
                    padding-right: 0.25em;
                    color: @main-color;
                    font-size: 2.8rem;
                }
            }
        }
    }
</style>
