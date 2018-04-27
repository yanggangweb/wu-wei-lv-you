<template type="text/html" lang="jade">
    f7-page(:class="name")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 修改性别
            f7-nav-right
                f7-button(@click="go_next()")  保存

        f7-list.full-container
            f7-list-item.radio#gender
                .item-radio.label 性别
                .radio-input
                    f7-list-item.input_1(name="my-radio",radio,@click= "toggle_gender(0)",v-model="form.gender",:checked="form.click0") 男
                    f7-list-item.input_2(name="my-radio",radio,@click="toggle_gender(1)",v-model="form.gender",:checked="form.click1") 女
</template>
<script type="text/ecmascript-6">
    import $ from "jquery";

    export default {
        data () {
            return {
                name: "alter-gender",
                data:"",
                address:"",
                account:"",
                form:{
                    id:"",
                    gender:1,
                    click0:true,
                    click1:false
                },
            }
        },
        computed: {
            user:function(){
                return this.$store.getters.user;
            }
        },
        methods: {
            init: function () {
                var m = this;
            },

            toggle_gender:function (gender) {
                var m = this;
                if(gender=='0'){
                    m.form.click0=true;
                    m.form.click1=false;
                    m.form.gender=0;
                }else if (gender=='1'){
                    m.form.click0=false;
                    m.form.click1=true;
                    m.form.gender=1;
                }
            },
            go_next: function () {

                var m = this;

                var para = {
                    id:m.$store.getters.user.id,
                    gender: m.form.gender,
                }
                m.req("account/update",para, {
                })
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        //m.user.gender = m.form.gender;
                        f7.alert("提交成功");
                        var paraData={
                            id:m.$store.getters.user.id,
                            nick:m.$store.getters.user.nick,
                            phone:m.$store.getters.user.phone,
                            passWord:m.$store.getters.user.passWord,
                            sign:m.$store.getters.user.sign,
                            createTime:m.$store.getters.user.createTime,
                            region:m.$store.getters.user.region,
                            qqUid:m.$store.getters.user.qqUid,
                            wxUid:m.$store.getters.user.wxUid,
                            sinaUid:m.$store.getters.user.sinaUid,
                            headImg:m.$store.getters.user.headImg,
                            name:m.$store.getters.user.name,
                            gender:m.form.gender,
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
            if(m.$store.getters.user.gender=='1' ){
                m.form.gender=1;
                m.form.click0=false;
                m.form.click1=true;

            }else if(m.$store.getters.user.gender=='0'){
                m.form.gender=0;
                m.form.click0=true;
                m.form.click1=false;
            }
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
    .alter-gender {
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
                        .item-inner:after {
                            background-color: #fff;
                        }
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

