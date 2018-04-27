<template type="text/html" lang="jade">
    f7-page(:class="name",@page:beforeanimation="beforeanimation")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
                |   分享

</template>

<script type="text/ecmascript-6">
    export default {
        data:function(){
            return {
                name:"share-view"
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

    }
</style>
