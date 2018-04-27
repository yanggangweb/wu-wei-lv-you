<template type="text/html" lang="jade">
    f7-page(:class="[name]")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 回复评论


        f7-block.block()
            h3.title {{got("info.data.name")}}
            .ro-2
                textarea(v-model="comm.content")
            .ro-3
            f7-button.submit-btn(fill,big,color="orange",@click="commit") 回复



</template>

<script type="text/ecmascript-6">

    export default {
        mixins: [vars.mixin_1],
        data:function(){
            var m = this;
            return {
                name:"jingdian-comment-create",
                ...vars.itemCommData,
                data:"",
                parent:"",
                comm:{
                    type:"",
                    score:1,
                    content:"",
                    accountId:"",
                    replyedId:"",
                    id:"",
                    list:[],
                },
                info:{},
            }
        },

        methods:{
            scoreChange:function(v){
                var m = this;
                m.comm.score = v;
            },
            commit:function(){
                var m = this;

                var comment = _.merge({noCache:true},m.comm,{id:m.pid,replyedId:m.accountid});


                if(comment.content.trim().length<2) {
                    f7.alert("回复内容太短")
                    return;
                }
                m.req("comment/reply",comment)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.goback();
                        f7.alert("回复成功")
                        vars.root.$emit("comment-fresh",{id:m.id,mark:m.mark})
                    })
                    .catch(function(err){
                        f7.alert(err,"回复失败")
                    })
                ;
            }
        },
        mounted:function(){
            var m = this;

            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.parent = m.$route.params.parent;
            m.pid = m.$route.params.pid;
            m.accountid = m.$route.params.accountid;


            m.__try_login()
                .catch(function(err){
                    m.goback(true);
                    throw err;
                })
                .then(function(){
                    m.comm.type = m.mark;
                    m.comm.id = m.id;
                    return m.req("/detail",{id:m.id,mark:m.mark})
                })
                .then(function(info){
                    if(info.resCode) {
                        throw info.message;
                    }
                    m.info = info;
                })
                .catch(function(err){
                    console.log(err,"获取信息失败");
                })
            ;
        },

        components:{
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-comment-create;
    .toolClass();
    .@{name}{
        .block{
            overflow: hidden;
            margin: @page-edge;
            background-color: #ffffff;
            border-radius: 5px;

            textarea{
                box-sizing: border-box;
                padding:@page-edge/2;
                width: 100%;
                background-color: @cl_flat_light;
                height: 9em;
                border: 1px solid @cl_bd_light-2;
            }
        }

        .title{
            font-weight: 400;
            text-align: center;
            line-height: 2rem;border-bottom: 1px solid @cl_bd_light;
            padding:1em 0;
            margin-bottom: 0;
        }
        .ro-1{
            .padding_v(1rem);
            .star-list{
                margin-left: 1rem;
                .icon{
                    font-size: 1.5rem;
                }
            }
        }



        .submit-btn{
            margin-top:@page-edge;
            margin-bottom:@page-edge;
        }
    }
</style>
