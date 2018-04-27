<template type="text/html" lang=jade>
    .mine-view
        mu-raised-button.logout(label="注销",:secondary="true", :fullWidth="true",@click="logout()")

</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {
                msg: '简单组件'
            }
        },
        methods:{

        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../styles/tool.less";
    .mine-view{
        .padding_h(@g);
    }
    .logout{
        margin-top: 45vh;
    }
</style>
