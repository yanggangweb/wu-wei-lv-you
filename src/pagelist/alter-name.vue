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
                f7-label 姓名
                f7-input#name(type="text",v-model="form.name")
</template>
<script type="text/ecmascript-6">
    import $ from "jquery";
    import {required, minLength, between} from 'vuelidate/lib/validators'
    export default {
        data () {
            return {
                name: "alter-name",
                data:"",
                address:"",
                account:"",
                form:{
                    id:"",
                    name:"",
                },
                id:""

            }
        },
        computed: {
            user:function(){
                return this.$store.getters.user;
            }
        },
        validations: {
            form:{
                name: {
                    required,
                    minLength: minLength(2)
                },
            }

        },

        methods: {
            init: function () {
                var m = this;


                /*m.req("account/accountinfo",{})
                    .then(function(data){
                        m.address=data.address;
                        m.id=data.id;
                        m.account=data.account;
                        if(data.resCode) {
                            throw data.message;
                        }
                    })
                ;*/
            },

            go_next: function () {
                var m = this;
                /*if (m.$v.form.$invalid) {
                    m.$v.form.$touch();
                }*/
                //debugger
                //var name = $("#name").val();
                    m.id=m.$store.getters.user.id;
                var para = {
                    id:m.id,
                    name: m.form.name,
                    noCache:true,
                }
                m.req("account/update",para)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        var paraData={
                            id:m.id,
                            phone:m.$store.getters.user.phone,
                            passWord:m.$store.getters.user.passWord,
                            sign:m.$store.getters.user.sign,
                            createTime:m.$store.getters.user.createTime,
                            region:m.$store.getters.user.region,
                            qqUid:m.$store.getters.user.qqUid,
                            wxUid:m.$store.getters.user.wxUid,
                            sinaUid:m.$store.getters.user.sinaUid,
                            headImg:m.$store.getters.user.headImg,
                            gender:m.$store.getters.user.gender,
                            nick:m.$store.getters.user.nick,
                            name:m.form.name,
                        }
                        m.$store.commit('saveUser',paraData)
                        //m.user.name = name;
                        //m.$store.state.user.$on("saveUser",{name:m.form.name,id:m.id})
                        f7.alert("提交成功");
                        m.goback();
                    })
                    .catch(function(err){
                        f7.alert(err,"提交失败")
                    })
                ;
            },
        },
        beforeDestroy:function(){
            var m = this;
            //m.$store.state.user.$off("saveUser",{name:m.form.name,id:m.id});
        },
        mounted: function () {
            var m = this;
            //m.init();

           m.form.name= m.$store.getters.user.name;
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
    .alter-name{
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


