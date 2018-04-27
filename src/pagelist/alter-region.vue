<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 修改个人资料
            f7-nav-right
                f7-button(@click="go_next()")  保存
        f7-list.full-container(form="")
            f7-list-item
                f7-label 地区
                f7-input#region(type="text",name="detailAddress",v-model="form.region")
</template>
<script type="text/ecmascript-6">
    import $ from "jquery";
    export default {
        data () {
            return {
                name: "alter-region",
                data:"",
                address:"",
                account:"",
                form:{
                    id:"",
                    region:""
                }
            }
        },
        computed: {
            user:function(){
                return this.$store.getters.user;
            }
        },
        methods: {

            go_next: function () {
                var m = this;
                var para = {
                    id:m.$store.getters.user.id,
                    region:m.form.region,
                }
                m.req("account/update",para, {
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.user.region = region;
                        f7.alert("提交成功");
                        var paraData={
                            id:m.id,
                            nick:m.$store.getters.user.nick,
                            phone:m.$store.getters.user.phone,
                            passWord:m.$store.getters.user.passWord,
                            sign:m.$store.getters.user.sign,
                            createTime:m.$store.getters.user.createTime,
                            qqUid:m.$store.getters.user.qqUid,
                            wxUid:m.$store.getters.user.wxUid,
                            sinaUid:m.$store.getters.user.sinaUid,
                            headImg:m.$store.getters.user.headImg,
                            gender:m.$store.getters.user.gender,
                            name:m.$store.getters.user.name,
                            region:m.form.region,
                        }
                        m.$store.commit('saveUser',paraData)
                        m.goback();
                    })
                    .catch(function(err){
                        f7.alert(err,"提交失败")
                    })
                ;
            },
        },
        mounted: function () {
            var m = this;
            m.form.region= m.$store.getters.user.region;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";

    .toolClass();
    .navbar{
            .button{
              background-color:transparent;
                border: none;
                color: @cl_flat_greenn1;
                font-size: 1rem;
        }
    }
    .alter-region {
        .list-block{
            margin: @page-edge 0;
            .radio{
                .radio-input {
                    /* display: inline-flex; */
                    -ms-flex-negative: 1;
                    flex-shrink: 1;
                    width: 70%;
                    li{
                        float: left;
                    }
                }
                .item-radio {
                    -ms-flex-align: center;
                    align-items: center;
                    width: 35%;
                    -ms-flex-negative: 0;
                    flex-shrink: 0;
                }
            }
        }

    }
</style>
