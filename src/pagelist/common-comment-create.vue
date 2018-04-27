<template type="text/html" lang="jade">
    f7-page(:class="[name]",:mark="mark")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 评论


        f7-block.block()
            h3.title {{got("info.data.name")}}
            .ro-1 评分
                star-list(:value="comm.score",@input="scoreChange")
            .ro-2
                textarea(v-model="comm.content")
            .ro-3
                .photo-grid.with-dele
                    .img-cell.add-img(v-show="imageList.length<max")
                        i.icon.i-guanbi
                        vue-core-image-upload(
                            :class="['uploader']",
                            :crop="false",
                            @imageuploaded="imageuploaded",
                            :max-file-size="5242880",
                            :data="uploadData",
                            :isXhr="true",
                            :url="uploadUrl"
                        )
                    .img-cell(v-for="(img,index) in imageList")
                        i.icon.i-guanbi.dele(@click="dele(index)")
                        img(:src="vars.oss_url_base + img")


            f7-button.submit-btn(fill,big,color="orange",@click="commit") 评价



</template>

<script type="text/ecmascript-6">
    import VueCoreImageUpload  from 'vue-core-image-upload';
    var maxImageNumber = 9;

    export default {
        mixins: [vars.mixin_1],
        data:function(){
            var m = this;
            return {
                max:maxImageNumber,
                name:"jingdian-comment-create",
                ...vars.itemCommData,
                data:"",
                parent:"",
                uploadUrl:(function(){
                    return vars.server_url_base + 'picture/upload';
                })(),
                imageList:[],
                comm:{
                    type:"",
                    content:"",
                    updatePicture:"",
                    score:5,
                    accountId:"",
                    id:""
                },
                uploadData:{
                    sliderKey:"commet",
                    token:vars.store.state.userTooken
                },
                info:{},
            }
        },

        methods:{
            dele:function(index){
                var m = this;
                m.imageList.splice(index,1)
            },
            scoreChange:function(v){
                var m = this;
                m.comm.score = v;
            },
            imageuploaded:function(res){
                var m = this;
                if(res.resCode != 0) {
                    f7.alert(res.message,"图片上传失败")
                    return;
                }
                m.imageList.push(res.pictureUrl);
            },
            commit:function(){
                var m = this;

                var comment = _.merge({noCache:true},m.comm);
                comment.updatePicture = m.imageList.join(",");

                if(comment.content.trim().length<2) {
                    f7.alert("评论内容太短")
                    return;
                }


                m.req("comment/addcomment",comment)
                    .then(function(data){
                        if(data.resCode) {
                            throw data.message;
                        }
                        m.goback();
                        vars.toast("评论成功")
                        vars.root.$emit("comment-fresh",{id:m.id,mark:m.mark})
                    })
                    .catch(function(err){
                        vars.toast(vars.trimErrorMessage(err))
                    })
                ;
            }
        },
        mounted:function(){
            var m = this;
            m.id = m.$route.params.id;
            m.mark = m.$route.params.mark;
            m.parent = m.$route.params.parent;


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
            VueCoreImageUpload
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool";
    @import "../styles/vars";
    @name:jingdian-comment-create;
    .toolClass();
    .@{name}{

        &[mark="WENHUA"],
        &[mark="ZIXUN"],
        &[mark="DIANGU"],
        .hide
        {
            .ro-1{
                display: none;
            }
        }

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
